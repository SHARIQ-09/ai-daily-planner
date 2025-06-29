export async function generatePlan(user_input) {
  const response = await fetch("http://localhost:8000/generate-plan", {
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
  return data.plan_text;
}
