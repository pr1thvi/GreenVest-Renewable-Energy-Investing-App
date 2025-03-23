import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

// Fixed card dimensions
const CARD_WIDTH = 320;
const CARD_HEIGHT = 520;
const CARD_GAP = 20;

const projects = [
  {
    id: 1,
    title: 'Hydropower for Rural Development',
    location: 'Mumbai, Maharashtra',
    image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',
    description:
      'This project aims to implement small-scale hydropower systems in rural areas to provide sustainable and reliable electricity, reduce dependency on fossil fuels, and promote economic development.',
    raised: 0,
    goal: 1500000,
    daysLeft: 15,
    supporters: 220,
  },
  {
    id: 2,
    title: 'Wind Farm Expansion Project',
    location: 'Gujarat Coast',
    image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800',
    description:
      'Expanding our coastal wind farm to harness the strong sea breezes, providing clean energy to over 100,000 households while creating local employment opportunities.',
    raised: 2500000,
    goal: 5000000,
    daysLeft: 45,
    supporters: 890,
  },
  {
    id: 3,
    title: 'Solar-Powered Agriculture',
    location: 'Punjab',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    description:
      'Implementing solar-powered irrigation systems for farmers, reducing electricity costs and increasing agricultural productivity while promoting sustainable farming practices.',
    raised: 750000,
    goal: 2000000,
    daysLeft: 30,
    supporters: 445,
  },
  {
    id: 4,
    title: 'Biomass Energy Hub',
    location: 'Kerala',
    image: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=800',
    description:
      'Creating a centralized biomass processing facility to convert agricultural waste into clean energy, supporting local farmers and reducing environmental impact.',
    raised: 1200000,
    goal: 3000000,
    daysLeft: 20,
    supporters: 678,
  },
];

export default function ProjectsScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateY = useSharedValue(0);
  const { isDark } = useTheme();
  const router = useRouter();

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_GAP));
    setCurrentIndex(index);
  };

  const scrollTo = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < projects.length) {
      scrollRef.current?.scrollTo({
        x: newIndex * (CARD_WIDTH + CARD_GAP),
        animated: true,
      });
      setCurrentIndex(newIndex);
      translateY.value = withSpring(-20, {}, () => {
        translateY.value = withTiming(0);
      });
    }
  };

  const handleInvestPress = (project: typeof projects[0]) => {
    router.push({
      pathname: '/project/invest',
      params: { 
        projectId: project.id,
        projectName: project.title
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <SafeAreaView style={[styles.container, !isDark && styles.lightContainer]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, !isDark && styles.lightHeaderTitle]}>Featured Projects</Text>
        <Text style={[styles.headerSubtitle, !isDark && styles.lightHeaderSubtitle]}>
          Invest in a sustainable future
        </Text>
      </View>

      <View style={styles.carouselContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.navButtonLeft,
            !isDark && styles.lightNavButton,
            currentIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={() => scrollTo('prev')}
          disabled={currentIndex === 0}>
          <ChevronLeft
            size={24}
            color={currentIndex === 0 ? '#666' : '#00e6b8'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.navButtonRight,
            !isDark && styles.lightNavButton,
            currentIndex === projects.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={() => scrollTo('next')}
          disabled={currentIndex === projects.length - 1}>
          <ChevronRight
            size={24}
            color={currentIndex === projects.length - 1 ? '#666' : '#00e6b8'}
          />
        </TouchableOpacity>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_GAP}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {projects.map((project) => (
            <Animated.View
              key={project.id}
              style={[
                styles.projectCard,
                !isDark && styles.lightProjectCard,
                currentIndex === projects.indexOf(project) && animatedStyle,
              ]}>
              <Image source={{ uri: project.image }} style={styles.projectImage} />

              <ScrollView
                style={styles.projectContentScroll}
                showsVerticalScrollIndicator={false}>
                <View style={styles.projectContent}>
                  <Text style={[styles.projectTitle, !isDark && styles.lightProjectTitle]}>
                    {project.title}
                  </Text>

                  <View style={styles.locationContainer}>
                    <MapPin size={16} color={isDark ? '#666' : '#999'} />
                    <Text style={[styles.locationText, !isDark && styles.lightLocationText]}>
                      {project.location}
                    </Text>
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, !isDark && styles.lightProgressBar]}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${(project.raised / project.goal) * 100}%` },
                        ]}
                      />
                    </View>
                    <View style={styles.progressStats}>
                      <Text style={[styles.progressAmount, !isDark && styles.lightProgressAmount]}>
                        ₹{project.raised.toLocaleString()}
                      </Text>
                      <Text style={[styles.progressTotal, !isDark && styles.lightProgressTotal]}>
                        / ₹{project.goal.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                      <Clock size={16} color={isDark ? '#666' : '#999'} />
                      <Text style={[styles.statText, !isDark && styles.lightStatText]}>
                        {project.daysLeft} days left
                      </Text>
                    </View>
                    <View style={styles.stat}>
                      <Users size={16} color={isDark ? '#666' : '#999'} />
                      <Text style={[styles.statText, !isDark && styles.lightStatText]}>
                        +{project.supporters} others
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.description, !isDark && styles.lightDescription]}>
                    {project.description}
                  </Text>
                </View>
              </ScrollView>

              <View style={styles.investButtonContainer}>
                <TouchableOpacity 
                  style={styles.investButton}
                  onPress={() => handleInvestPress(project)}>
                  <Text style={styles.investButtonText}>Invest Now</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        <View style={styles.pagination}>
          {projects.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                !isDark && styles.lightPaginationDot,
                currentIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
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
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  lightHeaderTitle: {
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  lightHeaderSubtitle: {
    color: '#666',
  },
  carouselContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: CARD_GAP,
    alignItems: 'center',
  },
  projectCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
    }),
  },
  lightProjectCard: {
    backgroundColor: '#ffffff',
  },
  projectImage: {
    width: '100%',
    height: 180,
  },
  projectContentScroll: {
    flex: 1,
  },
  projectContent: {
    padding: 20,
  },
  projectTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  lightProjectTitle: {
    color: '#1a1a1a',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    color: '#666',
    marginLeft: 8,
  },
  lightLocationText: {
    color: '#666',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  lightProgressBar: {
    backgroundColor: '#e0e0e0',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00e6b8',
    borderRadius: 2,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressAmount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lightProgressAmount: {
    color: '#1a1a1a',
  },
  progressTotal: {
    color: '#666',
    fontSize: 16,
  },
  lightProgressTotal: {
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#666',
    marginLeft: 8,
  },
  lightStatText: {
    color: '#666',
  },
  description: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  lightDescription: {
    color: '#666',
  },
  investButtonContainer: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  investButton: {
    backgroundColor: '#00e6b8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  investButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
      },
      default: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
    }),
  },
  navButtonLeft: {
    left: 8,
  },
  navButtonRight: {
    right: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  lightNavButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#444',
  },
  lightPaginationDot: {
    backgroundColor: '#e0e0e0',
  },
  paginationDotActive: {
    backgroundColor: '#00e6b8',
    width: 24,
  },
});