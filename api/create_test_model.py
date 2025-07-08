import torch
import torch.nn as nn
import pandas as pd
import numpy as np

# Create a simple neural network for risk prediction
class RiskModel(nn.Module):
    def __init__(self, input_size=20):
        super(RiskModel, self).__init__()
        self.layer1 = nn.Linear(input_size, 64)
        self.layer2 = nn.Linear(64, 32)
        self.layer3 = nn.Linear(32, 5)  # 5 risk types
        self.relu = nn.ReLU()
        
    def forward(self, x):
        x = self.relu(self.layer1(x))
        x = self.relu(self.layer2(x))
        x = self.layer3(x)
        return x

# Create and save a test model
model = RiskModel()
torch.save(model, 'model.pt')

# Create sample training data
n_samples = 1000
n_features = 20

# Generate random feature data
data = np.random.randint(0, 5, size=(n_samples, n_features))
df = pd.DataFrame(data)

# Add column names
feature_names = [
    'project_duration', 'project_type', 'has_cyber_legal_team', 'company_scale',
    'project_phase', 'layer1_teams', 'layer2_teams', 'layer3_teams', 'team_overlap',
    'has_it_team', 'devices_with_firewall', 'network_type', 'phishing_fail_rate',
    'governance_level', 'allow_password_reuse', 'uses_mfa', 'feature17', 'feature18',
    'feature19', 'feature20'
]

df.columns = feature_names

# Save the training data
df.to_csv('training_data.csv', index=False)

print("Test model and training data created successfully!") 