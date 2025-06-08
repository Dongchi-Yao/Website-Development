from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import pandas as pd
import numpy as np
import json
import os
from typing import List, Dict

app = FastAPI(title="Risk Quantification Service", version="1.0.0")

# Pydantic models for request/response
class RiskInput(BaseModel):
    project_duration: str
    project_type: str
    has_cyber_legal_team: str
    company_scale: str
    project_phase: str
    layer1_teams: str
    layer2_teams: str
    layer3_teams: str
    layer4_teams: str
    layer5_teams: str
    layer6_teams: str
    layer7_teams: str
    layer8_teams: str
    team_overlap: str
    has_it_team: str
    devices_with_firewall: str
    network_type: str
    phishing_fail_rate: str
    governance_level: str
    allow_password_reuse: str
    uses_mfa: str

class RiskOutput(BaseModel):
    ransomware: Dict[str, any]
    phishing: Dict[str, any]
    data_breach: Dict[str, any]
    insider_attack: Dict[str, any]
    supply_chain: Dict[str, any]

# Global variables for model and preprocessing
model_ft = None
df_reference = None
feature_cols = None
group_info_2 = None

def load_model():
    """Load the PyTorch model and preprocessing data"""
    global model_ft, df_reference, feature_cols, group_info_2
    
    try:
        print("Starting model loading...")
        
        # Load reference data for preprocessing
        print("Loading reference data...")
        df_reference = pd.read_csv('models/new_data.csv')
        feature_cols = df_reference.columns[:-5]  # Exclude the last 5 columns (target variables)
        print(f"Reference data loaded. Features: {len(feature_cols)}")
        
        # Load group info
        print("Loading group info...")
        group_info_2 = torch.load('models/group_info_2.pth', map_location=torch.device('cpu'))
        print("Group info loaded successfully")
        
        # Import and initialize model
        print("Initializing model...")
        from models.mixture_of_experts_model_definition import MixtureOfExperts
        
        model_ft = MixtureOfExperts(
            group_info_2,
            hidden_dim=64,
            output_dim=5,
            expert_depth=1,
            expert_residual=True,
            gating_use_mlp=False,
            gating_hidden_dim=128
        )
        print("Model initialized")
        
        # Load trained weights
        print("Loading model weights...")
        checkpoint = torch.load('models/best_model_ft.pth', map_location=torch.device('cpu'))
        model_ft.load_state_dict(checkpoint['model_state_dict'])
        model_ft.eval()
        
        print("Model loaded successfully!")
        
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise e

def map_frontend_to_model_input(risk_input: RiskInput) -> List[int]:
    """
    Map frontend form values to the 16 model input features
    Based on the column structure: 1.1,1.2,1.3,1.4,1.5,2.1.1,2.1.2,2.1.3,2.2,3.1,3.2,3.3,3.4,4.1,4.2,4.3
    """
    
    # Mapping dictionaries for each feature
    duration_map = {"<=3m": 0, "3-6m": 1, "6-12m": 2, "12-24m": 3, ">24m": 4}
    
    project_type_map = {
        "transportation": 0, "government": 1, "healthcare": 2, 
        "commercial": 3, "residential": 4, "other": 5
    }
    
    yes_no_map = {"yes": 1, "no": 0, "unsure": 0}
    
    company_scale_map = {"<=30": 0, "31-60": 1, "61-100": 2, "101-150": 3, ">150": 4}
    
    project_phase_map = {
        "planning": 0, "design": 1, "construction": 2, 
        "maintenance": 3, "demolition": 4
    }
    
    team_count_map = {"<=10": 0, "11-20": 1, "21-30": 2, "31-40": 3, ">40": 4, "na": 0}
    
    percentage_map = {"<=20": 0, "21-40": 1, "41-60": 2, "61-80": 3, "81-100": 4}
    
    network_map = {"public": 0, "private": 1, "both": 2}
    
    governance_map = {"level1": 0, "level2": 1, "level3": 2, "level4": 3, "level5": 4}
    
    # Map input values to model format (16 features)
    user_data = [
        duration_map.get(risk_input.project_duration, 0),  # 1.1
        project_type_map.get(risk_input.project_type, 0),  # 1.2
        yes_no_map.get(risk_input.has_cyber_legal_team, 0),  # 1.3
        company_scale_map.get(risk_input.company_scale, 0),  # 1.4
        project_phase_map.get(risk_input.project_phase, 0),  # 1.5
        team_count_map.get(risk_input.layer1_teams, 0),  # 2.1.1
        team_count_map.get(risk_input.layer2_teams, 0),  # 2.1.2
        team_count_map.get(risk_input.layer3_teams, 0),  # 2.1.3
        percentage_map.get(risk_input.team_overlap, 0),  # 2.2
        yes_no_map.get(risk_input.has_it_team, 0),  # 3.1
        percentage_map.get(risk_input.devices_with_firewall, 0),  # 3.2
        network_map.get(risk_input.network_type, 0),  # 3.3
        percentage_map.get(risk_input.phishing_fail_rate, 0),  # 3.4
        governance_map.get(risk_input.governance_level, 0),  # 4.1
        yes_no_map.get(risk_input.allow_password_reuse, 0),  # 4.2
        yes_no_map.get(risk_input.uses_mfa, 0),  # 4.3
    ]
    
    return user_data

def preprocess_input(user_data: List[int]) -> torch.Tensor:
    """Preprocess input data using one-hot encoding like in the original script"""
    global df_reference, feature_cols
    
    # Create dataframe with user input
    sample_feat = pd.DataFrame([user_data], columns=feature_cols).astype(str)
    
    # Get all reference features and combine with user input
    all_feat = df_reference.iloc[:, :-5].astype(str)
    combined = pd.concat([all_feat, sample_feat], ignore_index=True)
    
    # One-hot encode
    df_hot = pd.get_dummies(combined)
    
    # Add missing column if necessary (from original script)
    if "1.5_4" not in df_hot.columns:
        df_hot["1.5_4"] = False
    
    # Reindex columns
    df_hot = df_hot.reindex(sorted(df_hot.columns), axis=1)
    
    # Get the last row (user input) and convert to tensor
    sample_tensor = torch.tensor(df_hot.tail(1).values.astype(int), dtype=torch.float)
    
    return sample_tensor

def get_risk_level(score: float) -> str:
    """Convert probability score to risk level"""
    if score <= 0.25:
        return "low"
    elif score <= 0.50:
        return "medium"
    elif score <= 0.75:
        return "high"
    else:
        return "critical"

def get_recommendations(risk_type: str, score: float) -> List[str]:
    """Get recommendations based on risk type and score"""
    recommendations_db = {
        "ransomware": [
            "Implement regular backup procedures",
            "Deploy advanced endpoint protection",
            "Conduct regular security awareness training",
            "Implement network segmentation",
            "Deploy anti-ransomware solutions"
        ],
        "phishing": [
            "Implement email filtering solutions",
            "Enhance security awareness training",
            "Deploy multi-factor authentication",
            "Implement email authentication protocols",
            "Regular phishing simulation tests"
        ],
        "data_breach": [
            "Implement data encryption at rest and in transit",
            "Enhance access control mechanisms",
            "Regular security audits and monitoring",
            "Implement data loss prevention (DLP)",
            "Deploy database activity monitoring"
        ],
        "insider_attack": [
            "Implement user behavior analytics",
            "Enhance access control and monitoring",
            "Regular security training for employees",
            "Implement privileged access management",
            "Deploy insider threat detection systems"
        ],
        "supply_chain": [
            "Implement vendor risk assessment program",
            "Enhance supply chain security controls",
            "Regular security audits of third-party vendors",
            "Implement supplier security standards",
            "Deploy third-party risk monitoring"
        ]
    }
    
    # Return top 3-5 recommendations based on score severity
    recs = recommendations_db.get(risk_type, [])
    if score > 0.75:
        return recs[:5]  # All recommendations for critical
    elif score > 0.50:
        return recs[:4]  # 4 recommendations for high
    else:
        return recs[:3]  # 3 recommendations for medium/low

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model()

@app.get("/")
async def root():
    return {"message": "Risk Quantification Service is running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "model_loaded": model_ft is not None}

@app.post("/predict", response_model=RiskOutput)
async def predict_risk(risk_input: RiskInput):
    """Main prediction endpoint"""
    try:
        if model_ft is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        # Map frontend input to model format
        user_data = map_frontend_to_model_input(risk_input)
        
        # Preprocess input
        sample_tensor = preprocess_input(user_data)
        
        # Make prediction
        with torch.no_grad():
            logits = model_ft(sample_tensor)
            probs = torch.sigmoid(logits)
        
        # Convert to numpy for easier handling
        probs_np = probs.numpy()[0]
        
        # Risk type names (order matters - should match model training)
        risk_types = ["ransomware", "phishing", "data_breach", "insider_attack", "supply_chain"]
        
        # Build response
        results = {}
        for i, risk_type in enumerate(risk_types):
            score = float(probs_np[i])
            level = get_risk_level(score)
            recommendations = get_recommendations(risk_type, score)
            
            results[risk_type] = {
                "score": int(score * 100),  # Convert to percentage
                "level": level,
                "recommendations": recommendations
            }
        
        return RiskOutput(**results)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 