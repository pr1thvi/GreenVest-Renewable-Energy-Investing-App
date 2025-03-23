import { View, Text, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Calendar, Users, Leaf, Star, ArrowUpRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const projects = {
  '1': {
    id: '1',
    name: 'SolarTech Solutions',
    logo: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800',
    sector: 'Renewable Energy',
    location: 'Mumbai, Maharashtra',
    invested: 250000,
    investmentDate: '2024-01-15',
    shares: 1000,
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    progress: 35,
    carbonOffset: 500,
    annualOffset: 100,
    rating: 4.5,
    description: 'Leading provider of solar energy solutions for educational institutions.',
    lastUpdate: 'Construction phase completed ahead of schedule. Panel installation begins next week.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800'
  }
};

export default function ProjectDetails() {
  const { id } = useLocalSearchParams();
  const { isDark } = useTheme();
  const project = projects[id as keyof typeof projects];

  if (!project) return null;

  return (
    <SafeAreaView style={[styles.container, !isDark && styles.lightContainer]}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={{ uri: project.image }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', isDark ? '#1a1a1a' : '#ffffff']}
            style={styles.gradient}
          />
          <View style={styles.logoContainer}>
            <Image source={{ uri: project.logo }} style={styles.logo} />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={[styles.companyName, !isDark && styles.lightText]}>{project.name}</Text>
            <View style={styles.sectorBadge}>
              <Text style={styles.sectorText}>{project.sector}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={16} color="#00e6b8" />
            <Text style={[styles.infoText, !isDark && styles.lightInfoText]}>{project.location}</Text>
          </View>

          <View style={[styles.card, !isDark && styles.lightCard]}>
            <Text style={[styles.cardTitle, !isDark && styles.lightCardTitle]}>Investment Details</Text>
            <View style={styles.cardContent}>
              <View style={styles.detailRow}>
                <Text style={[styles.label, !isDark && styles.lightLabel]}>Amount Invested</Text>
                <Text style={[styles.value, !isDark && styles.lightValue]}>
                  ₹{project.invested.toLocaleString()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.label, !isDark && styles.lightLabel]}>Investment Date</Text>
                <Text style={[styles.value, !isDark && styles.lightValue]}>
                  {new Date(project.investmentDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.label, !isDark && styles.lightLabel]}>Shares Owned</Text>
                <Text style={[styles.value, !isDark && styles.lightValue]}>{project.shares}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, !isDark && styles.lightCard]}>
            <Text style={[styles.cardTitle, !isDark && styles.lightCardTitle]}>Project Timeline</Text>
            <View style={styles.cardContent}>
              <View style={styles.timelineRow}>
                <Calendar size={16} color="#00e6b8" />
                <Text style={[styles.timelineText, !isDark && styles.lightTimelineText]}>
                  {new Date(project.startDate).toLocaleDateString()} -{' '}
                  {new Date(project.endDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${project.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{project.progress}% Complete</Text>
              <View style={styles.updateBox}>
                <ArrowUpRight size={16} color="#00e6b8" />
                <Text style={[styles.updateText, !isDark && styles.lightUpdateText]}>
                  {project.lastUpdate}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, !isDark && styles.lightCard]}>
            <Text style={[styles.cardTitle, !isDark && styles.lightCardTitle]}>
              Environmental Impact
            </Text>
            <View style={styles.cardContent}>
              <View style={styles.impactRow}>
                <Leaf size={20} color="#00e6b8" />
                <View style={styles.impactInfo}>
                  <Text style={[styles.impactValue, !isDark && styles.lightImpactValue]}>
                    {project.carbonOffset} kg CO₂
                  </Text>
                  <Text style={[styles.impactLabel, !isDark && styles.lightImpactLabel]}>
                    Total Carbon Offset
                  </Text>
                </View>
              </View>
              <View style={styles.impactRow}>
                <Users size={20} color="#00e6b8" />
                <View style={styles.impactInfo}>
                  <Text style={[styles.impactValue, !isDark && styles.lightImpactValue]}>
                    {project.annualOffset} kg CO₂/year
                  </Text>
                  <Text style={[styles.impactLabel, !isDark && styles.lightImpactLabel]}>
                    Annual Offset Rate
                  </Text>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                <Text style={[styles.ratingLabel, !isDark && styles.lightRatingLabel]}>
                  Sustainability Rating
                </Text>
                <View style={styles.ratingStars}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      color="#00e6b8"
                      fill={i < Math.floor(project.rating) ? '#00e6b8' : 'transparent'}
                    />
                  ))}
                  <Text style={styles.ratingText}>{project.rating}/5</Text>
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
    height: 300,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  logoContainer: {
    position: 'absolute',
    bottom: -40,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
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
  logo: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  lightText: {
    color: '#1a1a1a',
  },
  sectorBadge: {
    backgroundColor: '#00e6b8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sectorText: {
    color: '#1a1a1a',
    fontSize: 12,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  infoText: {
    color: '#999',
    fontSize: 14,
  },
  lightInfoText: {
    color: '#666',
  },
  card: {
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  lightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  lightCardTitle: {
    color: '#1a1a1a',
  },
  cardContent: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#999',
    fontSize: 14,
  },
  lightLabel: {
    color: '#666',
  },
  value: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  lightValue: {
    color: '#1a1a1a',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineText: {
    color: '#999',
    fontSize: 14,
  },
  lightTimelineText: {
    color: '#666',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00e6b8',
    borderRadius: 2,
  },
  progressText: {
    color: '#00e6b8',
    fontSize: 14,
    textAlign: 'center',
  },
  updateBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(0, 230, 184, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  updateText: {
    color: '#999',
    fontSize: 14,
    flex: 1,
  },
  lightUpdateText: {
    color: '#666',
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  impactInfo: {
    flex: 1,
  },
  impactValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  lightImpactValue: {
    color: '#1a1a1a',
  },
  impactLabel: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  lightImpactLabel: {
    color: '#666',
  },
  ratingContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  ratingLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
  },
  lightRatingLabel: {
    color: '#666',
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#00e6b8',
    fontSize: 14,
    marginLeft: 8,
  },
});