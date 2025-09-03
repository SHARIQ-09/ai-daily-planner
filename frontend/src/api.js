export async function generatePlan(user_input) {
  const response = await fetch("https://ai-daily-planner.onrender.com/generateh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user_input })
  });

  if (!response.ok) {
    throw new Error("Failed to generate plan");
  }

  const data = await response.json();
  //console.log("Backend response:", data);
  return data.plan;
}


//http://127.0.0.1:8000/generate
//https://ai-daily-planner.onrender.com/generate