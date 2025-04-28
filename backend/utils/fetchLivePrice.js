// utils/fetchLivePrice.js
const axios = require("axios");
const yf = require("yahoo-finance2").default;
const redis = require("../config/redisClient");
require("dotenv").config();

async function fetchLivePrice(symbol, currency = "CAD") {
  const finnhubKey = process.env.FINNHUB_API_KEY;
  const twelveKey = process.env.TWELVE_DATA_API_KEY;
  const upper = symbol.toUpperCase();
  const cacheKey = `price:${upper}-${currency}`;
  const variants = [upper, `${upper}.TO`];

  // 0️⃣ Redis cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`💾 Cache hit for ${cacheKey}: ${cached}`);
    return parseFloat(cached);
  }

  let priceFound = null;

  // 1️⃣ Try Finnhub
  for (const s of variants) {
    try {
      const res = await axios.get("https://finnhub.io/api/v1/quote", {
        params: { symbol: s, token: finnhubKey },
      });
      const price = res.data?.c;
      if (price && price > 0) {
        priceFound = price;
        console.log(`✔️ Finnhub ${s}: ${price}`);
        break;
      }
    } catch (err) {
      console.warn(`❌ Finnhub ${s}:`, err.response?.data || err.message);
    }
  }

  // 2️⃣ If not found yet, Try Yahoo
  if (!priceFound) {
    for (const s of variants) {
      try {
        const result = await yf.quote(s);
        const price =
          result?.regularMarketPrice || result?.price?.regularMarketPrice;
        if (price && price > 0) {
          priceFound = price;
          console.log(`✔️ Yahoo ${s}: ${price}`);
          break;
        }
      } catch (err) {
        console.warn(`❌ Yahoo ${s}:`, err.message);
      }
    }
  }

  // 3️⃣ If still not found, Try TwelveData
  if (!priceFound) {
    for (const s of variants) {
      try {
        const { data } = await axios.get("https://api.twelvedata.com/price", {
          params: { symbol: s, apikey: twelveKey },
        });
        if (data?.price) {
          priceFound = parseFloat(data.price);
          console.log(`✔️ TwelveData ${s}: ${priceFound}`);
          break;
        }
      } catch (err) {
        console.warn(`❌ TwelveData ${s}:`, err.response?.data || err.message);
      }
    }
  }

  // 4️⃣ Save to Redis if found
  if (priceFound) {
    await redis.setEx(cacheKey, 300, priceFound.toString());
    return priceFound;
  }

  // ❌ All providers failed
  throw new Error(`Unable to fetch live price for "${symbol}"`);
}

module.exports = fetchLivePrice;
