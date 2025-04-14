import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, View, Dimensions, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Profil from './Profil';
import search from './search';
import Artisans from './Artisans';

// Création du navigateur à onglets
const Tab = createBottomTabNavigator();

// Composant de l'écran d'accueil
function HomeScreen() {
  const { width, height } = Dimensions.get('window');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(-50)).current;
  const subtitleAnim = useRef(new Animated.Value(-30)).current;
  const logoAnim = useRef(new Animated.Value(0)).current; // Pour la rotation
  const cardsAnim = useRef(new Animated.Value(100)).current;
  const bannerPulse = useRef(new Animated.Value(1)).current; // Pour l'effet de pulsation
  const ctaBounce = useRef(new Animated.Value(1)).current; // Pour l'effet de rebond

  useEffect(() => {
    // Animation de pulsation pour la bannière
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bannerPulse, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bannerPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Animation de rebond pour le CTA
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(ctaBounce, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(ctaBounce, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    // Séquence d'animation principale
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(titleAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleAnim, {
          toValue: 0,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnim, {
          toValue: 360, // Rotation complète
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(cardsAnim, {
          toValue: 0,
          duration: 1000,
          delay: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Lancer les animations de pulsation et de rebond
    pulseAnimation.start();
    bounceAnimation.start();

    return () => {
      pulseAnimation.stop();
      bounceAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header avec logo et barre de recherche rapide */}
          <View style={styles.header}>
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      rotate: logoAnim.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.logoCircle}>
                <FontAwesome5 name="tools" size={32} color="#fff" />
              </View>
              <Text style={styles.logoText}>ArtisCo</Text>
            </Animated.View>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#7F8C8D" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un service..."
                placeholderTextColor="#7F8C8D"
              />
            </View>
          </View>

          {/* Bandeau d'introduction */}
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: titleAnim }],
              },
            ]}
          >
            <Text style={styles.title}>Bienvenue sur ArtisCo</Text>
            <Animated.Text
              style={[
                styles.subtitle,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: subtitleAnim }],
                },
              ]}
            >
              Soutenez les artisans de votre région et trouvez facilement le service dont vous avez besoin.
            </Animated.Text>
          </Animated.View>

          {/* Section services populaires (carrousel horizontal) */}
          <Animated.View
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: cardsAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Services Populaires</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.servicesCarousel}
            >
              {/* Menuiserie */}
              <Animated.View style={{ transform: [{ translateX: cardsAnim }] }}>
                <TouchableOpacity style={styles.serviceCard}>
                  <View style={styles.iconCircle}>
                    <FontAwesome5 name="tools" size={24} color="#DAA520" />
                  </View>
                  <Text style={styles.serviceText}>Menuiserie</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Couture */}
              <Animated.View style={{ transform: [{ translateX: cardsAnim }] }}>
                <TouchableOpacity style={styles.serviceCard}>
                  <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="needle" size={24} color="#DAA520" />
                  </View>
                  <Text style={styles.serviceText}>Couture</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Plomberie */}
              <Animated.View style={{ transform: [{ translateX: cardsAnim }] }}>
                <TouchableOpacity style={styles.serviceCard}>
                  <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="pipe-wrench" size={24} color="#DAA520" />
                  </View>
                  <Text style={styles.serviceText}>Plomberie</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Tisserands */}
              <Animated.View style={{ transform: [{ translateX: cardsAnim }] }}>
                <TouchableOpacity style={styles.serviceCard}>
                  <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="tools" size={24} color="#DAA520" />
                  </View>
                  <Text style={styles.serviceText}>Tisserands</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Maçons */}
              <Animated.View style={{ transform: [{ translateX: cardsAnim }] }}>
                <TouchableOpacity style={styles.serviceCard}>
                  <View style={styles.iconCircle}>
                    <FontAwesome5 name="hammer" size={24} color="#DAA520" />
                  </View>
                  <Text style={styles.serviceText}>Maçons</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Électriciens */}
              <Animated.View style={{ transform: [{ translateX: cardsAnim }] }}>
                <TouchableOpacity style={styles.serviceCard}>
                  <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="lightbulb-on" size={24} color="#DAA520" />
                  </View>
                  <Text style={styles.serviceText}>Électriciens</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Peinture */}
              <Animated.View style={{ transform: [{ translateX: cardsAnim }] }}>
                <TouchableOpacity style={styles.serviceCard}>
                  <View style={styles.iconCircle}>
                    <FontAwesome5 name="paint-roller" size={24} color="#DAA520" />
                  </View>
                  <Text style={styles.serviceText}>Peinture</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Bricolage */}
              <Animated.View style={{ transform: [{ translateX: cardsAnim }] }}>
                <TouchableOpacity style={styles.serviceCard}>
                  <View style={styles.iconCircle}>
                    <FontAwesome5 name="hammer" size={24} color="#DAA520" />
                  </View>
                  <Text style={styles.serviceText}>Bricolage</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Poterie */}
              <Animated.View style={{ transform: [{ translateX: cardsAnim }] }}>
                <TouchableOpacity style={styles.serviceCard}>
                  <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="pot" size={24} color="#DAA520" />
                  </View>
                  <Text style={styles.serviceText}>Poterie</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Vannerie */}
              <Animated.View style={{ transform: [{ translateX: cardsAnim }] }}>
                <TouchableOpacity style={styles.serviceCard}>
                  <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="basket" size={24} color="#DAA520" />
                  </View>
                  <Text style={styles.serviceText}>Vannerie</Text>
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </Animated.View>

          {/* Section artisans à proximité */}
          <Animated.View
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: cardsAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Artisans à proximité</Text>
            <View style={styles.artisansContainer}>
              <TouchableOpacity style={styles.artisanCard}>
                <View style={styles.artisanIconCircle}>
                  <FontAwesome5 name="user-tie" size={30} color="#fff" />
                </View>
                <View style={styles.artisanInfo}>
                  <Text style={styles.artisanName}>Digbeu Franck</Text>
                  <Text style={styles.artisanJob}>Plombier</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#DAA520" />
                    <Ionicons name="star" size={16} color="#DAA520" />
                    <Ionicons name="star" size={16} color="#DAA520" />
                    <Ionicons name="star" size={16} color="#DAA520" />
                    <Ionicons name="star-half" size={16} color="#DAA520" />
                    <Text style={styles.ratingText}>(4.5)</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.artisanCard}>
                <View style={styles.artisanIconCircle}>
                  <FontAwesome5 name="user-tie" size={30} color="#fff" />
                </View>
                <View style={styles.artisanInfo}>
                  <Text style={styles.artisanName}>Marie Kouakou</Text>
                  <Text style={styles.artisanJob}>Couturière</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#DAA520" />
                    <Ionicons name="star" size={16} color="#DAA520" />
                    <Ionicons name="star" size={16} color="#DAA520" />
                    <Ionicons name="star" size={16} color="#DAA520" />
                    <Ionicons name="star" size={16} color="#DAA520" />
                    <Text style={styles.ratingText}>(5.0)</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Banner promotionnel avec effet de pulsation */}
          <Animated.View
            style={[
              styles.bannerContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: bannerPulse }],
              },
            ]}
          >
            <View style={styles.banner}>
              <MaterialCommunityIcons name="bell-ring" size={24} color="#fff" style={styles.bannerIcon} />
              <View>
                <Text style={styles.bannerTitle}>Première prestation -15%</Text>
                <Text style={styles.bannerText}>Utilise le code ARTISCO15 lors de ta première commande</Text>
              </View>
            </View>
          </Animated.View>

          {/* Appel à l'action avec effet de rebond */}
          <Animated.View
            style={[
              {
                width: '100%',
                opacity: fadeAnim,
                transform: [{ scale: ctaBounce }],
                marginBottom: 20,
              },
            ]}
          >
            <TouchableOpacity style={styles.callToAction}>
              <Text style={styles.ctaText}>Trouvez un artisan maintenant !</Text>
              <Ionicons name="arrow-forward" size={22} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

// Navigateur à onglets avec un design amélioré
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Accueil') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Recherche') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Artisans') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // Ajout d'une animation de mise à l'échelle pour l'icône active
          const scaleAnim = useRef(new Animated.Value(focused ? 1.2 : 1)).current;

          useEffect(() => {
            Animated.spring(scaleAnim, {
              toValue: focused ? 1.2 : 1,
              friction: 5,
              useNativeDriver: true,
            }).start();
          }, [focused]);

          return (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons name={iconName} size={size} color={color} />
            </Animated.View>
          );
        },
        tabBarActiveTintColor: '#FFD700', // Couleur active : doré
        tabBarInactiveTintColor: 'vert', // Couleur inactive : bleu doux
        tabBarStyle: {
          backgroundColor: '#1A3C34', // Fond principal : vert profond
          borderTopWidth: 0, // Supprimer la bordure supérieure
          elevation: 10, // Ombre plus prononcée sur Android
          shadowColor: '#000', // Ombre pour iOS
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          paddingVertical: 5, // Espacement vertical pour plus d'espace
        },
        tabBarBackground: () => (
          // Créer un dégradé pour le fond (simulé avec une superposition de couleurs)
          <View
            style={{
              backgroundColor: 'white',
              height: '100%',
              borderTopWidth: 0,
              borderTopColor: '#2D5A4E', // Légère transition de couleur
            }}
          />
        ),
        tabBarIconStyle: {
          marginVertical: 1, // Espacement pour les icônes
        },
        tabBarLabelStyle: {
          fontSize: 12, // Taille de la police des labels
          fontWeight: '600',
          marginBottom: 5,
        },
        headerStyle: {
          backgroundColor: '#1A3C34', // Changement de la couleur du header pour correspondre au thème
        },
        headerTintColor: '#fff',
      })}
    >
  
  <Tab.Screen
    name="Accueil"
    component={HomeScreen}
    options={{ headerShown: false }}
  />
  <Tab.Screen
    name="Recherche"
    component={search}
    options={{ tabBarLabel: 'Recherche', headerShown: false }} // Ajout du label
  />
  <Tab.Screen
    name="Artisans"
    component={Artisans}
    options={{ tabBarLabel: 'Artisans', headerShown: false }} // Ajout du label
  />
  <Tab.Screen
    name="Profil"
    component={Profil}
    options={{ tabBarLabel: 'Profil', headerShown: false }} // Ajout du label
  />
</Tab.Navigator>
  );
}

// Styles détaillés pour un rendu moderne et créatif
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F4F7FA', // Fond plus doux et moderne
  },
  scrollContainer: {
    paddingBottom: 60,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A3C34', // Couleur verte foncée pour un look naturel
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 3,
    borderColor: '#FFD700', // Bordure dorée
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A3C34',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#F0F2F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A3C34',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 12,
    color: '#1A3C34',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A3C34',
    marginBottom: 16,
    marginLeft: 4,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  servicesCarousel: {
    paddingHorizontal: 5,
  },
  serviceCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A3C34',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  artisansContainer: {
    width: '100%',
  },
  artisanCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  artisanIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A3C34',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  artisanInfo: {
    flex: 1,
  },
  artisanName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A3C34',
    marginBottom: 4,
  },
  artisanJob: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 6,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '400',
  },
  bannerContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  banner: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A3C34',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerIcon: {
    marginRight: 16,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#E5E7EB',
  },
  callToAction: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D97706', // Couleur ambre vibrante
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginRight: 10,
  },
});