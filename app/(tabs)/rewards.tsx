import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInvestments } from '@/context/InvestmentsContext';
import { useTheme } from '@/context/ThemeContext';
import { Gift, Award, Trophy, Star, Leaf, Trees as Tree, Recycle, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

const POINTS_PER_1000 = 1; // 1000 rs = 1 eco point

const rewards = [
  {
    id: 'tree-planting',
    name: 'Plant a Tree',
    description: 'We\'ll plant a tree in your name',
    points: 100,
    icon: Tree,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
  },
  {
    id: 'carbon-offset',
    name: 'Carbon Offset Certificate',
    description: 'Get a verified carbon offset certificate',
    points: 250,
    icon: Leaf,
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800',
  },
  {
    id: 'eco-badge',
    name: 'Green Investor Badge',
    description: 'Digital badge for your profile',
    points: 500,
    icon: Award,
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800',
  },
  {
    id: 'premium-access',
    name: 'Premium Analytics',
    description: '1 month of premium market insights',
    points: 1000,
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=800',
  },
];

const achievements = [
  {
    id: 'first-investment',
    name: 'First Steps',
    description: 'Make your first green investment',
    points: 50,
    icon: Star,
    progress: 1,
    total: 1,
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Offset 1000kg of CO2',
    points: 100,
    icon: Trophy,
    progress: 750,
    total: 1000,
  },
  {
    id: 'green-portfolio',
    name: 'Green Portfolio',
    description: 'Invest in 5 different green projects',
    points: 200,
    icon: Recycle,
    progress: 3,
    total: 5,
  },
];

export default function RewardsScreen() {
  const { investments } = useInvestments();
  const { isDark } = useTheme();

  // Calculate total eco points
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const ecoPoints = Math.floor(totalInvested / 1000);

  return (
    <SafeAreaView style={[styles.container, !isDark && styles.lightContainer]}>
      <ScrollView>
        <LinearGradient
          colors={isDark ? ['#00e6b8', '#1a1a1a'] : ['#00e6b8', '#ffffff']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}>
          <Text style={[styles.title, !isDark && styles.lightText]}>Eco Rewards</Text>
          
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            style={[styles.pointsCard, !isDark && styles.lightPointsCard]}>
            <Gift size={32} color="#00e6b8" />
            <View style={styles.pointsInfo}>
              <Text style={[styles.pointsValue, !isDark && styles.lightText]}>
                {ecoPoints} Points
              </Text>
              <Text style={[styles.pointsLabel, !isDark && styles.lightSecondaryText]}>
                Keep investing to earn more!
              </Text>
            </View>
          </Animated.View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Achievements Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, !isDark && styles.lightText]}>Achievements</Text>
            
            {achievements.map((achievement, index) => (
              <Animated.View
                key={achievement.id}
                entering={FadeInDown.delay(300 + index * 100).springify()}
                style={[styles.achievementCard, !isDark && styles.lightAchievementCard]}>
                <View style={styles.achievementHeader}>
                  <View style={[styles.achievementIcon, { backgroundColor: '#00e6b8' }]}>
                    <achievement.icon size={24} color="#fff" />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={[styles.achievementName, !isDark && styles.lightText]}>
                      {achievement.name}
                    </Text>
                    <Text style={[styles.achievementDescription, !isDark && styles.lightSecondaryText]}>
                      {achievement.description}
                    </Text>
                  </View>
                  <Text style={styles.achievementPoints}>+{achievement.points}</Text>
                </View>
                
                <View style={[styles.progressBar, !isDark && styles.lightProgressBar]}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${(achievement.progress / achievement.total) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, !isDark && styles.lightSecondaryText]}>
                  {achievement.progress} / {achievement.total}
                </Text>
              </Animated.View>
            ))}
          </View>

          {/* Available Rewards Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, !isDark && styles.lightText]}>Available Rewards</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rewardsContainer}>
              {rewards.map((reward, index) => (
                <Animated.View
                  key={reward.id}
                  entering={FadeInDown.delay(400 + index * 100).springify()}
                  style={[styles.rewardCard, !isDark && styles.lightRewardCard]}>
                  <Image source={{ uri: reward.image }} style={styles.rewardImage} />
                  <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent']}
                    style={styles.imageOverlay}
                  />
                  
                  <View style={styles.rewardContent}>
                    <View style={styles.rewardHeader}>
                      <reward.icon size={24} color="#00e6b8" />
                      <Text style={styles.rewardPoints}>{reward.points} pts</Text>
                    </View>
                    <Text style={[styles.rewardName, !isDark && styles.lightText]}>
                      {reward.name}
                    </Text>
                    <Text style={[styles.rewardDescription, !isDark && styles.lightSecondaryText]}>
                      {reward.description}
                    </Text>
                    
                    <TouchableOpacity
                      style={[
                        styles.redeemButton,
                        ecoPoints < reward.points && styles.redeemButtonDisabled
                      ]}
                      disabled={ecoPoints < reward.points}>
                      <Text style={styles.redeemButtonText}>
                        {ecoPoints >= reward.points ? 'Redeem' : 'Not Enough Points'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </ScrollView>
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
  pointsCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
  lightPointsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  pointsInfo: {
    flex: 1,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  pointsLabel: {
    color: '#999',
    fontSize: 14,
  },
  lightSecondaryText: {
    color: '#666',
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  lightAchievementCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#999',
  },
  achievementPoints: {
    color: '#00e6b8',
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  lightProgressBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00e6b8',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  rewardsContainer: {
    paddingBottom: 8,
    gap: 16,
  },
  rewardCard: {
    width: 280,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  lightRewardCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  rewardImage: {
    width: '100%',
    height: 160,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  rewardContent: {
    padding: 16,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardPoints: {
    color: '#00e6b8',
    fontSize: 16,
    fontWeight: '600',
  },
  rewardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  redeemButton: {
    backgroundColor: '#00e6b8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  redeemButtonDisabled: {
    backgroundColor: '#666',
  },
  redeemButtonText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
});