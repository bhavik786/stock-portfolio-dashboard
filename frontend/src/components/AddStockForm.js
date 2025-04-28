import React, { useState } from "react";
import API from "../services/api";

export default function AddStockForm({ onAdd }) {
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [currency, setCurrency] = useState("CAD");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/stocks/add", { symbol, shares, buyPrice, currency });
    setSymbol("");
    setShares("");
    setBuyPrice("");
    onAdd();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4">Add Stock</h2>
      <label className="block mb-3">
        <span className="text-gray-700">Symbol</span>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
          required
        />
      </label>
      <label className="block mb-3">
        <span className="text-gray-700">Shares</span>
        <input
          type="number"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent"
          required
        />
      </label>
      <label className="block mb-4">
        <span className="text-gray-700">Buy Price</span>
        <div className="flex">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border-gray-300 rounded-l-md shadow-sm focus:ring-accent focus:border-accent px-3 py-2"
          >
            <option value="CAD">CAD</option>
            <option value="USD">USD</option>
          </select>
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-accent focus:border-accent px-3 py-2"
            required
          />
        </div>
      </label>
      <button
        type="submit"
        className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2 rounded-lg transition"
      >
        + Add
      </button>
    </form>
  );
}
