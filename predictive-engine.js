// predictive-engine.js

// This function was created using Generative AI
/**
 * Calculates slope and intercept for linear regression.
 * This was created using Generative AI
 */
function calculateLinearRegression(data) {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0 };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += data[i].x;
    sumY += data[i].y;
    sumXY += data[i].x * data[i].y;
    sumXX += data[i].x * data[i].x;
  }

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return { slope: 0, intercept: sumY / n };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

// This function was created using Generative AI
/**
 * Predicts savings for a target month index based on historical data.
 * This was created using Generative AI
 */
function predictSavings(mockData, targetMonthIndex) {
  // Map mock data to x,y pairs where x is the time index and y is the savings amount
  const formattedData = mockData.map((item, index) => ({
    x: index + 1, // e.g., month 1, 2, 3...
    y: item.savings
  }));

  const { slope, intercept } = calculateLinearRegression(formattedData);

  // Forecast y = mx + b
  const predictedValue = slope * targetMonthIndex + intercept;

  // Ensure we don't return negative predicted values
  return predictedValue > 0 ? predictedValue : 0;
}

module.exports = {
  predictSavings
};
