from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
import torch
import numpy as np
import pandas as pd
from typing import List, Dict, Optional
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
    current_risk: Optional[float] = None  # Override for consistent risk calculation

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
    riskReduction: float = 0.0  # Individual recommendation risk reduction

class RecommendationRiskReduction(BaseModel):
    featureGroup: str
    featureName: str
    currentOption: str
    recommendedOption: str
    riskReduction: float
    riskReductionPercentage: float

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
    """Load the PyTorch model and preprocessing data"""
    try:
        logger.debug("Starting model and data loading...")
        
        # Get the directory containing the model files
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # Model files are in the backend python_service directory
        data_dir = os.path.join(os.path.dirname(current_dir), "cyber-risk-dashboard", "backend", "python_service", "models")
        logger.debug(f"Data directory: {data_dir}")
        
        # Load reference data for preprocessing
        df_path = os.path.join(data_dir, "new_data.csv")
        logger.debug(f"Loading reference data from: {df_path}")
        df = pd.read_csv(df_path)
        logger.debug(f"Reference data loaded. Shape: {df.shape}")
        
        # Load group info
        group_info_path = os.path.join(data_dir, "group_info_2.pth")
        logger.debug(f"Loading group info from: {group_info_path}")
        group_info_2 = torch.load(group_info_path, map_location=torch.device('cpu'))
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
        
        # Create synthetic X_train for SHAP analysis
        logger.debug("Creating synthetic X_train for SHAP analysis...")
        X_train = create_synthetic_training_data(df, group_info_2)
        logger.debug(f"Synthetic X_train created. Shape: {X_train.shape}")
        
        return model, df, group_info_2, X_train
    except Exception as e:
        logger.error(f"Error loading model and data: {str(e)}", exc_info=True)
        return None, None, None, None

def create_synthetic_training_data(df: pd.DataFrame, group_info: dict) -> torch.Tensor:
    """Create synthetic training data for SHAP analysis"""
    try:
        # Get feature columns (all except last 5 columns)
        feature_cols = df.columns[:-5]
        
        # Create synthetic samples by varying the original data
        synthetic_samples = []
        
        # Use original data as base
        for _, row in df.head(100).iterrows():  # Use first 100 samples as base
            # Get the feature values
            feature_values = row[feature_cols].astype(str).tolist()
            
            # Create variations of this sample
            for variation in range(5):  # Create 5 variations per sample
                # Randomly modify some features
                modified_values = feature_values.copy()
                for i in range(len(modified_values)):
                    if np.random.random() < 0.3:  # 30% chance to modify each feature
                        # Get possible values for this feature
                        possible_values = df[feature_cols[i]].astype(str).unique()
                        modified_values[i] = np.random.choice(possible_values)
                
                synthetic_samples.append(modified_values)
        
        # Create one-hot encoding for all synthetic samples
        synthetic_df = pd.DataFrame(synthetic_samples, columns=feature_cols)
        
        # Combine with original data for one-hot encoding
        all_feat = df.iloc[:, :-5].astype(str)
        combined = pd.concat([all_feat, synthetic_df], ignore_index=True)
        
        # Create one-hot encoding
        df_hot = pd.get_dummies(combined)
        df_hot["1.5_4"] = False
        df_hot = df_hot.reindex(sorted(df_hot.columns), axis=1)
        
        # Get only the synthetic samples (after the original data)
        synthetic_hot = df_hot.iloc[len(df):].reset_index(drop=True)
        
        # Convert to tensor
        X_train = torch.tensor(synthetic_hot.values.astype(int), dtype=torch.float)
        
        logger.debug(f"Created synthetic X_train with {len(synthetic_samples)} samples")
        return X_train
        
    except Exception as e:
        logger.error(f"Error creating synthetic training data: {str(e)}")
        # Fallback: create simple random data
        logger.warning("Using fallback random training data")
        num_samples = 200
        num_features = sum(len(cols) for cols in group_info.values())
        return torch.randint(0, 2, (num_samples, num_features), dtype=torch.float)

# Load model and data at startup
logger.info("Loading model and data...")
model, df, group_info_2, X_train = load_model_and_data()
logger.info("Model and data loading completed")

# Initialize risk mitigation analyzer
mitigation_analyzer = None
if model is not None and df is not None and group_info_2 is not None:
    try:
        mitigation_analyzer = RiskMitigationAnalyzer(model, df, group_info_2, X_train)
        logger.info("Risk mitigation analyzer initialized successfully with SHAP support")
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

class RecommendationRiskReductionRequest(BaseModel):
    user_data: List[int]
    featureGroup: str
    featureName: str
    currentOption: str
    recommendedOption: str
    current_risk: Optional[float] = None  # Override for consistent risk calculation

@app.post("/recommendation-risk-reduction")
async def calculate_recommendation_risk_reduction(request: RecommendationRiskReductionRequest) -> RecommendationRiskReduction:
    """Calculate risk reduction for a specific recommendation"""
    logger.debug(f"Received recommendation risk reduction request: {request}")
    
    if mitigation_analyzer is None:
        logger.error("Mitigation analyzer not initialized")
        raise HTTPException(status_code=500, detail="Mitigation analyzer not initialized")
    
    try:
        # Calculate risk reduction for the specific recommendation
        risk_reduction_data = mitigation_analyzer.calculate_single_recommendation_risk_reduction(
            request.user_data,
            request.featureGroup,
            request.featureName,
            request.currentOption,
            request.recommendedOption,
            current_risk_override=request.current_risk
        )
        
        return RecommendationRiskReduction(
            featureGroup=request.featureGroup,
            featureName=request.featureName,
            currentOption=request.currentOption,
            recommendedOption=request.recommendedOption,
            riskReduction=risk_reduction_data['riskReduction'],
            riskReductionPercentage=risk_reduction_data['riskReductionPercentage']
        )
        
    except Exception as e:
        logger.error(f"Recommendation risk reduction calculation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Recommendation risk reduction calculation error: {str(e)}")

@app.post("/mitigation-strategy")
async def generate_mitigation_strategy(input_data: RiskInput) -> MitigationStrategy:
    """Generate risk mitigation strategy from input data"""
    logger.debug(f"Received mitigation strategy request with data: {input_data.user_data}")
    
    if mitigation_analyzer is None:
        logger.error("Mitigation analyzer not initialized")
        raise HTTPException(status_code=500, detail="Mitigation analyzer not initialized")
    
    try:
        # Generate mitigation strategy with optional current_risk override
        strategy_data = mitigation_analyzer.generate_mitigation_strategy(
            input_data.user_data, 
            current_risk_override=input_data.current_risk
        )
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
    uvicorn.run(app, host="0.0.0.0", port=50004, log_level="debug") 