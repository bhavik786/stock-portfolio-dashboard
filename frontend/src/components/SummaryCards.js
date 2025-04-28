import React from "react";

export default function SummaryCards({ totals, currency }) {
  const cards = [
    {
      label: "Today’s Profit/Loss",
      value: currency === "CAD" ? totals.inCAD : totals.inUSD,
    },
    {
      label: "All-Time Profit/Loss",
      value: currency === "CAD" ? totals.inCAD : totals.inUSD,
    },
    { label: "Native P/L", value: totals.native },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {cards.map(({ label, value }) => (
        <div key={label} className="bg-white p-4 rounded-2xl shadow-md">
          <p className="text-sm text-gray-500">
            {label} ({currency})
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {value >= 0 ? "+" : "-"}
            {Math.abs(value).toFixed(2)} {currency}
          </p>
        </div>
      ))}
    </div>
  );
}
