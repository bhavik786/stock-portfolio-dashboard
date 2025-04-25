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
