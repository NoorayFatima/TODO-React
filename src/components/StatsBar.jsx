/*export default function StatsBar({ tasks }) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    const remaining = total - completed;
    const progress = total > 0 ? (completed / total) * 100 : 0;
  
    return (
      <div className="mt-6 rounded-md border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total: {total}</span>
          <span>Active: {remaining}</span>
          <span>Completed: {completed}</span>
        </div>
  
        <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-500 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-1 text-center text-xs text-gray-500">
          {completed} of {total} tasks completed ({Math.round(progress)}%)
        </p>
      </div>
    );
  }*/
 // components/StatsBar.jsx
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatsBar({ tasks }) {
  const completed = tasks.filter((t) => t.done).length;
  const active = tasks.filter((t) => !t.done).length;

  const data = {
    labels: ["Active", "Completed"],
    datasets: [
      {
        data: [active, completed],
        backgroundColor: ["#060A6D", "#066D06"], // Tailwind blue + green
        hoverBackgroundColor: ["#2563eb", "#059669"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          font: { size: 14, weight: "500" },
        },
      },
    },
  };

  return (
    <div className="bg-white/60 rounded-lg shadow p-4 mt-8">
      <h1 className="text-xl font-bold mb-3 text-#060A6D text-center">📊 Task Stats</h1>
      <div className="flex justify-center">
        <Pie data={data} options={options} />
      </div>
      <div className="flex justify-around mt-4 text-sm">
        <span className="text-#060A6D font-medium">Active: {active}</span>
        <span className="text-#066D06 font-medium">Completed: {completed}</span>
      </div>
    </div>
  );
}

  