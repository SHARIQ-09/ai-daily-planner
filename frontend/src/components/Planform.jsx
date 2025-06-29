import { useState } from "react";
import { generatePlan } from "../api";

function PlanForm() {
  const [userInput, setUserInput] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan("");

    try {
      const result = await generatePlan(userInput);
      setPlan(result);
    } catch (error) {
      setPlan("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderLine = (line, index) => {
    line = line.trim();
    if (!line) return null;

    // Time block line: "9:00 AM - Wake up..."
    if (/^\d{1,2}:\d{2}\s?(AM|PM)/i.test(line)) {
      return (
        <li
          key={index}
          className="text-blue-800 bg-blue-100 border-l-4 border-blue-500 font-semibold px-4 py-2 rounded shadow-sm"
        >
          {line}
        </li>
      );
    }

    // Subtask line: starts with -
    if (line.startsWith("-")) {
      const content = line.slice(1).trim().replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <li
          key={index}
          className="flex items-start gap-3 p-4 bg-white shadow-md rounded-lg border border-gray-200"
        >
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </li>
      );
    }

    // Plain paragraph (e.g., final message)
    const content = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return (
      <li
        key={index}
        className="text-gray-600 italic px-2"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">📅 AI Daily Planner</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows="4"
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="What do you want to do today?"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </form>

      {/* Render Plan */}
      {plan && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📝 Your Plan for Today</h2>
          <ul className="space-y-4">{plan.split("\n").map(renderLine)}</ul>
        </div>
      )}
    </div>
  );
}

export default PlanForm;
