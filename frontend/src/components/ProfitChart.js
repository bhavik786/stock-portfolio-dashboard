import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function ProfitChart({ stocks, currency }) {
  const labels = stocks.map((s) => s.symbol);
  const dataPoints = stocks.map((s) =>
    currency === "CAD" ? s.profitCAD : s.profitUSD
  );

  const data = {
    labels,
    datasets: [
      {
        label: `Profit (${currency})`,
        data: dataPoints,
        fill: true,
        tension: 0.4,
        backgroundColor: "rgba(245,158,11,0.2)", // amber-500 transparent
        borderColor: "#F59E0B", // amber-500
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#eee" } },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <Line data={data} options={options} />
    </div>
  );
}
