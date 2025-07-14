import requests
import json

# Test data
test_data = {
    "user_data": [4, 3, 1, 4, 2, 2, 4, 5, 0, 0, 1, 2, 2, 1, 0, 1]
}

# Test the mitigation strategy endpoint
try:
    response = requests.post(
        "http://localhost:50004/mitigation-strategy",
        json=test_data,
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code == 200:
        result = response.json()
        
        print("✅ Mitigation strategy generated successfully!")
        print(f"Initial Risk: {result['initialRisk']:.4f}")
        print(f"Final Risk: {result['finalRisk']:.4f}")
        print(f"Total Reduction: {result['totalReduction']:.4f} ({result['totalReductionPercentage']:.2f}%)")
        print(f"Implementation Priority: {result['implementationPriority']}")
        print(f"Number of Rounds: {len(result['rounds'])}")
        
        total_recommendations = 0
        for i, round_data in enumerate(result['rounds'], 1):
            print(f"\n📋 Round {i}:")
            print(f"   Features: {round_data['features']}")
            print(f"   Current Risk: {round_data['currentRisk']:.4f}")
            print(f"   Projected Risk: {round_data['projectedRisk']:.4f}")
            print(f"   Risk Reduction: {round_data['riskReduction']:.4f} ({round_data['reductionPercentage']:.2f}%)")
            print(f"   Recommendations: {len(round_data['recommendations'])}")
            
            total_recommendations += len(round_data['recommendations'])
            
            for j, rec in enumerate(round_data['recommendations'], 1):
                print(f"     {j}. {rec['featureName']}: {rec['currentOption']} → {rec['recommendedOption']}")
        
        print(f"\n📊 Summary:")
        print(f"   Total Rounds: {len(result['rounds'])}")
        print(f"   Total Recommendations: {total_recommendations}")
        
        # Check if we have 5 rounds and approximately 16 recommendations
        if len(result['rounds']) == 5:
            print("✅ Correct number of rounds (5)")
        else:
            print(f"❌ Expected 5 rounds, got {len(result['rounds'])}")
            
        if total_recommendations >= 15:  # Allow some flexibility
            print("✅ Good number of recommendations")
        else:
            print(f"❌ Expected ~16 recommendations, got {total_recommendations}")
            
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"❌ Error testing API: {str(e)}") 