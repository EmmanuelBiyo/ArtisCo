import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Profil from './Profil'; // Import du composant Profil depuis son propre fichier

// Création du navigateur à onglets
const Tab = createBottomTabNavigator();

// Composant de l'écran d'accueil amélioré
function HomeScreen() {
  const { width, height } = Dimensions.get('window');
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(-50)).current;
  const subtitleAnim = useRef(new Animated.Value(-30)).current;
  const logoAnim = useRef(new Animated.Value(-30)).current;
  const cardsAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    // Séquence d'animation au chargement
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
          toValue: 0,
          duration: 800,
          delay: 300,
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
  }, []);

  return (
    <ScrollView style={styles.background}>
      <View style={styles.container}>
        {/* Header avec logo et titre */}
        <View style={styles.header}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: logoAnim }],
              },
            ]}
          >
            <View style={styles.logoCircle}>
              <FontAwesome5 name="tools" size={32} color="#F9A826" />
            </View>
            <Text style={styles.logoText}>ArtisCo</Text>
          </Animated.View>
        </View>

        <View style={styles.contentContainer}>
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: fadeAnim,
                transform: [{ translateY: titleAnim }],
              },
            ]}
          >
            Bienvenue sur ArtisCo
          </Animated.Text>
          
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
        </View>

        {/* Section services populaires */}
        <Animated.View 
          style={[
            styles.sectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: cardsAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Services Populaires</Text>
          <View style={styles.servicesGrid}>
            <TouchableOpacity style={styles.serviceCard}>
              <View style={styles.iconCircle}>
                <FontAwesome5 name="hammer" size={24} color="#F9A826" />
              </View>
              <Text style={styles.serviceText}>Bricolage</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceCard}>
              <View style={styles.iconCircle}>
                <FontAwesome5 name="paint-roller" size={24} color="#F9A826" />
              </View>
              <Text style={styles.serviceText}>Peinture</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceCard}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="pipe-wrench" size={24} color="#F9A826" />
              </View>
              <Text style={styles.serviceText}>Plomberie</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.serviceCard}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="lightbulb-on" size={24} color="#F9A826" />
              </View>
              <Text style={styles.serviceText}>Électricité</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Section artisans à proximité */}
        <Animated.View 
          style={[
            styles.sectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: cardsAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Artisans à proximité</Text>
          <View style={styles.artisansContainer}>
            {/* Carte artisan 1 */}
            <TouchableOpacity style={styles.artisanCard}>
              <View style={styles.artisanIconCircle}>
                <FontAwesome5 name="user-tie" size={24} color="#F9A826" />
              </View>
              <View style={styles.artisanInfo}>
                <Text style={styles.artisanName}>Jean Dupont</Text>
                <Text style={styles.artisanJob}>Plombier</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#F9A826" />
                  <Ionicons name="star" size={16} color="#F9A826" />
                  <Ionicons name="star" size={16} color="#F9A826" />
                  <Ionicons name="star" size={16} color="#F9A826" />
                  <Ionicons name="star-half" size={16} color="#F9A826" />
                  <Text style={styles.ratingText}>(4.5)</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Carte artisan 2 */}
            <TouchableOpacity style={styles.artisanCard}>
              <View style={styles.artisanIconCircle}>
                <FontAwesome5 name="user-tie" size={24} color="#F9A826" />
              </View>
              <View style={styles.artisanInfo}>
                <Text style={styles.artisanName}>Marie Kouakou</Text>
                <Text style={styles.artisanJob}>Couturière</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#F9A826" />
                  <Ionicons name="star" size={16} color="#F9A826" />
                  <Ionicons name="star" size={16} color="#F9A826" />
                  <Ionicons name="star" size={16} color="#F9A826" />
                  <Ionicons name="star" size={16} color="#F9A826" />
                  <Text style={styles.ratingText}>(5.0)</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Banner promotionnel */}
        <Animated.View 
          style={[
            styles.bannerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: cardsAnim }],
            }
          ]}
        >
          <View style={styles.banner}>
            <MaterialCommunityIcons name="bell-ring" size={24} color="white" style={styles.bannerIcon} />
            <View>
              <Text style={styles.bannerTitle}>Première prestation -15%</Text>
              <Text style={styles.bannerText}>Utilise le code ARTISCO15 lors de ta première commande</Text>
            </View>
          </View>
        </Animated.View>

        {/* Appel à l'action */}
        <Animated.View 
          style={[
            {
              width: '100%',
              opacity: fadeAnim,
              transform: [{ translateY: cardsAnim }],
              marginBottom: 20,
            }
          ]}
        >
          <TouchableOpacity style={styles.callToAction}>
            <Text style={styles.ctaText}>Trouvez un artisan maintenant</Text>
            <Ionicons name="arrow-forward" size={22} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

// Écran Recherche - inchangé
function Search() {
  return (
    <View style={styles.otherScreens}>
      <Text style={styles.screenTitle}>Recherche</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Services à domicile</Text>
          <Text style={styles.cardDescription}>Trouver des services à domicile tels que le ménage, la plomberie, etc.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Réparations</Text>
          <Text style={styles.cardDescription}>Artisans qualifiés pour vos réparations électroménagers et autres travaux.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Artisanat local</Text>
          <Text style={styles.cardDescription}>Découvrez des artisans locaux pour des produits faits main et personnalisés.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Écran Artisans - inchangé
function Artisans() {
  return (
    <View style={styles.otherScreens}>
      <Text style={styles.screenTitle}>Artisans Disponibles</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Esdras Bakayoko</Text>
          <Text style={styles.cardDescription}>Plombier certifié avec 10 ans d'expérience, disponible pour tous vos travaux.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Orthense Kouassi</Text>
          <Text style={styles.cardDescription}>Couturière professionnelle, spécialisée dans les vêtements sur mesure.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Franck Seka</Text>
          <Text style={styles.cardDescription}>Menuisier passionné, créant des meubles uniques en bois recyclé.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// IMPORTANT: Navigateur à onglets conservé mais utilisant Profil importé
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

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F9A826',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#344955',
        },
        headerStyle: {
          backgroundColor: '#344955',
        },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Recherche" component={Search} />
      <Tab.Screen name="Artisans" component={Artisans} />
      <Tab.Screen name="Profil" component={Profil} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#4A6572',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#344955',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 5,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#F9A826',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    marginLeft: 4,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#344955',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(249, 168, 38, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  artisansContainer: {
    width: '100%',
  },
  artisanCard: {
    width: '100%',
    backgroundColor: '#344955',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  artisanIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(249, 168, 38, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  artisanInfo: {
    flex: 1,
  },
  artisanName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  artisanJob: {
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    color: '#f0f0f0',
    fontSize: 14,
  },
  bannerContainer: {
    width: '100%',
    marginBottom: 24,
  },
  banner: {
    backgroundColor: '#F9A826',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    marginRight: 16,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  bannerText: {
    fontSize: 14,
    color: 'white',
  },
  callToAction: {
    backgroundColor: '#F9A826',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  // Styles pour les autres écrans
  otherScreens: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A6572',
  },
  screenTitle: {
    fontSize: 28,
    color: 'white',
    marginBottom: 20,
  },
  scrollView: {
    width: '90%',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 16,
    marginTop: 10,
    color: '#555',
  }
});