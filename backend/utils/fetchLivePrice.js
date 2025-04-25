// utils/fetchLivePrice.js
const axios = require("axios");

// Example: using a free endpoint or your own API key
async function fetchLivePrice(symbol) {
  try {
    const { data } = await axios.get(`https://finnhub.io/api/v1/quote`, {
      params: { symbol, token: process.env.FINNHUB_API_KEY },
    });
    // data.c is the current price in Finnhub
    return data.c;
  } catch (err) {
    console.error(`Error fetching price for ${symbol}:`, err.message);
    throw new Error("Price fetch failed");
  }
}

module.exports = fetchLivePrice;
