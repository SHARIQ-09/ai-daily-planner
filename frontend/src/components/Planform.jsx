import React, { useState } from "react";
import { generatePlan } from "../api";

function PlanForm() {
  const [userInput, setUserInput] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan("");
    setCheckedTasks({});

    try {
      const result = await generatePlan(userInput);
      setPlan(result);
    } catch (error) {
      console.error("❌ Error in frontend:", error);
      setPlan("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const parsePlan = (text) => {
    const lines = text.trim().split("\n");
    const blocks = [];
    let current = null;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      const blockHeader = line.match(/^\*\*(.+?)\*\*$/);
      if (blockHeader) {
        if (current) blocks.push(current);
        const header = blockHeader[1];
        const [timePart, ...titleParts] = header.split(":");
        current = {
          time: timePart.trim(),
          title: titleParts.join(":").trim(),
          tasks: [],
        };
      } else if (/^[\-*+]\s+/.test(line)) {
        current?.tasks.push(line.replace(/^[\-*+]\s+/, ""));
      } else {
        current?.tasks.push(line);
      }
    }

    if (current) blocks.push(current);
    return blocks;
  };

  const planBlocks = parsePlan(plan);

  const handleCheck = (blockIdx, taskIdx) => {
    const key = `${blockIdx}-${taskIdx}`;
    setCheckedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const exportToICS = () => {
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n`;
    const today = new Date();

    for (const block of planBlocks) {
      const match = block.time.match(/(\d{1,2}:\d{2})\s?(AM|PM)\s?-\s?(\d{1,2}:\d{2})\s?(AM|PM)/i);
      if (!match) continue;

      const [_, startTime, startAMPM, endTime, endAMPM] = match;
      const startDate = new Date(today);
      const endDate = new Date(today);

      const to24Hour = (time, ampm) => {
        let [hours, minutes] = time.split(":").map(Number);
        if (ampm.toUpperCase() === "PM" && hours !== 12) hours += 12;
        if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
        return [hours, minutes];
      };

      const [sh, sm] = to24Hour(startTime, startAMPM);
      const [eh, em] = to24Hour(endTime, endAMPM);
      startDate.setHours(sh, sm);
      endDate.setHours(eh, em);

      const formatICSDate = (date) => {
        return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      };

      icsContent += `BEGIN:VEVENT\nSUMMARY:${block.title}\nDESCRIPTION:${block.tasks.join("\\n")}\nDTSTART:${formatICSDate(startDate)}\nDTEND:${formatICSDate(endDate)}\nEND:VEVENT\n`;
    }

    icsContent += `END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plan.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
        📅 AI Daily Planner
      </h1>

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

      {plan && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              📝 Your Plan for Today
            </h2>
            <button
              onClick={exportToICS}
              className="text-sm text-blue-600 underline hover:text-blue-800"
            >
              Export to Calendar
            </button>
          </div>

          {planBlocks.map((block, i) => (
            <div
              key={i}
              className="bg-white border-l-4 border-blue-500 px-4 py-3 rounded shadow"
            >
              <div className="text-lg mb-1">
                <span className="text-blue-700 font-semibold">{block.time}</span>
                <span className="italic text-gray-700">: {block.title}</span>
              </div>
              <ul className="space-y-2 ml-2 mt-2">
                {block.tasks.map((task, j) => {
                  const key = `${i}-${j}`;
                  return (
                    <li
                      key={key}
                      className="flex items-start gap-3 p-2 bg-gray-50 rounded border border-gray-200"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                        checked={checkedTasks[key] || false}
                        onChange={() => handleCheck(i, j)}
                      />
                      <span
                        className={`text-gray-800 leading-snug ${
                          checkedTasks[key] ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {task}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlanForm;
