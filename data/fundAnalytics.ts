import { mockFunds } from '@/app/(tabs)';

// Historical price data for each fund (daily closing prices for the last 30 days)
export const historicalPrices: Record<string, number[]> = {
  'wind-energy': [18.23, 18.15, 18.30, 18.10, 17.95, 18.05, 18.20, 18.35, 18.15, 18.25, 
    18.40, 18.30, 18.15, 18.05, 17.95, 18.10, 18.25, 18.35, 18.45, 18.30, 
    18.15, 18.25, 18.40, 18.50, 18.35, 18.20, 18.30, 18.45, 18.35, 18.23],
  'solar-power': [95.25, 95.40, 95.15, 94.90, 95.30, 95.45, 95.20, 94.95, 95.35, 95.50,
    95.25, 95.10, 94.85, 95.20, 95.40, 95.15, 94.90, 95.30, 95.45, 95.20,
    94.95, 95.35, 95.50, 95.25, 95.10, 94.85, 95.20, 95.40, 95.30, 95.25],
  'natural-resources': [271.50, 270.80, 272.30, 271.90, 272.50, 273.20, 272.80, 271.90, 272.40, 273.10,
    272.70, 271.80, 272.30, 273.00, 272.60, 271.70, 272.20, 272.90, 272.50, 271.60,
    272.10, 272.80, 272.40, 271.50, 272.00, 272.70, 272.30, 271.40, 271.90, 271.50],
  'water-tech': [182.75, 182.90, 182.60, 182.30, 182.80, 183.00, 182.70, 182.40, 182.90, 183.10,
    182.80, 182.50, 183.00, 183.20, 182.90, 182.60, 183.10, 183.30, 183.00, 182.70,
    183.20, 183.40, 183.10, 182.80, 183.30, 183.50, 183.20, 182.90, 183.40, 182.75],
  'clean-industry': [314.25, 314.50, 314.20, 313.90, 314.40, 314.70, 314.40, 314.10, 314.60, 314.90,
    314.60, 314.30, 314.80, 315.10, 314.80, 314.50, 315.00, 315.30, 315.00, 314.70,
    315.20, 315.50, 315.20, 314.90, 315.40, 315.70, 315.40, 315.10, 315.60, 314.25],
  'recycling': [138.50, 138.70, 138.40, 138.10, 138.60, 138.90, 138.60, 138.30, 138.80, 139.10,
    138.80, 138.50, 139.00, 139.30, 139.00, 138.70, 139.20, 139.50, 139.20, 138.90,
    139.40, 139.70, 139.40, 139.10, 139.60, 139.90, 139.60, 139.30, 139.80, 138.50]
};

// Risk metrics and analysis data
export const fundAnalytics = mockFunds.map(fund => ({
  id: fund.id,
  metrics: {
    // Risk Metrics
    volatility: {
      daily: Math.random() * 0.02 + 0.01, // 1-3% daily volatility
      annual: Math.random() * 0.15 + 0.10, // 10-25% annual volatility
    },
    sharpeRatio: Math.random() * 1 + 0.5, // 0.5-1.5 Sharpe ratio
    beta: Math.random() * 0.5 + 0.75, // 0.75-1.25 Beta
    alpha: Math.random() * 0.04 - 0.02, // -2% to +2% Alpha
    maxDrawdown: -(Math.random() * 0.15 + 0.10), // 10-25% max drawdown
    
    // Environmental Impact Metrics
    carbonMetrics: {
      annualOffset: Math.floor(Math.random() * 5000 + 1000), // 1000-6000 tons CO2
      offsetEfficiency: Math.random() * 0.3 + 0.7, // 70-100% efficiency
      carbonIntensity: Math.floor(Math.random() * 100 + 50), // 50-150 gCO2/kWh
    },
    
    // Financial Performance Indicators
    performance: {
      ytd: Math.random() * 0.3 - 0.1, // -10% to +20% YTD return
      oneYear: Math.random() * 0.4 - 0.1, // -10% to +30% 1Y return
      threeYear: Math.random() * 0.6, // 0-60% 3Y return
      fiveYear: Math.random() * 0.8, // 0-80% 5Y return
    },
    
    // Risk Analysis
    riskAnalysis: {
      varDaily: Math.random() * 0.02 + 0.01, // 1-3% daily VaR
      varWeekly: Math.random() * 0.04 + 0.02, // 2-6% weekly VaR
      expectedShortfall: Math.random() * 0.03 + 0.02, // 2-5% expected shortfall
      informationRatio: Math.random() * 0.5 + 0.5, // 0.5-1.0 information ratio
    },
    
    // ESG Scores (0-100)
    esgScores: {
      environmental: Math.floor(Math.random() * 20 + 80), // 80-100
      social: Math.floor(Math.random() * 30 + 70), // 70-100
      governance: Math.floor(Math.random() * 25 + 75), // 75-100
      total: 0, // Calculated below
    },
    
    // Market Analysis
    marketAnalysis: {
      marketShare: Math.random() * 0.1, // 0-10% market share
      peerRanking: Math.floor(Math.random() * 5 + 1), // 1-5 ranking
      momentum: Math.random() * 2 - 1, // -1 to +1 momentum score
      sentiment: Math.random() * 2 - 1, // -1 to +1 sentiment score
    },
    
    // Technical Indicators
    technicalIndicators: {
      rsi: Math.floor(Math.random() * 40 + 30), // 30-70 RSI
      macd: Math.random() * 2 - 1, // -1 to +1 MACD
      bollingerBands: {
        upper: fund.value * (1 + Math.random() * 0.05),
        lower: fund.value * (1 - Math.random() * 0.05),
        middle: fund.value
      }
    }
  }
})).map(fund => ({
  ...fund,
  metrics: {
    ...fund.metrics,
    esgScores: {
      ...fund.metrics.esgScores,
      total: Math.floor(
        (fund.metrics.esgScores.environmental +
         fund.metrics.esgScores.social +
         fund.metrics.esgScores.governance) / 3
      )
    }
  }
}));

// Function to calculate moving averages
export const calculateMA = (prices: number[], period: number) => {
  const mas = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    mas.push(sum / period);
  }
  return mas;
};

// Function to calculate volatility
export const calculateVolatility = (prices: number[]) => {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length);
};

// Function to calculate Sharpe Ratio
export const calculateSharpeRatio = (returns: number[], riskFreeRate: number = 0.02) => {
  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const volatility = Math.sqrt(
    returns.map(r => Math.pow(r - meanReturn, 2))
          .reduce((a, b) => a + b, 0) / returns.length
  );
  return (meanReturn - riskFreeRate) / volatility;
};

// Function to get fund insights
export const getFundInsights = (fundId: string) => {
  const fund = fundAnalytics.find(f => f.id === fundId);
  if (!fund) return null;

  const prices = historicalPrices[fundId];
  const ma20 = calculateMA(prices, 20);
  const ma50 = calculateMA(prices, 50);
  const volatility = calculateVolatility(prices);

  return {
    technicalAnalysis: {
      trend: ma20[ma20.length - 1] > ma50[ma50.length - 1] ? 'Upward' : 'Downward',
      volatility: volatility,
      momentum: fund.metrics.technicalIndicators.rsi > 50 ? 'Positive' : 'Negative',
    },
    riskAssessment: {
      riskLevel: fund.metrics.volatility.annual > 0.2 ? 'High' : 'Moderate',
      sharpeRatio: fund.metrics.sharpeRatio,
      maxDrawdown: fund.metrics.maxDrawdown,
    },
    environmentalImpact: {
      carbonOffset: fund.metrics.carbonMetrics.annualOffset,
      efficiency: fund.metrics.carbonMetrics.offsetEfficiency,
      intensity: fund.metrics.carbonMetrics.carbonIntensity,
    },
    esgAnalysis: {
      totalScore: fund.metrics.esgScores.total,
      environmental: fund.metrics.esgScores.environmental,
      social: fund.metrics.esgScores.social,
      governance: fund.metrics.esgScores.governance,
    },
    marketPosition: {
      marketShare: fund.metrics.marketAnalysis.marketShare,
      peerRanking: fund.metrics.marketAnalysis.peerRanking,
      sentiment: fund.metrics.marketAnalysis.sentiment,
    }
  };
};