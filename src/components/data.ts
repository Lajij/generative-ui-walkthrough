// All data in this walkthrough is simulated. Banksia Invest and Wattle Minerals are fictional.

export const COMPANY = "Banksia Invest";
export const QUESTION = "How has my biggest holding done against the ASX 200 this year?";
export const AS_OF = "23 Oct 2026 market close";

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
// Year-to-date % change, start of year = 0
export const HOLDING_SERIES = [0, 3.1, -1.3, 4.9, 9.2, 6.5, 11.8, 15.0, 13.6, 18.4];
export const INDEX_SERIES = [0, 1.2, -0.6, 1.9, 3.0, 2.1, 4.4, 5.8, 6.3, 7.2];

export const HOLDING = {
  name: "Wattle Minerals",
  ticker: "WTM",
  shares: 2400,
  startPrice: 4.85,
  nowPrice: 5.74,
  startValue: 11640, // 2,400 x $4.85
  nowValue: 13776, // 2,400 x $5.74
  gain: 2136,
  ytd: 18.4,
};

export const INDEX = {
  name: "ASX 200",
  start: 8400.0,
  now: 9004.8, // 8,400 x 1.072
  ytd: 7.2,
};

export const GAP = 11.2; // 18.4 - 7.2 percentage points

export const BEFORE_ANSWER = [
  "Great question! Your largest holding appears to have performed reasonably well over the course of this year, and it has likely done somewhat better than the broader Australian market, although performance can vary depending on the time period you look at.",
  "Mining stocks have generally experienced a mix of ups and downs this year due to a range of factors such as commodity prices, global demand and broader economic conditions. Your holding may have seen some volatility during this period, including a dip earlier in the year, before recovering.",
  "Overall, it seems your position has delivered a positive return that is probably ahead of the index by a moderate margin. For exact figures, you may wish to check your portfolio statement or contact our team.",
];

// Business value (simulated, per month unless stated)
export const VALUE = {
  questionsPerMonth: 120000,
  callRateBefore: 14, // %
  callRateAfter: 5, // %
  callsBefore: 16800,
  callsAfter: 6000,
  callsAvoided: 10800,
  costPerCall: 11.5,
  savedPerMonth: 124200,
  savedPerYear: 1490400,
  trustBefore: 41, // % of answers rated helpful
  trustAfter: 87,
  shipBefore: "6 weeks",
  shipAfter: "1 line, same day",
};

export const fmtAUD = (n: number, dp = 0) =>
  "$" + n.toLocaleString("en-AU", { minimumFractionDigits: dp, maximumFractionDigits: dp });
export const fmtNum = (n: number) => n.toLocaleString("en-AU");
