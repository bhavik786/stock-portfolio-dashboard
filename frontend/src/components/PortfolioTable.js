import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import API from "../services/api";

export default function PortfolioTable({ stocks, currency, onUpdate }) {
  const handleDelete = async (id) => {
    if (confirm("Delete this stock?")) {
      await API.delete(`/stocks/${id}`);
      onUpdate();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="text-left text-sm font-semibold text-gray-600">
            {[
              "Symbol",
              "Shares",
              "Buy Price",
              "Current Price",
              "Value",
              "Profit",
              "",
            ].map((h) => (
              <th key={h} className="px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {stocks.map((s) => {
            const value = currency === "CAD" ? s?.valueCAD : s?.valueUSD;
            const profit = currency === "CAD" ? s?.profitCAD : s?.profitUSD;

            return (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{s.symbol || "-"}</td>
                <td className="px-4 py-3">
                  {s.shares != null ? s.shares : "-"}
                </td>

                <td className="px-4 py-3">
                  {s?.buyPrice != null ? s.buyPrice.toFixed(2) : "0.00"}
                </td>

                <td className="px-4 py-3">
                  {s?.livePrice != null ? s.livePrice.toFixed(2) : "0.00"}
                </td>

                <td className="px-4 py-3">
                  {value != null ? value.toFixed(2) : "0.00"}
                </td>

                <td
                  className={`px-4 py-3 font-medium ${
                    profit >= 0 ? "text-primary" : "text-red-500"
                  }`}
                >
                  {profit != null
                    ? (profit >= 0 ? "+" : "-") + Math.abs(profit).toFixed(2)
                    : "0.00"}
                </td>

                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => handleDelete(s._id)}>
                    <TrashIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                  </button>
                  <button onClick={() => alert("Edit UI pending")}>
                    <PencilIcon className="h-5 w-5 text-gray-400 hover:text-primary" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
