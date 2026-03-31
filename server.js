const express = require('express');
const cors = require('cors');
const path = require('path');

//For loading up the node.js
let predictSavings;
try {
  const engine = require('./predictive-engine');
  predictSavings = engine.predictSavings;
  console.log('✅ Predictive engine loaded successfully');
} catch (err) {
  console.error('❌ Failed to load predictive-engine.js:', err.message);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Mock Historical Data
const historicalSavings = [
  { month: 'Jan', savings: 300 },
  { month: 'Feb', savings: 450 },
  { month: 'Mar', savings: 400 },
  { month: 'Apr', savings: 600 },
  { month: 'May', savings: 750 },
  { month: 'Jun', savings: 900 }
];

// Predictive Analytics Endpoint
// This was created using Generative AI
//sends a get request to the backend endpoint
app.get('/api/predict-savings', (req, res) => {
  try {
    console.log('📡 Received request for predictions');
    const nextMonthPrediction = predictSavings(historicalSavings, 7);
    const endOfYearPrediction = predictSavings(historicalSavings, 12);

    const currentTotal = historicalSavings.reduce((acc, curr) => acc + curr.savings, 0);

    res.json({
      historical: historicalSavings,
      currentTotal,
      predictions: {
        nextMonth: Math.round(nextMonthPrediction),
        endOfYear: Math.round(endOfYearPrediction),
        projectedYearEndTotal: Math.round(currentTotal + (nextMonthPrediction * 6))
      }
    });
  } catch (err) {
    console.error('❌ Prediction Error:', err);
    res.status(500).json({ error: 'Failed to calculate predictions' });
  }
});

// Serve frontend - Catch-all for SPA-like behavior
// Using middleware instead of a path string to avoid path-to-regexp issues in modern Node/Express
app.use((req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`❌ Error sending index.html: ${err.message}`);
      // Only send error if headers haven't been sent yet
      if (!res.headersSent) {
        res.status(err.status || 500).end();
      }
    }
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 KaagaPay Server running on http://localhost:${PORT}`);
  console.log(`📂 Serving files from: ${__dirname}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please close the other process or try a different port (e.g., PORT=3001 node server.js).`);
  } else {
    console.error('❌ Server Error:', err.message);
  }
  process.exit(1);
});
