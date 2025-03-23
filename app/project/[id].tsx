import { View, Text, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Calendar, Users, Leaf, Star, ArrowUpRight, TrendingUp, Shield, Target } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useInvestments } from '@/context/InvestmentsContext';
import { LinearGradient } from 'expo-linear-gradient';

// Template project data structure
interface ProjectDetails {
  id: string;
  name: string;
  logo: string;
  sector: string;
  location: string;
  invested: number | null;
  investmentDate: string | null;
  shares: number | null;
  startDate: string | null;
  endDate: string | null;
  progress: number | null;
  carbonOffset: number | null;
  annualOffset: number | null;
  rating: number | null;
  description: string | null;
  lastUpdate: string | null;
  image: string;
  riskLevel: string | null;
  expectedReturn: number | null;
  minimumInvestment: number | null;
  totalFunding: number | null;
  supportersCount: number | null;
  sustainabilityScore: number | null;
  energyType: string | null;
  projectStatus: string | null;
  companyRegistration: string | null;
  teamSize: number | null;
  projectDocuments: string[] | null;
}

// Sample project data (you would fetch this from your database)
const projectsData: Record<string, Partial<ProjectDetails>> = {
  '1': {
    name: 'SolarTech Solutions',
    logo: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800',
    sector: 'Solar Energy',
    location: 'Mumbai, Maharashtra',
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    progress: 35,
    description: 'Leading provider of solar energy solutions for educational institutions.',
    lastUpdate: 'Construction phase completed ahead of schedule. Panel installation begins next week.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    riskLevel: 'Moderate',
    expectedReturn: 12,
    minimumInvestment: 50000,
    energyType: 'Solar',
    projectStatus: 'In Progress',
  },
  '2': {
    name: 'WindPower Innovations',
    logo: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800',
    sector: 'Wind Energy',
    location: 'Gujarat Coast',
    startDate: '2024-03-01',
    endDate: '2025-04-01',
    progress: 45,
    description: 'Pioneering offshore wind farm technology for coastal regions.',
    image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800',
    riskLevel: 'Low',
    expectedReturn: 15,
    minimumInvestment: 75000,
    energyType: 'Wind',
    projectStatus: 'Planning',
  },
  '3': {
    name: 'HydroTech Systems',
    logo: 'https://images.unsplash.com/photo-1481026469463-66327c86e544?w=800',
    sector: 'Hydroelectric Power',
    location: 'Himachal Pradesh',
    startDate: '2024-02-15',
    endDate: '2025-03-15',
    progress: 60,
    description: 'Sustainable hydroelectric power generation in the Himalayas.',
    image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',
    riskLevel: 'High',
    expectedReturn: 18,
    minimumInvestment: 100000,
    energyType: 'Hydro',
    projectStatus: 'Construction',
  },
  '4': {
    name: 'BioPower Solutions',
    logo: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800',
    sector: 'Biomass Energy',
    location: 'Punjab',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    progress: 25,
    description: 'Converting agricultural waste into clean, renewable energy.',
    image: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=800',
    riskLevel: 'Moderate',
    expectedReturn: 10,
    minimumInvestment: 25000,
    energyType: 'Biomass',
    projectStatus: 'Planning',
  },
};

export default function ProjectDetails() {
  const { id } = useLocalSearchParams();
  const { isDark } = useTheme();
  const { investments } = useInvestments();

  // Get project base data
  const projectData = projectsData[id as string] || {};

  // Find investment details for this project
  const investment = investments.find(inv => inv.projectId === id);

  // Combine project data with investment details
  const project: ProjectDetails = {
    id: id as string,
    name: projectData.name || 'NA',
    logo: projectData.logo || 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800',
    sector: projectData.sector || 'NA',
    location: projectData.location || 'NA',
    invested: investment?.amount || null,
    investmentDate: investment?.date || null,
    shares: investment ? Math.floor(investment.amount / 1000) : null, // Example calculation
    startDate: projectData.startDate || null,
    endDate: projectData.endDate || null,
    progress: projectData.progress || null,
    carbonOffset: investment ? Math.floor(investment.amount * 0.002) : null, // Example calculation
    annualOffset: investment ? Math.floor(investment.amount * 0.0004) : null, // Example calculation
    rating: 4.5, // Example static rating
    description: projectData.description || null,
    lastUpdate: projectData.lastUpdate || null,
    image: projectData.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    riskLevel: projectData.riskLevel || null,
    expectedReturn: projectData.expectedReturn || null,
    minimumInvestment: projectData.minimumInvestment || null,
    totalFunding: null, // Would come from backend
    supportersCount: null, // Would come from backend
    sustainabilityScore: null, // Would come from backend
    energyType: projectData.energyType || null,
    projectStatus: projectData.projectStatus || null,
    companyRegistration: null, // Would come from backend
    teamSize: null, // Would come from backend
    projectDocuments: null, // Would come from backend
  };

  const formatValue = (value: any, prefix: string = '', suffix: string = '') => {
    if (value === null || value === undefined) return 'NA';
    return `${prefix}${value}${suffix}`;
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'NA';
    return new Date(date).toLocaleDateString();
  };

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
            <Text style={[styles.cardTitle, !isDark && styles.lightCardTitle]}>Key Metrics</Text>
            <View style={styles.cardContent}>
              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Shield size={20} color="#00e6b8" />
                  <View>
                    <Text style={[styles.metricValue, !isDark && styles.lightMetricValue]}>
                      {formatValue(project.riskLevel)}
                    </Text>
                    <Text style={[styles.metricLabel, !isDark && styles.lightMetricLabel]}>
                      Risk Level
                    </Text>
                  </View>
                </View>
                <View style={styles.metric}>
                  <TrendingUp size={20} color="#00e6b8" />
                  <View>
                    <Text style={[styles.metricValue, !isDark && styles.lightMetricValue]}>
                      {formatValue(project.expectedReturn, '', '%')}
                    </Text>
                    <Text style={[styles.metricLabel, !isDark && styles.lightMetricLabel]}>
                      Expected Return
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Target size={20} color="#00e6b8" />
                  <View>
                    <Text style={[styles.metricValue, !isDark && styles.lightMetricValue]}>
                      {formatValue(project.minimumInvestment, '₹')}
                    </Text>
                    <Text style={[styles.metricLabel, !isDark && styles.lightMetricLabel]}>
                      Minimum Investment
                    </Text>
                  </View>
                </View>
                <View style={styles.metric}>
                  <Users size={20} color="#00e6b8" />
                  <View>
                    <Text style={[styles.metricValue, !isDark && styles.lightMetricValue]}>
                      {formatValue(project.supportersCount)}
                    </Text>
                    <Text style={[styles.metricLabel, !isDark && styles.lightMetricLabel]}>
                      Supporters
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.card, !isDark && styles.lightCard]}>
            <Text style={[styles.cardTitle, !isDark && styles.lightCardTitle]}>Investment Details</Text>
            <View style={styles.cardContent}>
              <View style={styles.detailRow}>
                <Text style={[styles.label, !isDark && styles.lightLabel]}>Amount Invested</Text>
                <Text style={[styles.value, !isDark && styles.lightValue]}>
                  {formatValue(project.invested, '₹')}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.label, !isDark && styles.lightLabel]}>Investment Date</Text>
                <Text style={[styles.value, !isDark && styles.lightValue]}>
                  {formatDate(project.investmentDate)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.label, !isDark && styles.lightLabel]}>Shares Owned</Text>
                <Text style={[styles.value, !isDark && styles.lightValue]}>
                  {formatValue(project.shares)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.label, !isDark && styles.lightLabel]}>Total Funding</Text>
                <Text style={[styles.value, !isDark && styles.lightValue]}>
                  {formatValue(project.totalFunding, '₹')}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, !isDark && styles.lightCard]}>
            <Text style={[styles.cardTitle, !isDark && styles.lightCardTitle]}>Project Timeline</Text>
            <View style={styles.cardContent}>
              <View style={styles.timelineRow}>
                <Calendar size={16} color="#00e6b8" />
                <Text style={[styles.timelineText, !isDark && styles.lightTimelineText]}>
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: project.progress ? `${project.progress}%` : '0%' },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {formatValue(project.progress, '', '%')} Complete
              </Text>
              {project.lastUpdate && (
                <View style={styles.updateBox}>
                  <ArrowUpRight size={16} color="#00e6b8" />
                  <Text style={[styles.updateText, !isDark && styles.lightUpdateText]}>
                    {project.lastUpdate}
                  </Text>
                </View>
              )}
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
                    {formatValue(project.carbonOffset, '', ' kg CO₂')}
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
                    {formatValue(project.annualOffset, '', ' kg CO₂/year')}
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
                      fill={project.rating && i < Math.floor(project.rating) ? '#00e6b8' : 'transparent'}
                    />
                  ))}
                  <Text style={styles.ratingText}>
                    {formatValue(project.rating)}/5
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.card, !isDark && styles.lightCard]}>
            <Text style={[styles.cardTitle, !isDark && styles.lightCardTitle]}>
              Additional Information
            </Text>
            <View style={styles.cardContent}>
              <View style={styles.detailRow}>
                <Text style={[styles.label, !isDark && styles.lightLabel]}>Energy Type</Text>
                <Text style={[styles.value, !isDark && styles.lightValue]}>
                  {formatValue(project.energyType)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.label, !isDark && styles.lightLabel]}>Project Status</Text>
                <Text style={[styles.value, !isDark && styles.lightValue]}>
                  {formatValue(project.projectStatus)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.label, !isDark && styles.lightLabel]}>Company Registration</Text>
                <Text style={[styles.value, !isDark && styles.lightValue]}>
                  {formatValue(project.companyRegistration)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.label, !isDark && styles.lightLabel]}>Team Size</Text>
                <Text style={[styles.value, !isDark && styles.lightValue]}>
                  {formatValue(project.teamSize)}
                </Text>
              </View>
              {project.projectDocuments && project.projectDocuments.length > 0 && (
                <View style={styles.documentsSection}>
                  <Text style={[styles.label, !isDark && styles.lightLabel]}>Documents</Text>
                  <View style={styles.documentsList}>
                    {project.projectDocuments.map((doc, index) => (
                      <Text
                        key={index}
                        style={[styles.documentLink, !isDark && styles.lightDocumentLink]}>
                        {doc}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
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
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  metric: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  lightMetricValue: {
    color: '#1a1a1a',
  },
  metricLabel: {
    color: '#999',
    fontSize: 12,
  },
  lightMetricLabel: {
    color: '#666',
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
  documentsSection: {
    marginTop: 8,
  },
  documentsList: {
    marginTop: 8,
    gap: 8,
  },
  documentLink: {
    color: '#00e6b8',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  lightDocumentLink: {
    color: '#008066',
  },
});