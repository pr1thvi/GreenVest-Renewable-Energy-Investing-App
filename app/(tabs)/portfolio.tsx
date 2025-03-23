import { View, Text, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInvestments } from '@/context/InvestmentsContext';
import { useTheme } from '@/context/ThemeContext';
import { TrendingUp, TrendingDown, Leaf, Brain, ChartBar as BarChart2, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ONNXPredictor } from '@/utils/onnxPredictor';
import { fundAnalytics, historicalPrices } from '@/data/fundAnalytics';

export default function PortfolioScreen() {
  const { investments } = useInvestments();
  const { isDark } = useTheme();

  // Calculate total portfolio value and carbon offset
  const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCarbonOffset = investments.reduce((sum, inv) => {
    const analytics = fundAnalytics.find(f => f.id === inv.projectId);
    return sum + (analytics?.metrics.carbonMetrics.annualOffset || 0);
  }, 0);

  // Generate AI insights for the entire portfolio
  const portfolioAnalytics = investments.map(inv => {
    const analytics = fundAnalytics.find(f => f.id === inv.projectId);
    const prices = historicalPrices[inv.projectId as string];
    
    return {
      investment: inv,
      prediction: ONNXPredictor.predictFundPerformance({
        historicalPrices: prices || [],
        volatility: analytics?.metrics.volatility.daily || 0.02,
        volume: 1000000,
        marketSentiment: analytics?.metrics.marketAnalysis.sentiment || 0,
        environmentalScore: analytics?.metrics.esgScores.environmental || 80,
      }),
      environmentalImpact: ONNXPredictor.analyzeEnvironmentalImpact(
        analytics?.metrics || {}
      )
    };
  });

  const portfolioRecommendations = ONNXPredictor.generatePortfolioRecommendations(
    investments.map(inv => ({
      id: inv.projectId,
      metrics: fundAnalytics.find(f => f.id === inv.projectId)?.metrics
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

  return (
    <SafeAreaView style={[styles.container, !isDark && styles.lightContainer]}>
      <ScrollView>
        <LinearGradient
          colors={isDark ? ['#00e6b8', '#1a1a1a'] : ['#00e6b8', '#ffffff']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}>
          <Text style={[styles.title, !isDark && styles.lightText]}>Portfolio Overview</Text>
          
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            style={[styles.overviewCard, !isDark && styles.lightOverviewCard]}>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewLabel, !isDark && styles.lightSecondaryText]}>
                Total Value
              </Text>
              <Text style={[styles.overviewValue, !isDark && styles.lightText]}>
                {formatCurrency(totalValue)}
              </Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewLabel, !isDark && styles.lightSecondaryText]}>
                Carbon Offset
              </Text>
              <Text style={[styles.overviewValue, !isDark && styles.lightText]}>
                {totalCarbonOffset.toFixed(1)}kg CO₂
              </Text>
            </View>
          </Animated.View>
        </LinearGradient>

        <View style={styles.content}>
          {/* AI Analysis Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Brain size={20} color={isDark ? '#fff' : '#1a1a1a'} />
              <Text style={[styles.sectionTitle, !isDark && styles.lightText]}>
                AI Portfolio Analysis
              </Text>
            </View>
            
            <Animated.View 
              entering={FadeInDown.delay(300).springify()}
              style={[styles.aiCard, !isDark && styles.lightAiCard]}>
              <View style={styles.aiMetrics}>
                <View style={styles.aiMetric}>
                  <BarChart2 size={20} color="#00e6b8" />
                  <Text style={[styles.aiMetricLabel, !isDark && styles.lightSecondaryText]}>
                    Portfolio Health
                  </Text>
                  <Text style={[styles.aiMetricValue, !isDark && styles.lightText]}>
                    {Math.round(portfolioRecommendations.riskAssessment.diversificationScore)}/100
                  </Text>
                </View>
                <View style={styles.aiMetric}>
                  <AlertTriangle size={20} color="#00e6b8" />
                  <Text style={[styles.aiMetricLabel, !isDark && styles.lightSecondaryText]}>
                    Risk Level
                  </Text>
                  <Text style={[styles.aiMetricValue, !isDark && styles.lightText]}>
                    {Math.round(portfolioRecommendations.riskAssessment.portfolioRisk * 100)}%
                  </Text>
                </View>
                <View style={styles.aiMetric}>
                  <Leaf size={20} color="#00e6b8" />
                  <Text style={[styles.aiMetricLabel, !isDark && styles.lightSecondaryText]}>
                    ESG Score
                  </Text>
                  <Text style={[styles.aiMetricValue, !isDark && styles.lightText]}>
                    {Math.round(portfolioRecommendations.riskAssessment.esgScore)}/100
                  </Text>
                </View>
              </View>

              {portfolioRecommendations.rebalancingNeeded && (
                <View style={styles.rebalanceAlert}>
                  <Text style={styles.rebalanceText}>
                    Portfolio rebalancing recommended
                  </Text>
                </View>
              )}
            </Animated.View>
          </View>

          {/* Investments Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, !isDark && styles.lightText]}>Your Investments</Text>
            
            {portfolioAnalytics.map((item, index) => (
              <Animated.View
                key={item.investment.id}
                entering={FadeInDown.delay(400 + index * 100).springify()}
                style={[styles.investmentCard, !isDark && styles.lightInvestmentCard]}>
                <Image 
                  source={{ uri: item.investment.image }}
                  style={styles.investmentImage}
                />
                <View style={styles.investmentContent}>
                  <Text style={[styles.investmentName, !isDark && styles.lightText]}>
                    {item.investment.projectName}
                  </Text>
                  
                  <View style={styles.investmentMetrics}>
                    <View style={styles.metric}>
                      <Text style={[styles.metricLabel, !isDark && styles.lightSecondaryText]}>
                        Invested
                      </Text>
                      <Text style={[styles.metricValue, !isDark && styles.lightText]}>
                        {formatCurrency(item.investment.amount)}
                      </Text>
                    </View>
                    
                    <View style={styles.metric}>
                      <Text style={[styles.metricLabel, !isDark && styles.lightSecondaryText]}>
                        Predicted Return
                      </Text>
                      <View style={styles.returnContainer}>
                        {item.prediction.predictedPrice > item.investment.amount ? (
                          <TrendingUp size={16} color="#00e6b8" />
                        ) : (
                          <TrendingDown size={16} color="#ff4444" />
                        )}
                        <Text style={[
                          styles.returnText,
                          { 
                            color: item.prediction.predictedPrice > item.investment.amount 
                              ? '#00e6b8' 
                              : '#ff4444' 
                          }
                        ]}>
                          {((item.prediction.predictedPrice / item.investment.amount - 1) * 100).toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.impactMetrics}>
                    <Leaf size={16} color="#00e6b8" />
                    <Text style={[styles.impactText, !isDark && styles.lightSecondaryText]}>
                      {item.environmentalImpact.sustainabilityRating} Impact · 
                      {' '}{Math.round(item.environmentalImpact.impactScore)}/100 Score
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
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
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  lightText: {
    color: '#1a1a1a',
  },
  overviewCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  lightOverviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  overviewItem: {
    flex: 1,
  },
  overviewLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  lightSecondaryText: {
    color: '#666',
  },
  overviewValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  aiCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  lightAiCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  aiMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  aiMetric: {
    alignItems: 'center',
    gap: 8,
  },
  aiMetricLabel: {
    color: '#999',
    fontSize: 12,
  },
  aiMetricValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rebalanceAlert: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  rebalanceText: {
    color: '#ff9800',
    fontSize: 14,
    textAlign: 'center',
  },
  investmentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  lightInvestmentCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  investmentImage: {
    width: '100%',
    height: 120,
  },
  investmentContent: {
    padding: 16,
  },
  investmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  investmentMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  returnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  returnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  impactMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  impactText: {
    color: '#999',
    fontSize: 14,
  },
});