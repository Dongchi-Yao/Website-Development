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
            
            # Create records for SHAP analysis (matching original script)
            records = [
                (output_idx, group_name, feat_idx, shap_values[sample_idx, feat_idx, output_idx])
                for sample_idx in range(n_samples)
                for output_idx in range(n_outputs)
                for group_name, feat_indices in self.group_info.items()
                for feat_idx in feat_indices
            ]
            
            big_shap_table = pd.DataFrame(records, columns=["output_unit", "group_name", "feature_index", "shap_value"])
            
            # Get feature names from the preprocessed DataFrame structure
            df_sample = self.preprocess_user_data([0] * len(self.df.columns[:-5]))  # dummy data to get column structure
            feature_names = df_sample.columns
            
            # Create sorted SHAP table with feature names (matching original script)
            sorted_shap_table = (
                big_shap_table
                .sort_values(["output_unit", "group_name", "shap_value"], ascending=[True, True, False])
                .assign(
                    feature_name=lambda df: df["feature_index"].apply(lambda i: feature_names[i] if i < len(feature_names) else f"feature_{i}"),
                    original_feature=lambda df: df["feature_name"].str[:-2],  # Remove last 2 characters (e.g., "_0", "_1")
                )
                .loc[:, [
                    "output_unit",
                    "group_name", 
                    "feature_index",
                    "original_feature",
                    "feature_name",
                    "shap_value"
                ]]
            )
            
            # Process like original script
            # 1. Per-unit, per-group, per-feature summary
            grouped_by_feature = (
                sorted_shap_table
                .groupby(["output_unit", "group_name", "original_feature"], as_index=False)["shap_value"]
                .sum()
                .assign(shap_value=lambda d: d["shap_value"].round(4))
            )
            
            # 2. Feature-level importance across all output_units in each group
            grouped_by_group_and_feature = (
                grouped_by_feature
                .groupby(["group_name", "original_feature"], as_index=False)["shap_value"]
                .sum()
                .assign(group_importance=lambda d: d.groupby("group_name")["shap_value"].transform("sum"))
                .sort_values("original_feature")
                .reset_index(drop=True)
            )
            
            return grouped_by_group_and_feature
            
        except Exception as e:
            logger.error(f"Error processing SHAP values: {str(e)}")
            return pd.DataFrame()
    
    def generate_mitigation_strategy(self, user_data: List[int]) -> Dict[str, Any]:
        """Generate complete risk mitigation strategy matching original algorithm"""
        try:
            set_seed(0)  # For reproducibility
            
            # Get initial setup
            df_sample = self.preprocess_user_data(user_data)
            initial_risk = self.calculate_risk_score(df_sample)
            
            # Generate dynamic feature groups based on SHAP analysis (matching original algorithm)
            all_feature_lists = self._generate_dynamic_feature_lists(user_data)
            
            # If SHAP analysis failed, use fallback groups
            if not all_feature_lists:
                logger.warning("SHAP analysis failed, using fallback feature groups")
                all_feature_lists = self._get_fallback_feature_lists()
            
            # Initialize tracking variables (matching original algorithm)
            updated_indexes = []  # list-of-lists of winning indices
            current_df = df_sample.copy()
            new_dfs = []  # snapshot after every round
            risk_tracking = []  # track risk changes
            
            # Calculate initial risk
            risk_tracking.append(("Initial", initial_risk))
            
            # Process each round (matching original algorithm exactly)
            for round_num, feature_list in enumerate(all_feature_lists, 1):
                if not feature_list:  # Skip empty feature lists
                    continue
                
                updated_index = []
                current_risk = self.calculate_risk_score(current_df)
                
                # Score each feature in this round
                for target_feature in feature_list:
                    # Find columns for this feature (matching original algorithm)
                    subcat_cols = [c for c in current_df.columns if c[:-2] == target_feature]
                    if not subcat_cols:
                        logger.warning(f"No columns match feature '{target_feature}'")
                        continue
                    
                    best_idx = 0
                    best_risk = float('inf')
                    
                    # Try every level for this feature
                    for idx, subcat_col in enumerate(subcat_cols):
                        cand = current_df.copy()
                        cand[subcat_cols] = False
                        cand.loc[:, subcat_col] = True
                        
                        x = torch.tensor(cand.values.astype(int).squeeze(), dtype=torch.float).unsqueeze(0)
                        
                        with torch.no_grad():
                            pred = torch.sigmoid(self.model(x))
                        
                        risk = 0.5 * pred.mean() + 0.5 * ((pred > self.threshold).sum() / 5)
                        if risk < best_risk:
                            best_risk = risk
                            best_idx = idx
                    
                    updated_index.append(best_idx)
                
                # Apply the winning columns
                for target_feature, idx in zip(feature_list, updated_index):
                    subcat_cols = [c for c in current_df.columns if c[:-2] == target_feature]
                    if subcat_cols:
                        current_df[subcat_cols] = False
                        current_df.loc[:, subcat_cols[idx]] = True
                
                # Calculate risk after this round
                round_risk = self.calculate_risk_score(current_df)
                risk_tracking.append((f"Round {len(updated_indexes) + 1}", round_risk))
                
                updated_indexes.append(updated_index.copy())
                new_dfs.append(current_df.copy())
            
            # Generate recommendations for each round
            rounds = []
            current_df = df_sample.copy()
            
            for round_num, (feature_list, updated_index) in enumerate(zip(all_feature_lists, updated_indexes), 1):
                if not feature_list:
                    continue
                
                round_recommendations = []
                current_risk = self.calculate_risk_score(current_df)
                
                for target_feature, best_idx in zip(feature_list, updated_index):
                    subcat_cols = [c for c in current_df.columns if c[:-2] == target_feature]
                    if not subcat_cols:
                        continue
                    
                    # Find current and recommended options
                    current_col = None
                    for col in subcat_cols:
                        if current_df[col].iloc[0]:
                            current_col = col
                            break
                    
                    if current_col is None:
                        current_col = subcat_cols[0]
                    
                    recommended_col = subcat_cols[best_idx]
                    
                    # Create recommendation
                    round_recommendations.append({
                        'featureGroup': target_feature,
                        'featureName': self._get_feature_name(target_feature),
                        'currentOption': self._get_option_label(current_col),
                        'recommendedOption': self._get_option_label(recommended_col),
                        'optionIndex': best_idx,
                        'description': self._get_feature_description(target_feature)
                    })
                
                # Apply changes for next round
                for target_feature, idx in zip(feature_list, updated_index):
                    subcat_cols = [c for c in current_df.columns if c[:-2] == target_feature]
                    if subcat_cols:
                        current_df[subcat_cols] = False
                        current_df.loc[:, subcat_cols[idx]] = True
                
                projected_risk = self.calculate_risk_score(current_df)
                risk_reduction = current_risk - projected_risk
                reduction_percentage = (risk_reduction / current_risk) * 100 if current_risk > 0 else 0
                
                rounds.append({
                    'roundNumber': round_num,
                    'features': feature_list,
                    'currentRisk': current_risk,
                    'projectedRisk': projected_risk,
                    'riskReduction': risk_reduction,
                    'reductionPercentage': reduction_percentage,
                    'recommendations': round_recommendations
                })
            
            final_risk = rounds[-1]['projectedRisk'] if rounds else initial_risk
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
    
    def _generate_dynamic_feature_lists(self, user_data: List[int]) -> List[List[str]]:
        """Generate feature groups based on SHAP analysis (matching original algorithm)"""
        try:
            if self.explainer is None:
                logger.warning("SHAP explainer not available for dynamic feature grouping")
                return []
            
            # Get SHAP analysis
            shap_df = self.get_shap_analysis(user_data)
            
            if shap_df.empty:
                logger.warning("SHAP analysis returned empty results")
                return []
            
            # Process SHAP results exactly like original script
            # 1. Sort each group by shap_value (descending)
            sorted_gbf = (
                shap_df
                .groupby("group_name", group_keys=False)
                .apply(lambda x: x.sort_values("shap_value", ascending=False))
                .reset_index(drop=True)
            )
            
            # 2. Build per-rank DataFrames (matching original script logic)
            N = sorted_gbf.groupby("group_name")["shap_value"].size().max()
            
            top_dfs = {
                rank: (
                    sorted_gbf
                    .groupby("group_name")
                    .nth(rank - 1)  # 0-based inside nth()
                    .reset_index()
                )
                for rank in range(1, N + 1)  # 1-based ranks
            }
            
            # 3. Create feature lists for each round (matching original script)
            all_feature_lists = [
                top_dfs[rank]["original_feature"].dropna().tolist()
                for rank in sorted(top_dfs)
            ]
            
            logger.info(f"Generated {len(all_feature_lists)} dynamic feature groups based on SHAP analysis")
            return all_feature_lists
            
        except Exception as e:
            logger.error(f"Error in dynamic feature grouping: {str(e)}")
            return []
    
    def _get_fallback_feature_lists(self) -> List[List[str]]:
        """Fallback feature groups when SHAP analysis is not available"""
        # Return 5 rounds to match expected output
        return [
            ['1.3', '2.1.1', '3.4', '4.3'],  # Round 1: High impact features
            ['2.1.2', '2.2', '3.1', '4.1'],  # Round 2: Medium impact features  
            ['2.1.3', '3.2', '4.2'],         # Round 3: Additional improvements
            ['3.3'],                         # Round 4: Infrastructure changes
            ['1.3', '2.1.1']                 # Round 5: Final optimizations
        ]
    
    def _get_feature_name(self, feature_code: str) -> str:
        """Map feature codes to human-readable names"""
        feature_names = {
            '1.1': 'Project Duration',
            '1.2': 'Project Type',
            '1.3': 'Cybersecurity Legal Team',
            '1.4': 'Company Scale',
            '1.5': 'Project Phase',
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
            '4.3': 'Multi-Factor Authentication',
            # Additional features that might appear
            '5.1': 'Regulatory Requirements',
            '5.2': 'Stakeholder Count',
            '5.3': 'Third Party Vendors',
            '6.1': 'Remote Work Level',
            '6.2': 'Cloud Services',
            '6.3': 'Data Classification',
            '7.1': 'BMS Integration',
            '7.2': 'Access Control',
            '7.3': 'Security Monitoring',
            '8.1': 'Incident Response',
            '8.2': 'Backup Strategy',
            '8.3': 'Security Certifications',
            '9.1': 'Security Awareness',
            '9.2': 'Security Team Size',
            '9.3': 'Third Party Security Requirements',
            '10.1': 'Security Budget'
        }
        # Return the mapped name or the feature code itself if not found
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
        if feature_code == '1.1':  # Project Duration
            options = ['≤3 months', '3-6 months', '6-12 months', '12-24 months', '>24 months']
            try:
                return options[int(option_code)]
            except (ValueError, IndexError):
                return option_code
        elif feature_code == '1.2':  # Project Type
            options = ['Transportation', 'Government', 'Healthcare', 'Commercial', 'Residential', 'Other']
            try:
                return options[int(option_code)]
            except (ValueError, IndexError):
                return option_code
        elif feature_code in ['1.3', '3.1']:  # Yes/No/Unsure features
            options = ['Yes', 'No', 'Unsure']
            try:
                return options[int(option_code)]
            except (ValueError, IndexError):
                return option_code
        elif feature_code == '1.4':  # Company Scale
            options = ['≤30', '31-60', '61-100', '101-150', '>150']
            try:
                return options[int(option_code)]
            except (ValueError, IndexError):
                return option_code
        elif feature_code == '1.5':  # Project Phase
            options = ['Planning', 'Design', 'Construction', 'Maintenance', 'Demolition']
            try:
                return options[int(option_code)]
            except (ValueError, IndexError):
                return option_code
        elif feature_code == '4.2':  # Password reuse
            return 'Not Allowed' if option_code == '0' else 'Allowed'
        elif feature_code == '4.3':  # MFA
            return 'Yes' if option_code == '0' else 'No'
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
            '1.1': 'Optimize project duration to balance security implementation with project timeline',
            '1.2': 'Adjust project type classification to better align with security requirements',
            '1.3': 'Establish a dedicated cybersecurity legal team to ensure compliance and guide legal requirements',
            '1.4': 'Scale organizational resources to support comprehensive cybersecurity measures',
            '1.5': 'Align security measures with current project phase requirements',
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
            '4.3': 'Implement MFA across all project systems and access points',
            # Additional feature descriptions
            '5.1': 'Ensure comprehensive regulatory compliance for enhanced security posture',
            '5.2': 'Optimize stakeholder management to improve security communication and buy-in',
            '5.3': 'Strengthen third-party vendor security requirements and assessments',
            '6.1': 'Implement secure remote work policies and infrastructure',
            '6.2': 'Enhance cloud service security configurations and monitoring',
            '6.3': 'Implement proper data classification and handling procedures',
            '7.1': 'Secure building management system integration points',
            '7.2': 'Strengthen access control systems and procedures',
            '7.3': 'Implement comprehensive security monitoring and alerting',
            '8.1': 'Develop and test incident response procedures',
            '8.2': 'Implement robust backup and recovery strategies',
            '8.3': 'Obtain relevant security certifications for the project',
            '9.1': 'Enhance security awareness training programs',
            '9.2': 'Expand security team to meet project requirements',
            '9.3': 'Enforce third-party security compliance requirements',
            '10.1': 'Allocate appropriate budget for security initiatives'
        }
        return descriptions.get(feature_code, f'Optimize {self._get_feature_name(feature_code)} configuration for improved security')
    
    def calculate_single_recommendation_risk_reduction(self, user_data: List[int], feature_group: str, feature_name: str, 
                                                      current_option: str, recommended_option: str) -> Dict[str, float]:
        """Calculate risk reduction for a single recommendation"""
        try:
            # Preprocess current user data to get baseline
            current_df = self.preprocess_user_data(user_data)
            current_risk = self.calculate_risk_score(current_df)
            
            # Apply the specific recommendation change
            modified_df = current_df.copy()
            
            # Find the feature columns for this group
            # The columns are named like "feature_group_option" (e.g., "1.3_0", "1.3_1")
            subcat_cols = [c for c in modified_df.columns if c.startswith(f"{feature_group}_")]
            if not subcat_cols:
                logger.warning(f"No columns found for feature group: {feature_group}")
                return {'riskReduction': 0.0, 'riskReductionPercentage': 0.0}
            
            # Find the recommended column based on the option
            recommended_col = None
            for col in subcat_cols:
                if self._get_option_label(col) == recommended_option:
                    recommended_col = col
                    break
            
            if recommended_col is None:
                logger.warning(f"Could not find column for recommended option: {recommended_option}")
                logger.warning(f"Available columns: {subcat_cols}")
                logger.warning(f"Available options: {[self._get_option_label(col) for col in subcat_cols]}")
                return {'riskReduction': 0.0, 'riskReductionPercentage': 0.0}
            
            # Apply the change
            modified_df[subcat_cols] = False
            modified_df.loc[:, recommended_col] = True
            
            # Calculate new risk
            new_risk = self.calculate_risk_score(modified_df)
            risk_reduction = current_risk - new_risk
            risk_reduction_percentage = (risk_reduction / current_risk) * 100 if current_risk > 0 else 0
            
            logger.info(f"Risk reduction calculation: {feature_group} -> {recommended_option}")
            logger.info(f"Current risk: {current_risk:.4f}, New risk: {new_risk:.4f}")
            logger.info(f"Risk reduction: {risk_reduction:.4f} ({risk_reduction_percentage:.2f}%)")
            
            return {
                'riskReduction': risk_reduction,
                'riskReductionPercentage': risk_reduction_percentage
            }
            
        except Exception as e:
            logger.error(f"Error calculating single recommendation risk reduction: {str(e)}")
            return {'riskReduction': 0.0, 'riskReductionPercentage': 0.0}
    
 