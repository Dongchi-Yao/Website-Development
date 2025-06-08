import requests
import json

def test_risk_prediction(input_data):
    """Test the risk prediction endpoint with custom input data"""
    url = "http://localhost:8000/predict"
    
    # Print input data for verification
    print("\nSending the following input data:")
    for key, value in input_data.items():
        print(f"{key}: {value}")
    
    try:
        response = requests.post(url, json=input_data)
        
        if response.status_code == 200:
            result = response.json()
            print("\nRisk Assessment Results:")
            print("-" * 50)
            
            for risk_type, details in result.items():
                print(f"\n{risk_type.upper()}:")
                print(f"Risk Score: {details['score']}%")
                print(f"Risk Level: {details['level']}")
                print("Recommendations:")
                for rec in details['recommendations']:
                    print(f"- {rec}")
        else:
            print(f"\nError: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to the server. Make sure the FastAPI server is running.")
        print("Run 'py -m uvicorn app:app --reload' first.")

# Example input data
sample_input = {
    "project_duration": "6-12m",
    "project_type": "healthcare",
    "has_cyber_legal_team": "yes",
    "company_scale": "61-100",
    "project_phase": "construction",
    "layer1_teams": "21-30",
    "layer2_teams": "11-20",
    "layer3_teams": "<=10",
    "layer4_teams": "<=10",
    "layer5_teams": "<=10",
    "layer6_teams": "<=10",
    "layer7_teams": "<=10",
    "layer8_teams": "<=10",
    "team_overlap": "41-60",
    "has_it_team": "yes",
    "devices_with_firewall": "61-80",
    "network_type": "private",
    "phishing_fail_rate": "21-40",
    "governance_level": "level3",
    "allow_password_reuse": "no",
    "uses_mfa": "yes"
}

if __name__ == "__main__":
    print("Risk Quantification Service Test Script")
    print("=" * 50)
    print("\nThis script will test the risk prediction service with sample input data.")
    print("Make sure the FastAPI server is running first!")
    
    while True:
        choice = input("\nDo you want to:\n1. Use sample data\n2. Enter custom data\n3. Exit\nChoice (1-3): ")
        
        if choice == "3":
            break
        elif choice == "1":
            test_risk_prediction(sample_input)
        elif choice == "2":
            custom_input = sample_input.copy()
            print("\nEnter custom values (press Enter to keep default value):")
            
            for key, default_value in sample_input.items():
                value = input(f"{key} [{default_value}]: ").strip()
                if value:
                    custom_input[key] = value
            
            test_risk_prediction(custom_input)
        else:
            print("Invalid choice. Please select 1, 2, or 3.") 