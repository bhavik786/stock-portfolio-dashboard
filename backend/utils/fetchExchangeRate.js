// backend/utils/fetchExchangeRate.js
const axios = require("axios");

async function fetchExchangeRate(from, to) {
  if (from === to) return 1;

  try {
    // 1) call FreeCurrencyAPI with your key
    const resp = await axios.get(
      `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.FREE_CURRENCY_API_KEY}`,
      {
        params: {
          base_currency: from,
          currencies: to,
        },
      }
    );

    // 2) extract rate from resp.data.data
    const rate = resp.data.data && resp.data.data[to];
    if (rate == null) {
      throw new Error(`No rate for ${from}→${to}`);
    }

    return rate;
  } catch (err) {
    console.error("🔥 fetchExchangeRate error:", err.message);
    return 1; // fallback
  }
}

module.exports = fetchExchangeRate;
