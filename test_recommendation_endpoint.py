#!/usr/bin/env python3
"""
Test script for the recommendation risk reduction endpoint
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'api'))

try:
    from risk_mitigation_strategy import RiskMitigationAnalyzer
    import torch
    import pandas as pd
    import numpy as np
    
    # Mock data for testing
    class MockModel:
        def __init__(self):
            pass
        
        def __call__(self, x):
            # Mock predictions
            return torch.tensor([[0.3, 0.4, 0.5, 0.6, 0.7]])
    
    # Create mock data
    mock_df = pd.DataFrame({
        '1.3_0': [True, False, False],
        '1.3_1': [False, True, False],
        '2.1.1_0': [True, False, False],
        '2.1.1_1': [False, True, False],
        '2.1.1_2': [False, False, True],
        'ransomware': [0.3, 0.4, 0.5],
        'phishing': [0.4, 0.5, 0.6],
        'dataBreach': [0.5, 0.6, 0.7],
        'insiderAttack': [0.6, 0.7, 0.8],
        'supplyChain': [0.7, 0.8, 0.9]
    })
    
    mock_group_info = {
        'group1': [0, 1],
        'group2': [2, 3, 4]
    }
    
    # Create analyzer
    model = MockModel()
    analyzer = RiskMitigationAnalyzer(model, mock_df, mock_group_info)
    
    # Test the method
    result = analyzer.calculate_single_recommendation_risk_reduction(
        feature_group="1.3",
        feature_name="Cybersecurity Legal Team",
        current_option="No",
        recommended_option="Yes"
    )
    
    print("Test Result:")
    print(f"Risk Reduction: {result['riskReduction']:.4f}")
    print(f"Risk Reduction Percentage: {result['riskReductionPercentage']:.2f}%")
    print("✅ Test completed successfully!")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're in the correct directory and Python is properly installed")
except Exception as e:
    print(f"❌ Test failed: {e}")
    import traceback
    traceback.print_exc() 