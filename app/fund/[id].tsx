import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, TrendingUp, TrendingDown, Info, Calendar, DollarSign, Percent, ChartBar as BarChart3 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { mockFunds } from '@/app/(tabs)';

const timeRanges = ['1h', '1d', '1w', '1m', '1y', 'All'];

export default function FundDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();
  
  const fund = mockFunds.find(f => f.id === id);
  
  if (!fund) {
    return null;
  }

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

  const formatLargeCurrency = (value: number | undefined) => {
    if (!value) return 'N/A';
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return formatCurrency(value);
  };

  return (
    <SafeAreaView style={[styles.container, !isDark && styles.lightContainer]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ArrowLeft size={24} color={isDark ? '#fff' : '#1a1a1a'} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.fundName, !isDark && styles.lightText]}>{fund.name}</Text>
            <Text style={[styles.fundSymbol, !isDark && styles.lightSecondaryText]}>
              {fund.symbol}
            </Text>
          </View>
        </View>

        {/* Price Section */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={[styles.priceSection, !isDark && styles.lightPriceSection]}>
          <Text style={[styles.currentPrice, !isDark && styles.lightText]}>
            {formatCurrency(fund.priceAtClose || fund.value)}
          </Text>
          <View style={[
            styles.changeBadge,
            { backgroundColor: fund.change > 0 ? '#00e6b8' : '#ff4444' }
          ]}>
            {fund.change > 0 ? (
              <TrendingUp size={16} color="#1a1a1a" />
            ) : (
              <TrendingDown size={16} color="#1a1a1a" />
            )}
            <Text style={styles.changeText}>{formatPercentage(fund.change)}</Text>
          </View>
        </Animated.View>

        {/* Chart Image */}
        <View style={styles.chartContainer}>
          <Image
            source={{ uri: fund.image || 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800' }}
            style={styles.chartImage}
            resizeMode="cover"
          />
        </View>

        {/* Time Range Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.timeRangeScroll}
          contentContainerStyle={styles.timeRangeContainer}>
          {timeRanges.map((range, index) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                index === 1 && styles.timeRangeButtonActive,
                !isDark && styles.lightTimeRangeButton,
                index === 1 && !isDark && styles.lightTimeRangeButtonActive,
              ]}>
              <Text style={[
                styles.timeRangeText,
                index === 1 && styles.timeRangeTextActive,
                !isDark && styles.lightTimeRangeText,
                index === 1 && !isDark && styles.lightTimeRangeTextActive,
              ]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Fund Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, !isDark && styles.lightText]}>Info & Stats</Text>
          <View style={[styles.infoGrid, !isDark && styles.lightInfoGrid]}>
            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <Info size={16} color={isDark ? '#999' : '#666'} />
                <Text style={[styles.infoLabel, !isDark && styles.lightInfoLabel]}>AUM</Text>
              </View>
              <Text style={[styles.infoValue, !isDark && styles.lightInfoValue]}>
                {formatLargeCurrency(fund.aum)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <Calendar size={16} color={isDark ? '#999' : '#666'} />
                <Text style={[styles.infoLabel, !isDark && styles.lightInfoLabel]}>Issued Date</Text>
              </View>
              <Text style={[styles.infoValue, !isDark && styles.lightInfoValue]}>
                {fund.issuedDate ? new Date(fund.issuedDate).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <BarChart3 size={16} color={isDark ? '#999' : '#666'} />
                <Text style={[styles.infoLabel, !isDark && styles.lightInfoLabel]}>Vintage Range</Text>
              </View>
              <Text style={[styles.infoValue, !isDark && styles.lightInfoValue]}>
                {fund.vintageRange || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <Percent size={16} color={isDark ? '#999' : '#666'} />
                <Text style={[styles.infoLabel, !isDark && styles.lightInfoLabel]}>TER</Text>
              </View>
              <Text style={[styles.infoValue, !isDark && styles.lightInfoValue]}>
                {fund.ter ? `${fund.ter}%` : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Holdings - Only show if available */}
        {fund.holdings && fund.holdings.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, !isDark && styles.lightText]}>Top Holdings</Text>
            {fund.holdings.map((holding, index) => (
              <Animated.View
                key={holding.name}
                entering={FadeInDown.delay(400 + index * 100).springify()}
                style={[styles.holdingCard, !isDark && styles.lightHoldingCard]}>
                <View style={styles.holdingInfo}>
                  <Text style={[styles.holdingName, !isDark && styles.lightText]}>
                    {holding.name}
                  </Text>
                  <Text style={[styles.holdingAllocation, !isDark && styles.lightSecondaryText]}>
                    {holding.allocation}% of portfolio
                  </Text>
                </View>
                <View style={[styles.allocationBar, !isDark && styles.lightAllocationBar]}>
                  <View 
                    style={[
                      styles.allocationFill,
                      { width: `${holding.allocation}%` }
                    ]} 
                  />
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Description - Only show if available */}
        {fund.description && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, !isDark && styles.lightText]}>About</Text>
            <Text style={[styles.description, !isDark && styles.lightSecondaryText]}>
              {fund.description}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Buy Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.buyButton}
          activeOpacity={0.8}>
          <DollarSign size={20} color="#1a1a1a" />
          <Text style={styles.buyButtonText}>Buy</Text>
        </TouchableOpacity>
      </View>
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
  scrollView: {
    flex: 1,
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
  headerContent: {
    flex: 1,
  },
  fundName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  fundSymbol: {
    fontSize: 16,
    color: '#999',
  },
  lightText: {
    color: '#1a1a1a',
  },
  lightSecondaryText: {
    color: '#666',
  },
  priceSection: {
    padding: 20,
    paddingTop: 0,
  },
  lightPriceSection: {
    backgroundColor: '#ffffff',
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00e6b8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 4,
  },
  changeText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
  chartContainer: {
    height: 200,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chartImage: {
    width: '100%',
    height: '100%',
  },
  timeRangeScroll: {
    marginBottom: 20,
  },
  timeRangeContainer: {
    paddingHorizontal: 20,
    gap: 8,
    flexDirection: 'row',
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  lightTimeRangeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  timeRangeButtonActive: {
    backgroundColor: '#00e6b8',
  },
  lightTimeRangeButtonActive: {
    backgroundColor: '#00e6b8',
  },
  timeRangeText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  lightTimeRangeText: {
    color: '#666',
  },
  timeRangeTextActive: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  lightTimeRangeTextActive: {
    color: '#1a1a1a',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  lightInfoGrid: {
    backgroundColor: '#ffffff',
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoLabel: {
    color: '#999',
    fontSize: 14,
  },
  lightInfoLabel: {
    color: '#666',
  },
  infoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  lightInfoValue: {
    color: '#1a1a1a',
  },
  holdingCard: {
    marginBottom: 16,
  },
  lightHoldingCard: {
    backgroundColor: '#ffffff',
  },
  holdingInfo: {
    marginBottom: 8,
  },
  holdingName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  holdingAllocation: {
    color: '#999',
    fontSize: 14,
  },
  allocationBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  lightAllocationBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  allocationFill: {
    height: '100%',
    backgroundColor: '#00e6b8',
    borderRadius: 2,
  },
  description: {
    color: '#999',
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    paddingTop: 0,
  },
  buyButton: {
    backgroundColor: '#00e6b8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buyButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});