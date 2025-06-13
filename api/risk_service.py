from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
import torch
import numpy as np
import pandas as pd
from typing import List, Dict
import os
import json
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from sse_starlette.sse import EventSourceResponse
import logging
from risk_mitigation_strategy import RiskMitigationAnalyzer

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store latest risk probabilities
latest_probabilities = None

class RiskInput(BaseModel):
    user_data: List[int]

class RiskOutput(BaseModel):
    probabilities: List[float]
    risk_types: List[str] = ["ransomware", "phishing", "dataBreach", "insiderAttack", "supplyChain"]

class MitigationRecommendation(BaseModel):
    featureGroup: str
    featureName: str
    currentOption: str
    recommendedOption: str
    optionIndex: int
    description: str

class MitigationRound(BaseModel):
    roundNumber: int
    features: List[str]
    currentRisk: float
    projectedRisk: float
    riskReduction: float
    reductionPercentage: float
    recommendations: List[MitigationRecommendation]

class MitigationStrategy(BaseModel):
    initialRisk: float
    finalRisk: float
    totalReduction: float
    totalReductionPercentage: float
    rounds: List[MitigationRound]
    implementationPriority: str

def set_seed(seed):
    import random
    import torch
    import numpy as np
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

def load_model_and_data():
    """Load the PyTorch model, data, and required files"""
    try:
        # Set paths relative to script location
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_dir = os.path.join(script_dir, "..", "New models for the risk quant")
        data_dir = os.path.join(model_dir, "files needed-do not change")
        logger.debug(f"Data directory: {data_dir}")
        
        # Load training data
        df = pd.read_csv(os.path.join(data_dir, 'new_data.csv'))
        logger.debug(f"Data loaded successfully. Shape: {df.shape}")
        
        # Load group info
        group_info_2 = torch.load(os.path.join(data_dir, "group_info_2.pth"))
        logger.debug("Group info loaded successfully")
        
        # Import model definition
        model_def_path = os.path.join(data_dir, "mixture_of_experts_model_definition.py")
        logger.debug(f"Loading model definition from: {model_def_path}")
        with open(model_def_path) as f:
            exec(f.read(), globals())
        logger.debug("Model definition loaded successfully")
        
        # Initialize model with exact same parameters as script.py
        model = MixtureOfExperts(
            group_info_2,
            hidden_dim=64,
            output_dim=5,
            expert_depth=1,
            expert_residual=True,
            gating_use_mlp=False,
            gating_hidden_dim=128
        )
        logger.debug("Model initialized successfully")
        
        # Load model weights
        checkpoint = torch.load(
            os.path.join(data_dir, "best_model_ft.pth"),
            map_location=torch.device('cpu')
        )
        model.load_state_dict(checkpoint['model_state_dict'])
        model.eval()
        logger.debug("Model weights loaded successfully")
        
        return model, df, group_info_2
    except Exception as e:
        logger.error(f"Error loading model and data: {str(e)}", exc_info=True)
        return None, None, None

# Load model and data at startup
logger.info("Loading model and data...")
model, df, group_info_2 = load_model_and_data()
logger.info("Model and data loading completed")

# Initialize risk mitigation analyzer
mitigation_analyzer = None
if model is not None and df is not None and group_info_2 is not None:
    try:
        mitigation_analyzer = RiskMitigationAnalyzer(model, df, group_info_2)
        logger.info("Risk mitigation analyzer initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize risk mitigation analyzer: {str(e)}")
        mitigation_analyzer = None

def preprocess_input(user_data: List[int], df: pd.DataFrame) -> torch.Tensor:
    """Preprocess input data exactly as in script.py"""
    try:
        logger.debug(f"Preprocessing input data: {user_data}")
        
        # Ensure user_data has exactly 16 elements
        if len(user_data) != 16:
            raise ValueError("Input data must have exactly 16 numbers")
        
        # Get feature columns (all except last 5 columns)
        feature_cols = df.columns[:-5]
        logger.debug(f"Feature columns: {feature_cols.tolist()}")
        
        # Create sample features DataFrame
        sample_feat = pd.DataFrame([user_data], columns=feature_cols).astype(str)
        logger.debug("Sample features created")
        
        # Get all features except last 5 columns and convert to string
        all_feat = df.iloc[:, :-5].astype(str)
        combined = pd.concat([all_feat, sample_feat], ignore_index=True)
        logger.debug(f"Combined data shape: {combined.shape}")
        
        # Create one-hot encoding exactly as in script.py
        df_hot = pd.get_dummies(combined)
        df_hot["1.5_4"] = False
        df_hot = df_hot.reindex(sorted(df_hot.columns), axis=1)
        logger.debug(f"One-hot encoded shape: {df_hot.shape}")
        
        # Get only the last row (our input data)
        sample_tensor = torch.tensor(df_hot.tail(1).values.astype(int), dtype=torch.float)
        logger.debug(f"Final tensor shape: {sample_tensor.shape}")
        
        return sample_tensor
    except Exception as e:
        logger.error(f"Error in preprocessing: {str(e)}", exc_info=True)
        raise

@app.get("/health")
async def health_check():
    """Check if the service is healthy and model is loaded"""
    status = {
        "status": "healthy",
        "model_loaded": model is not None and df is not None,
        "model_type": str(type(model)) if model else None,
        "data_shape": df.shape if df is not None else None,
        "mitigation_analyzer_loaded": mitigation_analyzer is not None
    }
    logger.debug(f"Health check: {status}")
    return status

@app.post("/predict")
async def predict_risks(input_data: RiskInput) -> RiskOutput:
    """Predict risk probabilities from input data"""
    global latest_probabilities
    
    logger.debug(f"Received prediction request with data: {input_data.user_data}")
    
    if model is None or df is None:
        logger.error("Model or data not loaded")
        raise HTTPException(status_code=500, detail="Model or data not loaded")
    
    try:
        # Preprocess input data
        input_tensor = preprocess_input(input_data.user_data, df)
        logger.debug(f"Input tensor prepared: {input_tensor.shape}")
        
        # Get predictions exactly as in script.py
        with torch.no_grad():
            logits = model(input_tensor)
            probs = torch.sigmoid(logits).squeeze().tolist()
            logger.debug(f"Predictions generated: {probs}")
        
        # Update latest probabilities
        latest_probabilities = {
            "ransomware": probs[0],
            "phishing": probs[1],
            "dataBreach": probs[2],
            "insiderAttack": probs[3],
            "supplyChain": probs[4]
        }
        logger.debug(f"Latest probabilities updated: {latest_probabilities}")
        
        return RiskOutput(probabilities=probs)
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/mitigation-strategy")
async def generate_mitigation_strategy(input_data: RiskInput) -> MitigationStrategy:
    """Generate risk mitigation strategy from input data"""
    logger.debug(f"Received mitigation strategy request with data: {input_data.user_data}")
    
    if mitigation_analyzer is None:
        logger.error("Mitigation analyzer not initialized")
        raise HTTPException(status_code=500, detail="Mitigation analyzer not initialized")
    
    try:
        # Generate mitigation strategy
        strategy_data = mitigation_analyzer.generate_mitigation_strategy(input_data.user_data)
        logger.debug(f"Mitigation strategy generated successfully")
        
        # Convert to Pydantic models
        rounds = []
        for round_data in strategy_data['rounds']:
            recommendations = [
                MitigationRecommendation(**rec) for rec in round_data['recommendations']
            ]
            round_obj = MitigationRound(
                roundNumber=round_data['roundNumber'],
                features=round_data['features'],
                currentRisk=round_data['currentRisk'],
                projectedRisk=round_data['projectedRisk'],
                riskReduction=round_data['riskReduction'],
                reductionPercentage=round_data['reductionPercentage'],
                recommendations=recommendations
            )
            rounds.append(round_obj)
        
        strategy = MitigationStrategy(
            initialRisk=strategy_data['initialRisk'],
            finalRisk=strategy_data['finalRisk'],
            totalReduction=strategy_data['totalReduction'],
            totalReductionPercentage=strategy_data['totalReductionPercentage'],
            rounds=rounds,
            implementationPriority=strategy_data['implementationPriority']
        )
        
        return strategy
        
    except Exception as e:
        logger.error(f"Mitigation strategy generation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Mitigation strategy generation error: {str(e)}")

@app.get("/stream")
async def stream_risk_probabilities():
    """Stream risk probabilities using Server-Sent Events"""
    async def event_generator():
        while True:
            if latest_probabilities:
                yield {
                    "event": "message",
                    "data": json.dumps(latest_probabilities)
                }
            await asyncio.sleep(1)

    return EventSourceResponse(event_generator())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug") 