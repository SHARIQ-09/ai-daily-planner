import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = f"https://api-inference.huggingface.co/models/HuggingFaceH4/{os.getenv('MODEL_ID')}"
HEADERS = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}"}

def generate_schedule(user_input):
    prompt = f"""
    You are a productivity assistant. The user said: "{user_input}".
    Create a realistic, time-blocked plan for a productive day from 9 AM to 9 PM.
    Include work blocks, short breaks, and make it easy to follow.
    """
    payload = {"inputs": prompt}
    print("Using model URL:", API_URL)
    print("Using token prefix:", HEADERS["Authorization"][:10])  # just to check it's loading

    response = requests.post(API_URL, headers=HEADERS, json=payload)

    if response.status_code == 200:
        result = response.json()
        # Some models return a list, some return a dict
        if isinstance(result, list) and "generated_text" in result[0]:
            return result[0]["generated_text"]
        elif isinstance(result, dict) and "generated_text" in result:
            return result["generated_text"]
        else:
            return str(result)
    else:
        return f"Error contacting Hugging Face API: {response.status_code} - {response.text}"
