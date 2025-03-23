import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, TrendingUp, TrendingDown, Leaf, TriangleAlert as AlertTriangle, ChartBar as BarChart2, Scale } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { mockFunds } from '@/app/(tabs)';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ONNXPredictor } from '@/utils/onnxPredictor';
import { fundAnalytics, historicalPrices } from '@/data/fundAnalytics';

export default function CompareScreen() {
  const { funds } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();

  const selectedFunds = mockFunds.filter(fund => 
    funds.split(',').includes(fund.id)
  );

  // Get analytics data for selected funds
  const selectedFundAnalytics = selectedFunds.map(fund => {
    const analytics = fundAnalytics.find(f => f.id === fund.id);
    const prices = historicalPrices[fund.id];
    
    // Generate ONNX predictions
    const prediction = ONNXPredictor.predictFundPerformance({
      historicalPrices: prices,
      volatility: analytics?.metrics.volatility.daily || 0.02,
      volume: 1000000, // Mock volume
      marketSentiment: analytics?.metrics.marketAnalysis.sentiment || 0,
      environmentalScore: analytics?.metrics.esgScores.environmental || 80,
    });

    // Analyze environmental impact
    const environmentalImpact = ONNXPredictor.analyzeEnvironmentalImpact(
      analytics?.metrics || {}
    );

    return {
      fund,
      analytics,
      prediction,
      environmentalImpact,
    };
  });

  // Generate portfolio recommendations
  const portfolioRecommendations = ONNXPredictor.generatePortfolioRecommendations(
    selectedFundAnalytics.map(item => ({
      id: item.fund.id,
      metrics: item.analytics?.metrics
    }))
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <SafeAreaView style={[styles.container, !isDark && styles.lightContainer]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft size={24} color={isDark ? '#fff' : '#1a1a1a'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, !isDark && styles.lightText]}>Compare Funds</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.comparisonGrid}>
          {/* Headers */}
          <View style={styles.gridRow}>
            <View style={styles.gridCell} />
            {selectedFunds.map((fund) => (
              <View key={fund.id} style={[styles.gridHeaderCell, { backgroundColor: fund.color }]}>
                <fund.icon size={24} color="#fff" />
                <Text style={styles.gridHeaderText}>{fund.symbol}</Text>
              </View>
            ))}
          </View>

          {/* Basic Info Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, !isDark && styles.lightText]}>Basic Info</Text>

            {/* Name */}
            <Animated.View 
              entering={FadeInDown.delay(100).springify()}
              style={styles.gridRow}>
              <View style={[styles.gridLabelCell, !isDark && styles.lightGridLabelCell]}>
                <Text style={[styles.gridLabel, !isDark && styles.lightGridLabel]}>Name</Text>
              </View>
              {selectedFunds.map((fund) => (
                <View key={fund.id} style={[styles.gridDataCell, !isDark && styles.lightGridDataCell]}>
                  <Text style={[styles.gridData, !isDark && styles.lightGridData]}>{fund.name}</Text>
                </View>
              ))}
            </Animated.View>

            {/* Current Price */}
            <Animated.View 
              entering={FadeInDown.delay(150).springify()}
              style={styles.gridRow}>
              <View style={[styles.gridLabelCell, !isDark && styles.lightGridLabelCell]}>
                <Text style={[styles.gridLabel, !isDark && styles.lightGridLabel]}>Price</Text>
              </View>
              {selectedFunds.map((fund) => (
                <View key={fund.id} style={[styles.gridDataCell, !isDark && styles.lightGridDataCell]}>
                  <Text style={[styles.gridData, !isDark && styles.lightGridData]}>
                    {formatCurrency(fund.value)}
                  </Text>
                </View>
              ))}
            </Animated.View>

            {/* Change */}
            <Animated.View 
              entering={FadeInDown.delay(200).springify()}
              style={styles.gridRow}>
              <View style={[styles.gridLabelCell, !isDark && styles.lightGridLabelCell]}>
                <Text style={[styles.gridLabel, !isDark && styles.lightGridLabel]}>Change</Text>
              </View>
              {selectedFunds.map((fund) => (
                <View key={fund.id} style={[styles.gridDataCell, !isDark && styles.lightGridDataCell]}>
                  <View style={styles.changeContainer}>
                    {fund.change > 0 ? (
                      <TrendingUp size={16} color="#00e6b8" />
                    ) : (
                      <TrendingDown size={16} color="#ff4444" />
                    )}
                    <Text style={[
                      styles.changeText,
                      { color: fund.change > 0 ? '#00e6b8' : '#ff4444' }
                    ]}>
                      {formatPercentage(fund.change)}
                    </Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          </View>

          {/* AI Analysis Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, !isDark && styles.lightText]}>AI Analysis</Text>

            {/* Predicted Price */}
            <Animated.View 
              entering={FadeInDown.delay(250).springify()}
              style={styles.gridRow}>
              <View style={[styles.gridLabelCell, !isDark && styles.lightGridLabelCell]}>
                <View style={styles.labelWithIcon}>
                  <BarChart2 size={16} color={isDark ? '#999' : '#666'} />
                  <Text style={[styles.gridLabel, !isDark && styles.lightGridLabel]}>
                    Predicted Price
                  </Text>
                </View>
              </View>
              {selectedFundAnalytics.map(({ prediction, fund }) => (
                <View key={fund.id} style={[styles.gridDataCell, !isDark && styles.lightGridDataCell]}>
                  <Text style={[styles.gridData, !isDark && styles.lightGridData]}>
                    {formatCurrency(prediction.predictedPrice)}
                  </Text>
                  <Text style={[styles.confidenceText, !isDark && styles.lightConfidenceText]}>
                    {Math.round(prediction.confidence * 100)}% confidence
                  </Text>
                </View>
              ))}
            </Animated.View>

            {/* Risk Score */}
            <Animated.View 
              entering={FadeInDown.delay(300).springify()}
              style={styles.gridRow}>
              <View style={[styles.gridLabelCell, !isDark && styles.lightGridLabelCell]}>
                <View style={styles.labelWithIcon}>
                  <AlertTriangle size={16} color={isDark ? '#999' : '#666'} />
                  <Text style={[styles.gridLabel, !isDark && styles.lightGridLabel]}>Risk Score</Text>
                </View>
              </View>
              {selectedFundAnalytics.map(({ prediction, fund }) => (
                <View key={fund.id} style={[styles.gridDataCell, !isDark && styles.lightGridDataCell]}>
                  <Text style={[
                    styles.riskScore,
                    { color: prediction.riskScore > 70 ? '#ff4444' : prediction.riskScore > 40 ? '#ff9800' : '#00e6b8' }
                  ]}>
                    {Math.round(prediction.riskScore)}/100
                  </Text>
                </View>
              ))}
            </Animated.View>

            {/* Environmental Impact */}
            <Animated.View 
              entering={FadeInDown.delay(350).springify()}
              style={styles.gridRow}>
              <View style={[styles.gridLabelCell, !isDark && styles.lightGridLabelCell]}>
                <View style={styles.labelWithIcon}>
                  <Leaf size={16} color={isDark ? '#999' : '#666'} />
                  <Text style={[styles.gridLabel, !isDark && styles.lightGridLabel]}>
                    Environmental Impact
                  </Text>
                </View>
              </View>
              {selectedFundAnalytics.map(({ environmentalImpact, fund }) => (
                <View key={fund.id} style={[styles.gridDataCell, !isDark && styles.lightGridDataCell]}>
                  <Text style={[styles.gridData, !isDark && styles.lightGridData]}>
                    {environmentalImpact.sustainabilityRating}
                  </Text>
                  <Text style={[styles.impactScore, { color: '#00e6b8' }]}>
                    {Math.round(environmentalImpact.impactScore)}/100
                  </Text>
                </View>
              ))}
            </Animated.View>

            {/* Recommended Action */}
            <Animated.View 
              entering={FadeInDown.delay(400).springify()}
              style={styles.gridRow}>
              <View style={[styles.gridLabelCell, !isDark && styles.lightGridLabelCell]}>
                <View style={styles.labelWithIcon}>
                  <Scale size={16} color={isDark ? '#999' : '#666'} />
                  <Text style={[styles.gridLabel, !isDark && styles.lightGridLabel]}>
                    Recommendation
                  </Text>
                </View>
              </View>
              {selectedFundAnalytics.map(({ prediction, fund }) => (
                <View key={fund.id} style={[styles.gridDataCell, !isDark && styles.lightGridDataCell]}>
                  <Text style={[
                    styles.recommendationText,
                    { 
                      color: prediction.recommendedAction === 'Buy' ? '#00e6b8' 
                        : prediction.recommendedAction === 'Sell' ? '#ff4444' 
                        : '#ff9800'
                    }
                  ]}>
                    {prediction.recommendedAction}
                  </Text>
                </View>
              ))}
            </Animated.View>
          </View>

          {/* Portfolio Optimization */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, !isDark && styles.lightText]}>Portfolio Optimization</Text>
            <View style={[styles.optimizationCard, !isDark && styles.lightOptimizationCard]}>
              <Text style={[styles.optimizationTitle, !isDark && styles.lightText]}>
                Recommended Allocation
              </Text>
              {portfolioRecommendations.optimalAllocation.map((allocation) => {
                const fund = selectedFunds.find(f => f.id === allocation.fundId);
                return (
                  <View key={allocation.fundId} style={styles.allocationRow}>
                    <Text style={[styles.allocationFund, !isDark && styles.lightText]}>
                      {fund?.symbol}
                    </Text>
                    <Text style={[styles.allocationValue, !isDark && styles.lightText]}>
                      {Math.round(allocation.allocation * 100)}%
                    </Text>
                  </View>
                );
              })}
              <View style={styles.optimizationMetrics}>
                <View style={styles.metric}>
                  <Text style={[styles.metricLabel, !isDark && styles.lightSecondaryText]}>
                    Portfolio Risk
                  </Text>
                  <Text style={[styles.metricValue, !isDark && styles.lightText]}>
                    {Math.round(portfolioRecommendations.riskAssessment.portfolioRisk * 100)}%
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={[styles.metricLabel, !isDark && styles.lightSecondaryText]}>
                    ESG Score
                  </Text>
                  <Text style={[styles.metricValue, !isDark && styles.lightText]}>
                    {Math.round(portfolioRecommendations.riskAssessment.esgScore)}/100
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  lightText: {
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  comparisonGrid: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCell: {
    flex: 1,
  },
  gridHeaderCell: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  gridHeaderText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  gridLabelCell: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  lightGridLabelCell: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gridLabel: {
    color: '#999',
    fontSize: 14,
  },
  lightGridLabel: {
    color: '#666',
  },
  gridDataCell: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  lightGridDataCell: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  gridData: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  lightGridData: {
    color: '#1a1a1a',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  confidenceText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  lightConfidenceText: {
    color: '#999',
  },
  riskScore: {
    fontSize: 14,
    fontWeight: '600',
  },
  impactScore: {
    fontSize: 12,
    marginTop: 4,
  },
  recommendationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  optimizationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  lightOptimizationCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  optimizationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  allocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  allocationFund: {
    color: 'white',
    fontSize: 14,
  },
  allocationValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  optimizationMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  lightSecondaryText: {
    color: '#666',
  },
  metricValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});