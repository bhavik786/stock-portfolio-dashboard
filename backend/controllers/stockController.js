// controllers/stockController.js
const Stock = require("../models/Stock");
const fetchLivePrice = require("../utils/fetchLivePrice");
const fetchExchangeRate = require("../utils/fetchExchangeRate");
exports.addStock = async (req, res, next) => {
  try {
    const { symbol, shares, buyPrice, currency } = req.body;
    if (!symbol || !shares || !buyPrice || !currency) {
      return res
        .status(400)
        .json({ message: "Provide symbol, shares, buyPrice, and currency" });
    }
    const stock = await Stock.create({
      user: req.userId,
      symbol,
      shares,
      buyPrice,
      currency,
    });
    res.status(201).json(stock);
  } catch (err) {
    next(err);
  }
};

//old
exports.getPortfolio = async (req, res, next) => {
  try {
    // 1) grab stocks
    const stocks = await Stock.find({ user: req.userId }).lean();

    // 2) get FX rates once
    const usdToCad = await fetchExchangeRate("USD", "CAD");
    const cadToUsd = 1 / usdToCad;

    // initialize totals
    const totals = { native: 0, inCAD: 0, inUSD: 0 };
    const detailed = [];

    // 3) loop
    for (const s of stocks) {
      const {
        symbol,
        shares,
        buyPrice,
        currency = "CAD", // ← default if missing
      } = s;

      // live price & native P/L
      const livePrice = await fetchLivePrice(symbol);
      const costNative = buyPrice * shares;
      const valueNative = livePrice * shares;
      const profitNative = valueNative - costNative;

      // 4) convert
      const valueCAD =
        currency === "USD" ? valueNative * usdToCad : valueNative;
      const valueUSD =
        currency === "CAD" ? valueNative * cadToUsd : valueNative;

      const costCAD = currency === "USD" ? costNative * usdToCad : costNative;
      const costUSD = currency === "CAD" ? costNative * cadToUsd : costNative;

      const profitCAD = valueCAD - costCAD;
      const profitUSD = valueUSD - costUSD;

      // 5) accumulate
      totals.native += profitNative;
      totals.inCAD += profitCAD;
      totals.inUSD += profitUSD;

      // 6) push detailed record
      detailed.push({
        ...s,
        livePrice,
        profitNative,
        valueNative,
        valueCAD,
        valueUSD,
        profitCAD,
        profitUSD,
      });
    }

    // 7) respond
    return res.json({
      rates: { usdToCad, cadToUsd },
      totals,
      stocks: detailed,
    });
  } catch (err) {
    next(err);
  }
};

//new
// exports.getPortfolio = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const stocks = await Stock.find({ user: userId });

//     if (!stocks.length) {
//       return res.status(200).json({ rates: {}, totals: {}, stocks: [] });
//     }

//     // Fetch USD↔CAD exchange rates once
//     const rates = await fetchExchangeRate();

//     // 🚀 Fetch all live prices in parallel
//     const updatedStocks = await Promise.all(
//       stocks.map(async (stock) => {
//         const livePrice = await fetchLivePrice(stock.symbol, stock.currency);

//         stock = stock.toObject(); // allow mutation
//         stock.livePrice = livePrice;

//         const valueNative = livePrice * stock.shares;
//         const valueCAD =
//           stock.currency === "CAD" ? valueNative : valueNative * rates.usdToCad;
//         const valueUSD =
//           stock.currency === "USD" ? valueNative : valueNative * rates.cadToUsd;

//         stock.valueNative = valueNative;
//         stock.valueCAD = valueCAD;
//         stock.valueUSD = valueUSD;

//         stock.profitNative = (livePrice - stock.buyPrice) * stock.shares;
//         stock.profitCAD =
//           stock.currency === "CAD"
//             ? stock.profitNative
//             : stock.profitNative * rates.usdToCad;
//         stock.profitUSD =
//           stock.currency === "USD"
//             ? stock.profitNative
//             : stock.profitNative * rates.cadToUsd;

//         return stock;
//       })
//     );

//     // Calculate portfolio totals
//     const totals = updatedStocks.reduce(
//       (acc, stock) => {
//         acc.native += stock.profitNative;
//         acc.inCAD += stock.profitCAD;
//         acc.inUSD += stock.profitUSD;
//         return acc;
//       },
//       { native: 0, inCAD: 0, inUSD: 0 }
//     );

//     res.status(200).json({
//       rates,
//       totals,
//       stocks: updatedStocks,
//     });
//   } catch (err) {
//     console.error("🔥 getPortfolio error:", err.message);
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };
exports.updateStock = async (req, res, next) => {
  try {
    const { id } = req.params; // Stock ID from URL
    const updates = req.body; // { symbol?, shares?, buyPrice? }

    // Find the stock belonging to this user
    const stock = await Stock.findOne({ _id: id, user: req.userId });
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    // Apply only fields that were sent
    if (updates.symbol) stock.symbol = updates.symbol.toUpperCase().trim();
    if (updates.shares) stock.shares = updates.shares;
    if (updates.buyPrice) stock.buyPrice = updates.buyPrice;

    await stock.save(); // Persist changes
    res.json(stock);
  } catch (err) {
    next(err);
  }
};

// controllers/stockController.js
exports.deleteStock = async (req, res, next) => {
  try {
    const { id } = req.params;

    const stock = await Stock.findOne({ _id: id, user: req.userId });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    await Stock.deleteOne({ _id: id, user: req.userId });

    res.json({ message: "Stock deleted successfully", id });
  } catch (err) {
    next(err);
  }
};
