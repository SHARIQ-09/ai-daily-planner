from fastapi import FastAPI , Request
from fastapi.middleware.cors import CORSMiddleware
from planner import generate_schedule
from models import PlanRequest, PlanResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate")
async def generate(request: Request):
    try:
        data = await request.json()
        print("Received input:", data)
        input_text = data.get("input", "")
        plan = generate_schedule(input_text)
        return {"plan": plan}
    except Exception as e:
        print ("❌ Error:", e)
        return {"error": str(e)}

