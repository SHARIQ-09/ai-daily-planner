from pydantic import BaseModel

class PlanRequest(BaseModel):
    user_input: str

class PlanResponse(BaseModel):
    plan_text: str
