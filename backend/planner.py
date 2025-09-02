import os
import requests
from dotenv import load_dotenv

load_dotenv()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "llama-3.3-70b-versatile")


def generate_schedule(user_input):
    prompt = f"""
    You are a productivity assistant. The user said: "{user_input}".
    Create a realistic, time-blocked plan for a productive day from user given time.
    if the user does not give time , plan their day from 7a.m to 10 p.m.
    Use markdown formatting:
    - Use hyphens (-) to start each subtask 
    - Include clear time blocks and make the plan easy to follow
    - DO not use any extra emojis or symbols
    """
    
    url ="https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    print("Loaded API Key:", headers["Authorization"][:10])  # Should print 'Bearer ...'

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": "You are a helpful productivity assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"].strip()
    else:
        print("❌ Error:", response.status_code, response.text)
        return f"Error contacting Groq API: {response.status_code}"




