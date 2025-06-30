# test_backend.py
import requests

try:
    response = requests.post(
        "https://ai-daily-planner.onrender.com/generate",
        json={"user_input": "I want to go for a walk and do deep work."},
        timeout=10  # to prevent hanging
    )

    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())

except requests.exceptions.RequestException as e:
    print("Request failed:", e)

except Exception as e:
    print("Error:", e)
