// // backend/utils/fetchExchangeRate.js
// const axios = require("axios");

// async function fetchExchangeRate(from, to) {
//   if (from === to) return 1;

//   try {
//     // 1) call FreeCurrencyAPI with your key
//     const resp = await axios.get(
//       `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.FREE_CURRENCY_API_KEY}`,
//       {
//         params: {
//           base_currency: from,
//           currencies: to,
//         },
//       }
//     );

//     // 2) extract rate from resp.data.data
//     const rate = resp.data.data && resp.data.data[to];
//     if (rate == null) {
//       throw new Error(`No rate for ${from}→${to}`);
//     }

//     return rate;
//   } catch (err) {
//     console.error("🔥 fetchExchangeRate error:", err.message);
//     return 1; // fallback
//   }
// }

// module.exports = fetchExchangeRate;

//new
// backend/utils/fetchExchangeRate.js
const axios = require("axios");
const redis = require("../config/redisClient");
require("dotenv").config();

async function fetchExchangeRate(from = "USD", to = "CAD") {
  if (from === to) return 1;

  const cacheKey = `exchangeRate:${from}-${to}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log(`💾 Using cached exchange rate for ${from}→${to}: ${cached}`);
    return parseFloat(cached);
  }

  try {
    const resp = await axios.get(`https://api.freecurrencyapi.com/v1/latest`, {
      params: {
        apikey: process.env.FREE_CURRENCY_API_KEY,
        base_currency: from,
        currencies: to,
      },
    });

    const rate = resp.data.data && resp.data.data[to];
    if (rate == null) {
      throw new Error(`No rate for ${from}→${to}`);
    }

    // Cache rate for 30 minutes (1800 seconds)
    await redis.setEx(cacheKey, 1800, rate.toString());

    console.log(`🌐 Live fetched rate ${from}→${to}: ${rate}`);
    return rate;
  } catch (err) {
    console.error(`🔥 fetchExchangeRate error for ${from}→${to}:`, err.message);
    return 1; // Fallback
  }
}

module.exports = fetchExchangeRate;
