import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, TrendingUp, TrendingDown, Wind, Sun, Leaf, Droplets, Factory, Recycle, ArrowLeftRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState } from 'react';

const mockPortfolio = {
  totalValue: 124523.45,
  totalGrowth: 31.82,
  accountBalance: 145723.89
};

export const mockFunds = [
  {
    id: 'wind-energy',
    name: 'Wind Energy ETF',
    symbol: 'WIND',
    icon: Wind,
    value: 24050.75,
    change: 0.5,
    color: '#00e6b8',
    image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800',
    aum: 1200000000,
    issuedDate: '2022-04-18',
    vintageRange: '2010 - 2022',
    ter: 0.15,
    priceAtClose: 18.23,
    priceAtOpen: 17.74,
    description: 'A comprehensive ETF tracking the performance of leading companies in the wind energy sector, including turbine manufacturers, wind farm operators, and renewable energy utilities.',
    holdings: [
      { name: 'Vestas Wind Systems', allocation: 12.5 },
      { name: 'Siemens Gamesa', allocation: 10.8 },
      { name: 'Northland Power', allocation: 8.5 },
      { name: 'Orsted', allocation: 7.9 },
      { name: 'NextEra Energy', allocation: 6.4 }
    ]
  },
  {
    id: 'solar-power',
    name: 'Solar Power Fund',
    symbol: 'SOLR',
    icon: Sun,
    value: 9525.30,
    change: -1.2,
    color: '#FF6B6B',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    aum: 850000000,
    issuedDate: '2021-09-15',
    vintageRange: '2015 - 2023',
    ter: 0.18,
    priceAtClose: 95.25,
    priceAtOpen: 96.40,
    description: 'An actively managed fund investing in solar technology companies, photovoltaic panel manufacturers, and solar power plant operators worldwide.',
    holdings: [
      { name: 'First Solar Inc', allocation: 15.2 },
      { name: 'SolarEdge Technologies', allocation: 12.1 },
      { name: 'Enphase Energy', allocation: 10.5 },
      { name: 'Sunrun Inc', allocation: 8.2 },
      { name: 'Canadian Solar', allocation: 6.8 }
    ]
  },
  {
    id: 'natural-resources',
    name: 'Natural Resources',
    symbol: 'NATR',
    icon: Leaf,
    value: 27150.45,
    change: 2.3,
    color: '#4CAF50',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800',
    aum: 1500000000,
    issuedDate: '2020-06-22',
    vintageRange: '2012 - 2023',
    ter: 0.22,
    priceAtClose: 271.50,
    priceAtOpen: 265.40,
    description: 'A diversified fund focusing on sustainable resource management, including sustainable forestry, organic agriculture, and biodiversity conservation projects.',
    holdings: [
      { name: 'Sustainable Timber Corp', allocation: 14.3 },
      { name: 'Green Earth Resources', allocation: 11.7 },
      { name: 'Bio-Organic Farms Ltd', allocation: 9.8 },
      { name: 'EcoSystem Management', allocation: 8.4 },
      { name: 'Natural Capital Group', allocation: 7.2 }
    ]
  },
  {
    id: 'water-tech',
    name: 'Water Technology',
    symbol: 'WATR',
    icon: Droplets,
    value: 18275.90,
    change: 1.7,
    color: '#2196F3',
    image: 'https://images.unsplash.com/photo-1581093458791-9d42eede2a77?w=800',
    aum: 750000000,
    issuedDate: '2021-03-10',
    vintageRange: '2018 - 2023',
    ter: 0.20,
    priceAtClose: 182.75,
    priceAtOpen: 179.70,
    description: 'An innovative fund investing in water purification technology, smart water infrastructure, and companies developing solutions for water conservation and management.',
    holdings: [
      { name: 'Pure Water Solutions', allocation: 13.6 },
      { name: 'Smart Water Systems', allocation: 11.9 },
      { name: 'Aqua Technologies', allocation: 10.2 },
      { name: 'H2O Infrastructure', allocation: 8.7 },
      { name: 'Blue Gold Corp', allocation: 7.5 }
    ]
  },
  {
    id: 'clean-industry',
    name: 'Clean Industry',
    symbol: 'CLNI',
    icon: Factory,
    value: 31425.60,
    change: -0.8,
    color: '#9C27B0',
    image: 'https://images.unsplash.com/photo-1590959651373-a3db0f38a961?w=800',
    aum: 2000000000,
    issuedDate: '2019-11-30',
    vintageRange: '2015 - 2023',
    ter: 0.17,
    priceAtClose: 314.25,
    priceAtOpen: 316.80,
    description: 'A fund focused on industrial companies implementing clean technologies, sustainable manufacturing processes, and zero-emission production methods.',
    holdings: [
      { name: 'Green Manufacturing Co', allocation: 14.8 },
      { name: 'Clean Tech Industries', allocation: 12.3 },
      { name: 'Sustainable Factory Corp', allocation: 9.6 },
      { name: 'Zero Emission Solutions', allocation: 8.9 },
      { name: 'EcoIndustrial Group', allocation: 7.8 }
    ]
  },
  {
    id: 'recycling',
    name: 'Recycling Solutions',
    symbol: 'RCYL',
    icon: Recycle,
    value: 13850.25,
    change: 3.1,
    color: '#FF9800',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    aum: 600000000,
    issuedDate: '2022-01-05',
    vintageRange: '2020 - 2023',
    ter: 0.19,
    priceAtClose: 138.50,
    priceAtOpen: 134.30,
    description: 'An ETF investing in companies specializing in waste management, recycling technologies, and circular economy solutions, including plastic recycling and e-waste management.',
    holdings: [
      { name: 'Circular Solutions Inc', allocation: 13.9 },
      { name: 'Waste Management Tech', allocation: 11.4 },
      { name: 'RecycleNow Corp', allocation: 9.7 },
      { name: 'Green Loop Systems', allocation: 8.3 },
      { name: 'EcoRecycle Group', allocation: 7.1 }
    ]
  }
];

const learningTopics = [
  {
    id: 'why-invest',
    title: 'Why invest in green energy?',
    description: 'Learn about the benefits of sustainable investing'
  },
  {
    id: 'carbon-credits',
    title: 'Understanding carbon credits',
    description: 'How carbon offset markets work'
  },
  {
    id: 'esg-investing',
    title: 'ESG Investment Guide',
    description: 'Environmental, Social, and Governance criteria'
  }
];

export default function HomeScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);

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

  const handleFundPress = (fundId: string) => {
    router.push(`/fund/${fundId}`);
  };

  const handleFundLongPress = (fundId: string) => {
    setSelectedFunds(prev => {
      if (prev.includes(fundId)) {
        return prev.filter(id => id !== fundId);
      }
      return [...prev, fundId];
    });
  };

  const handleCompare = () => {
    if (selectedFunds.length >= 2) {
      router.push({
        pathname: '/compare',
        params: { funds: selectedFunds.join(',') }
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, !isDark && styles.lightContainer]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.accountInfo}>
            <Text style={[styles.accountLabel, !isDark && styles.lightText]}>Account</Text>
            <Text style={[styles.accountValue, !isDark && styles.lightText]}>
              {formatCurrency(mockPortfolio.accountBalance)}
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={isDark ? '#fff' : '#1a1a1a'} />
          </TouchableOpacity>
        </View>

        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={[styles.portfolioCard, !isDark && styles.lightPortfolioCard]}>
          <Text style={[styles.portfolioLabel, !isDark && styles.lightText]}>Portfolio</Text>
          <View style={styles.portfolioValue}>
            <Text style={[styles.valueText, !isDark && styles.lightText]}>
              {formatCurrency(mockPortfolio.totalValue)}
            </Text>
            <View style={[
              styles.changeBadge,
              { backgroundColor: mockPortfolio.totalGrowth > 0 ? '#00e6b8' : '#ff4444' }
            ]}>
              {mockPortfolio.totalGrowth > 0 ? (
                <TrendingUp size={16} color="#1a1a1a" />
              ) : (
                <TrendingDown size={16} color="#1a1a1a" />
              )}
              <Text style={styles.changeText}>
                {formatPercentage(mockPortfolio.totalGrowth)}
              </Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, !isDark && styles.lightText]}>Green Funds</Text>
            {selectedFunds.length >= 2 && (
              <TouchableOpacity 
                style={[styles.compareButton, !isDark && styles.lightCompareButton]}
                onPress={handleCompare}>
                <ArrowLeftRight size={16} color={isDark ? '#fff' : '#1a1a1a'} />
                <Text style={[styles.compareText, !isDark && styles.lightCompareText]}>
                  Compare ({selectedFunds.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fundsContainer}>
            {mockFunds.map((fund, index) => (
              <TouchableOpacity
                key={fund.id}
                onPress={() => handleFundPress(fund.id)}
                onLongPress={() => handleFundLongPress(fund.id)}
                delayLongPress={300}
                activeOpacity={0.7}>
                <Animated.View
                  entering={FadeInDown.delay(300 + index * 100).springify()}
                  style={[
                    styles.fundCard,
                    !isDark && styles.lightFundCard,
                    selectedFunds.includes(fund.id) && styles.selectedFundCard,
                    !isDark && selectedFunds.includes(fund.id) && styles.lightSelectedFundCard
                  ]}>
                  <View style={[styles.fundIcon, { backgroundColor: fund.color }]}>
                    <fund.icon size={24} color="#fff" />
                  </View>
                  <View style={styles.fundInfo}>
                    <Text style={[styles.fundName, !isDark && styles.lightText]}>{fund.name}</Text>
                    <Text style={[styles.fundSymbol, !isDark && styles.lightSecondaryText]}>
                      {fund.symbol}
                    </Text>
                  </View>
                  <View style={styles.fundValue}>
                    <Text style={[styles.fundPrice, !isDark && styles.lightText]}>
                      {formatCurrency(fund.value)}
                    </Text>
                    <Text style={[
                      styles.fundChange,
                      { color: fund.change > 0 ? '#00e6b8' : '#ff4444' }
                    ]}>
                      {formatPercentage(fund.change)}
                    </Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, !isDark && styles.lightText]}>Learn</Text>
          {learningTopics.map((topic, index) => (
            <Animated.View
              key={topic.id}
              entering={FadeInDown.delay(600 + index * 100).springify()}
              style={[styles.learningCard, !isDark && styles.lightLearningCard]}>
              <View style={styles.learningContent}>
                <Text style={[styles.learningTitle, !isDark && styles.lightText]}>
                  {topic.title}
                </Text>
                <Text style={[styles.learningDescription, !isDark && styles.lightSecondaryText]}>
                  {topic.description}
                </Text>
              </View>
            </Animated.View>
          ))}
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  accountInfo: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  accountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  lightText: {
    color: '#1a1a1a',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portfolioCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  lightPortfolioCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  portfolioLabel: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
  },
  portfolioValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00e6b8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  changeText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  lightCompareButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  compareText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  lightCompareText: {
    color: '#1a1a1a',
  },
  fundsContainer: {
    paddingBottom: 8,
    gap: 16,
  },
  fundCard: {
    width: 300,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  lightFundCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectedFundCard: {
    borderWidth: 2,
    borderColor: '#00e6b8',
  },
  lightSelectedFundCard: {
    borderWidth: 2,
    borderColor: '#00e6b8',
  },
  fundIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fundInfo: {
    flex: 1,
  },
  fundName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  fundSymbol: {
    fontSize: 14,
    color: '#999',
  },
  lightSecondaryText: {
    color: '#666',
  },
  fundValue: {
    alignItems: 'flex-end',
  },
  fundPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  fundChange: {
    fontSize: 14,
  },
  learningCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  lightLearningCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  learningContent: {
    gap: 8,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  learningDescription: {
    fontSize: 14,
    color: '#999',
  },
});