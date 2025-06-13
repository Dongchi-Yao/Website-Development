# -*- coding: utf-8 -*-
"""
Risk Mitigation Strategy Module
Provides risk reduction analysis and optimization recommendations
"""

import pandas as pd
import torch
import numpy as np
import shap
from typing import List, Dict, Tuple, Any
import logging

logger = logging.getLogger(__name__)

def set_seed(seed=0):
    """Set random seed for reproducibility"""
    import random
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

class ProbModel(torch.nn.Module):
    """Wraps the original logits model and converts each logit → probability."""
    def __init__(self, base_model):
        super().__init__()
        self.base_model = base_model
    
    def forward(self, x):
        logits = self.base_model(x)
        return torch.sigmoid(logits)

class RiskMitigationAnalyzer:
    """Analyzes risk mitigation strategies using SHAP values and optimization"""
    
    def __init__(self, model, df, group_info, X_train=None, threshold=0.375):
        self.model = model
        self.df = df
        self.group_info = group_info
        self.threshold = threshold
        self.X_train = X_train
        self.prob_model = ProbModel(model).eval()
        
        # Initialize SHAP explainer if training data is available
        if X_train is not None:
            background = X_train[:200]
            self.explainer = shap.GradientExplainer(self.prob_model, background)
        else:
            self.explainer = None
    
    def preprocess_user_data(self, user_data: List[int]) -> pd.DataFrame:
        """Convert user input to one-hot encoded DataFrame"""
        try:
            # Get feature columns (all except last 5 columns)
            feature_cols = self.df.columns[:-5]
            sample_feat = pd.DataFrame([user_data], columns=feature_cols).astype(str)
            
            # Get all features and combine
            all_feat = self.df.iloc[:, :-5].astype(str)
            combined = pd.concat([all_feat, sample_feat], ignore_index=True)
            
            # Create one-hot encoding
            df_hot = pd.get_dummies(combined)
            df_hot["1.5_4"] = False
            df_hot = df_hot.reindex(sorted(df_hot.columns), axis=1)
            
            # Return only the user's row as DataFrame
            return df_hot.tail(1).reset_index(drop=True)
            
        except Exception as e:
            logger.error(f"Error preprocessing user data: {str(e)}")
            raise
    
    def calculate_risk_score(self, df_sample: pd.DataFrame) -> float:
        """Calculate combined risk score from DataFrame sample"""
        try:
            x = torch.tensor(df_sample.values.astype(int), dtype=torch.float)
            
            with torch.no_grad():
                pred = torch.sigmoid(self.model(x))
            
            # Combined risk score: 50% average probability + 50% threshold exceedance
            risk = 0.5 * pred.mean() + 0.5 * ((pred > self.threshold).sum() / 5)
            return risk.item()
            
        except Exception as e:
            logger.error(f"Error calculating risk score: {str(e)}")
            raise
    
    def get_shap_analysis(self, user_data: List[int]) -> pd.DataFrame:
        """Get SHAP analysis for feature importance"""
        try:
            if self.explainer is None:
                logger.warning("SHAP explainer not initialized - skipping SHAP analysis")
                return pd.DataFrame()
            
            # Preprocess data
            df_sample = self.preprocess_user_data(user_data)
            test_tensor = torch.tensor(df_sample.values.astype(int), dtype=torch.float)
            
            # Get SHAP values
            shap_values = self.explainer.shap_values(test_tensor)
            
            # Process SHAP values
            return self._process_shap_values(shap_values)
            
        except Exception as e:
            logger.error(f"Error in SHAP analysis: {str(e)}")
            return pd.DataFrame()
    
    def _process_shap_values(self, shap_values) -> pd.DataFrame:
        """Process raw SHAP values into feature importance DataFrame"""
        try:
            n_samples, n_features, n_outputs = shap_values.shape
            feature_names = self.df.columns[:-5]  # Assuming df_hot columns match
            
            # Create records for SHAP analysis
            records = [
                (output_idx, group_name, feat_idx, shap_values[sample_idx, feat_idx, output_idx])
                for sample_idx in range(n_samples)
                for output_idx in range(n_outputs)
                for group_name, feat_indices in self.group_info.items()
                for feat_idx in feat_indices
            ]
            
            big_shap_table = pd.DataFrame(records, columns=["output_unit", "group_name", "feature_index", "shap_value"])
            
            # Process and group SHAP values
            grouped_by_feature = (
                big_shap_table
                .groupby(["output_unit", "group_name", "feature_index"], as_index=False)["shap_value"]
                .sum()
                .assign(shap_value=lambda d: d["shap_value"].round(4))
            )
            
            grouped_by_group_and_feature = (
                grouped_by_feature
                .groupby(["group_name", "feature_index"], as_index=False)["shap_value"]
                .sum()
                .assign(group_importance=lambda d: d.groupby("group_name")["shap_value"].transform("sum"))
                .sort_values("feature_index")
                .reset_index(drop=True)
            )
            
            return grouped_by_group_and_feature
            
        except Exception as e:
            logger.error(f"Error processing SHAP values: {str(e)}")
            return pd.DataFrame()
    
    def generate_mitigation_strategy(self, user_data: List[int]) -> Dict[str, Any]:
        """Generate complete risk mitigation strategy"""
        try:
            set_seed(0)  # For reproducibility
            
            # Get initial setup
            df_sample = self.preprocess_user_data(user_data)
            initial_risk = self.calculate_risk_score(df_sample)
            
            # For now, use predefined feature groups since SHAP analysis is complex
            # In production, this would use the SHAP analysis results
            feature_groups = [
                ['1.3', '2.1.1', '3.4', '4.3'],  # Round 1: High impact features
                ['2.2', '3.1', '4.1'],           # Round 2: Medium impact features  
                ['3.2', '4.2'],                  # Round 3: Additional improvements
                ['3.3']                          # Round 4: Infrastructure changes
            ]
            
            # Track changes through rounds
            current_df = df_sample.copy()
            rounds = []
            current_risk = initial_risk
            
            for round_num, features in enumerate(feature_groups, 1):
                round_data = self._optimize_round(current_df, features, round_num)
                
                if round_data:
                    round_data['currentRisk'] = current_risk
                    current_risk = round_data['projectedRisk']
                    current_df = round_data['optimized_df']
                    rounds.append(round_data)
            
            final_risk = current_risk
            total_reduction = initial_risk - final_risk
            total_reduction_percentage = (total_reduction / initial_risk) * 100 if initial_risk > 0 else 0
            
            return {
                'initialRisk': initial_risk,
                'finalRisk': final_risk,
                'totalReduction': total_reduction,
                'totalReductionPercentage': total_reduction_percentage,
                'rounds': rounds,
                'implementationPriority': 'high' if total_reduction_percentage > 30 else 'medium' if total_reduction_percentage > 15 else 'low'
            }
            
        except Exception as e:
            logger.error(f"Error generating mitigation strategy: {str(e)}")
            raise
    
    def _optimize_round(self, current_df: pd.DataFrame, features: List[str], round_num: int) -> Dict[str, Any]:
        """Optimize a single round of features"""
        try:
            current_risk = self.calculate_risk_score(current_df)
            optimized_df = current_df.copy()
            recommendations = []
            
            for feature in features:
                # Find columns for this feature
                feature_cols = [c for c in current_df.columns if c.startswith(f"{feature}_")]
                
                if not feature_cols:
                    continue
                
                # Find current setting
                current_col = None
                for col in feature_cols:
                    if current_df[col].iloc[0]:
                        current_col = col
                        break
                
                # Try all options to find best
                best_risk = float('inf')
                best_col = current_col
                best_option_index = 0
                
                for idx, col in enumerate(feature_cols):
                    test_df = optimized_df.copy()
                    # Reset all feature columns
                    for fc in feature_cols:
                        test_df[fc] = False
                    # Set this option
                    test_df[col] = True
                    
                    risk = self.calculate_risk_score(test_df)
                    if risk < best_risk:
                        best_risk = risk
                        best_col = col
                        best_option_index = idx
                
                # Apply best option
                for fc in feature_cols:
                    optimized_df[fc] = False
                optimized_df[best_col] = True
                
                # Create recommendation
                current_option = self._get_option_label(current_col) if current_col else "Unknown"
                recommended_option = self._get_option_label(best_col)
                
                recommendations.append({
                    'featureGroup': feature,
                    'featureName': self._get_feature_name(feature),
                    'currentOption': current_option,
                    'recommendedOption': recommended_option,
                    'optionIndex': best_option_index,
                    'description': self._get_feature_description(feature)
                })
            
            projected_risk = self.calculate_risk_score(optimized_df)
            risk_reduction = current_risk - projected_risk
            reduction_percentage = (risk_reduction / current_risk) * 100 if current_risk > 0 else 0
            
            return {
                'roundNumber': round_num,
                'features': features,
                'projectedRisk': projected_risk,
                'riskReduction': risk_reduction,
                'reductionPercentage': reduction_percentage,
                'recommendations': recommendations,
                'optimized_df': optimized_df
            }
            
        except Exception as e:
            logger.error(f"Error optimizing round {round_num}: {str(e)}")
            return None
    
    def _get_feature_name(self, feature_code: str) -> str:
        """Map feature codes to human-readable names"""
        feature_names = {
            '1.3': 'Cybersecurity Legal Team',
            '2.1.1': 'Layer 1 Teams',
            '2.1.2': 'Layer 2 Teams',
            '2.1.3': 'Layer 3 Teams',
            '2.2': 'Team Overlap Percentage',
            '3.1': 'Dedicated IT Team',
            '3.2': 'Devices with Firewall',
            '3.3': 'Network Type',
            '3.4': 'Phishing Test Failure Rate',
            '4.1': 'Governance Level',
            '4.2': 'Password Reuse Policy',
            '4.3': 'Multi-Factor Authentication'
        }
        return feature_names.get(feature_code, feature_code)
    
    def _get_option_label(self, column_name: str) -> str:
        """Convert column name to human-readable option label"""
        if not column_name:
            return "Unknown"
        
        # Extract the option part after the last underscore
        parts = column_name.split('_')
        if len(parts) < 2:
            return column_name
        
        option_code = parts[-1]
        feature_code = '_'.join(parts[:-1])
        
        # Map based on feature type
        if feature_code in ['1.3', '3.1', '4.3']:  # Yes/No features
            return 'Yes' if option_code == '0' else 'No'
        elif feature_code == '4.2':  # Password reuse
            return 'Not Allowed' if option_code == '0' else 'Allowed'
        elif feature_code in ['2.1.1', '2.1.2', '2.1.3']:  # Team counts
            options = ['≤10', '11-20', '21-30', '31-40', '>40', 'N/A']
            try:
                return options[int(option_code)]
            except (ValueError, IndexError):
                return option_code
        elif feature_code == '2.2':  # Team overlap
            options = ['≤20%', '21-40%', '41-60%', '61-80%', '81-100%']
            try:
                return options[int(option_code)]
            except (ValueError, IndexError):
                return option_code
        elif feature_code in ['3.2', '3.4']:  # Percentages
            options = ['≤20%', '21-40%', '41-60%', '61-80%', '81-100%']
            try:
                return options[int(option_code)]
            except (ValueError, IndexError):
                return option_code
        elif feature_code == '3.3':  # Network type
            options = ['Public', 'Private', 'Both']
            try:
                return options[int(option_code)]
            except (ValueError, IndexError):
                return option_code
        elif feature_code == '4.1':  # Governance level
            options = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5']
            try:
                return options[int(option_code)]
            except (ValueError, IndexError):
                return option_code
        
        return option_code
    
    def _get_feature_description(self, feature_code: str) -> str:
        """Get description for feature improvements"""
        descriptions = {
            '1.3': 'Establish a dedicated cybersecurity legal team to ensure compliance and guide legal requirements',
            '2.1.1': 'Expand core project teams to improve security oversight and resource allocation',
            '2.1.2': 'Optimize secondary team structure for better security coordination',
            '2.1.3': 'Adjust tertiary team arrangements to minimize security gaps',
            '2.2': 'Reduce team overlap to minimize shared security vulnerabilities',
            '3.1': 'Establish a dedicated IT team for proactive security management',
            '3.2': 'Increase firewall deployment across all project devices',
            '3.3': 'Transition to more secure network infrastructure',
            '3.4': 'Improve security awareness training to reduce susceptibility to phishing attacks',
            '4.1': 'Enhance governance practices and cybersecurity policy commitment',
            '4.2': 'Implement strict password reuse restrictions',
            '4.3': 'Implement MFA across all project systems and access points'
        }
        return descriptions.get(feature_code, f'Improve {feature_code} configuration') 