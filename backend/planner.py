import requests
from models import PlanRequest, PlanResponse

def generate_schedule(request: PlanRequest) -> PlanResponse:
    prompt = f"""
You are a productivity assistant. The user said: "{request.user_input}".
Create a realistic, time-blocked plan for a productive day from 9 AM to 9 PM.
Include work blocks, short breaks, and make it easy to follow.
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "mistral",
            "prompt": prompt,
            "stream": False
        }
    )

    plan = response.json()["response"]
    return PlanResponse(plan_text=plan)
