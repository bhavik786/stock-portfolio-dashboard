import React, { useEffect, useState } from "react";
import AddStockForm from "../components/AddStockForm";
import CurrencyToggle from "../components/CurrencyToggle";
import SummaryCards from "../components/SummaryCards";
import PortfolioTable from "../components/PortfolioTable";
import ProfitChart from "../components/ProfitChart";
import API from "../services/api";

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [currency, setCurrency] = useState("CAD");

  const fetchData = async () => {
    try {
      const res = await API.get("/stocks/portfolio");
      setPortfolio(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Stock Portfolio Dashboard
        </h1>
        <CurrencyToggle currency={currency} setCurrency={setCurrency} />
      </div>

      {/* Layout */}
      <div className="grid grid-cols-4 gap-6">
        {/* Add Stock */}
        <div>
          <AddStockForm onAdd={fetchData} />
        </div>

        {/* Main Content */}
        <div className="col-span-3 space-y-6">
          {portfolio && (
            <>
              <SummaryCards totals={portfolio.totals} currency={currency} />
              <PortfolioTable
                stocks={portfolio.stocks}
                currency={currency}
                onUpdate={fetchData}
              />
              <ProfitChart stocks={portfolio.stocks} currency={currency} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
