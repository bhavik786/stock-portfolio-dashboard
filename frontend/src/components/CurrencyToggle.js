import React from "react";

export default function CurrencyToggle({ currency, setCurrency }) {
  return (
    <div className="flex border border-gray-300 rounded-full overflow-hidden">
      {["USD", "CAD"].map((cur) => (
        <button
          key={cur}
          onClick={() => setCurrency(cur)}
          className={`px-4 py-2 transition ${
            currency === cur
              ? "bg-white text-gray-900 shadow"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {cur}
        </button>
      ))}
    </div>
  );
}
