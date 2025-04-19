import React, { useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  Animated, 
  StatusBar,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = Platform.OS === 'ios' ? 110 : 90;
const FEATURE_ITEMS = [
  { 
    icon: 'tool', 
    title: 'Savoir-faire', 
    description: 'Promotion des techniques artisanales ancestrales' 
  },
  { 
    icon: 'map-pin', 
    title: 'Local', 
    description: 'Valorisation des talents de votre région' 
  },
  { 
    icon: 'users', 
    title: 'Communauté', 
    description: 'Mise en relation directe entre artisans et clients' 
  }
];

export default function About() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with blur effect that appears on scroll */}
      <Animated.View style={[styles.headerBlur, { opacity: headerOpacity }]}>
        <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="dark" />
        <View style={styles.headerBlurContent}>
          <Text style={styles.headerBlurTitle}>À propos d'ArtisCo</Text>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero section */}
        <LinearGradient
          colors={['#1E3A5F', '#2A4F80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Animated.View 
            style={[
              styles.heroContent, 
              { 
                opacity: fadeAnim,
                transform: [
                  { scale: titleScale },
                  { translateY: titleTranslateY }
                ]
              }
            ]}
          >
            <Text style={styles.title}>À propos d'ArtisCo</Text>
            <Text style={styles.subtitle}>Revalorisons ensemble l'artisanat local</Text>
            <View style={styles.titleDivider} />
          </Animated.View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          {/* Mission section */}
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <Feather name="target" size={22} color="#1E3A5F" />
              <Text style={styles.sectionTitle}>Notre Mission</Text>
            </View>
            <Text style={styles.descriptionHighlight}>
              Soutenez les artisans de votre région et trouvez facilement le service dont vous avez besoin
            </Text>
            <Text style={styles.description}>
              ArtisCo est une plateforme innovante qui vise à soutenir les artisans locaux en leur offrant une visibilité accrue et en facilitant l'accès aux services qu'ils proposent. Notre mission est de promouvoir le savoir-faire des artisans de votre région et de les aider à atteindre un plus grand public.
            </Text>
          </Animated.View>

          {/* Features section */}
          <View style={styles.featuresContainer}>
            {FEATURE_ITEMS.map((item, index) => (
              <Animated.View 
                key={index} 
                style={[
                  styles.featureCard,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0]
                    })}]
                  }
                ]}
              >
                <View style={styles.featureIconContainer}>
                  <Feather name={item.icon} size={24} color="#2A4F80" />
                </View>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDescription}>{item.description}</Text>
              </Animated.View>
            ))}
          </View>

          {/* Approach section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="compass" size={22} color="#1E3A5F" />
              <Text style={styles.sectionTitle}>Notre Approche</Text>
            </View>
            <Text style={styles.description}>
              En connectant directement les consommateurs aux artisans locaux, ArtisCo favorise une économie circulaire et durable. Que vous cherchiez un plombier, un ébéniste, un peintre ou tout autre artisan, ArtisCo est votre solution pour trouver rapidement un professionnel de confiance.
            </Text>
          </View>

          {/* Testimonial section */}
          <View style={styles.testimonialContainer}>
            <LinearGradient
              colors={['#2A4F80', '#3A6098']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.testimonial}
            >
              <Text style={styles.testimonialText}>
                " Nous croyons qu'ensemble, nous pouvons rendre les services artisanaux plus accessibles et mieux valoriser le savoir-faire local. "
              </Text>
              <Text style={styles.testimonialAuthor}>L'équipe ArtisCo</Text>
            </LinearGradient>
          </View>

          {/* Call to action - Only Retour button */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryButtonText}>Retour</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 100,
    overflow: 'hidden',
  },
  headerBlurContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 15,
  },
  headerBlurTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  hero: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#E0E7FF',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  titleDivider: {
    width: 60,
    height: 4,
    backgroundColor: '#F97316',
    borderRadius: 2,
    marginTop: 20,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E3A5F',
    marginLeft: 10,
  },
  descriptionHighlight: {
    fontSize: 18,
    fontWeight: '500',
    color: '#F97316',
    marginBottom: 12,
    lineHeight: 26,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  featureCard: {
    width: (width - 50) / 3,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EBF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 5,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#667',
    textAlign: 'center',
    lineHeight: 16,
  },
  testimonialContainer: {
    marginBottom: 30,
  },
  testimonial: {
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
  },
  testimonialText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: 'white',
    textAlign: 'center',
    lineHeight: 26,
  },
  testimonialAuthor: {
    fontSize: 14,
    color: '#E0E7FF',
    marginTop: 15,
    fontWeight: '500',
  },
  ctaContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButton: {
    width: '100%',
    padding: 18,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '500',
  },
});