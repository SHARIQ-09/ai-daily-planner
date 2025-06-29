from fastapi import FastAPI
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

@app.post("/generate-plan", response_model=PlanResponse)
def plan_day(request: PlanRequest):
    return generate_schedule(request)
