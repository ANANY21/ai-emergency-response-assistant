"""
Test script for all 5 demonstration scenarios.
"""

from fastapi.testclient import TestClient
from backend.main import app

def run_tests():
    client = TestClient(app)
    scenarios = [
        ("1. Minor Cut", "A person has a small superficial cut on their finger."),
        ("2. Burn", "A person accidentally touched a hot pan and has a painful red area on their hand."),
        ("3. Heavy Bleeding", "A person has a deep wound on their arm and is bleeding heavily."),
        ("4. Injury", "A person fell from a bike and has severe pain and swelling in their arm."),
        ("5. Breathing Emergency", "A person is experiencing severe difficulty breathing.")
    ]

    for name, text in scenarios:
        res = client.post("/analyze", json={"text": text})
        assert res.status_code == 200, f"Failed on {name}: {res.text}"
        data = res.json()
        print(f"=== {name} ===")
        print(f"Text:       {text}")
        print(f"Event:      {data['extracted_information']['event']}")
        print(f"Body Part:  {data['extracted_information']['body_part']}")
        print(f"Symptoms:   {data['extracted_information']['symptoms']}")
        print(f"Relevant:   {data['extracted_information']['relevant_terms']}")
        print(f"Type:       {data['emergency_type']}")
        print(f"Priority:   {data['priority']} (confidence: {data['priority_confidence']})")
        print(f"Guidance:   {len(data['generated_response']['immediate_guidance'])} steps")
        print()

    print("ALL 5 DEMONSTRATION SCENARIOS TESTED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
