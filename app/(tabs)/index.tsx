import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, Dimensions, Alert, ImageBackground, StatusBar, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  // Animations principales
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.9)).current;
  const hammerRotation = useRef(new Animated.Value(0)).current;
  // Animation d'intro
  const introOverlayOpacity = useRef(new Animated.Value(1)).current;
  const introTextScale = useRef(new Animated.Value(0.5)).current;
  const introTextOpacity = useRef(new Animated.Value(0)).current;
  // État pour suivre si l'animation d'intro est terminée
  const [introCompleted, setIntroCompleted] = useState(false);

  // Animation du marteau qui tape continuellement
  useEffect(() => {
    const startHammerAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(hammerRotation, {
            toValue: -0.25,
            duration: 600,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(hammerRotation, {
            toValue: 0,
            duration: 600,
            easing: Easing.elastic(1),
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 } // Boucle infinie
      ).start();
    };

    if (introCompleted) {
      startHammerAnimation();
    }
  }, [introCompleted]);

  // Animation d'introduction sérieuse
  useEffect(() => {
    // Séquence d'animation d'introduction
    const runIntroAnimation = () => {
      Animated.sequence([
        // Afficher le texte d'intro avec un scale et fade-in
        Animated.parallel([
          Animated.timing(introTextOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(introTextScale, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
        ]),
        // Maintenir le texte à l'écran pendant un moment
        Animated.delay(1500),
        // Faire disparaître le texte
        Animated.timing(introTextOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        // Faire disparaître l'overlay
        Animated.timing(introOverlayOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Une fois l'animation d'intro terminée, lancer les animations principales
        setIntroCompleted(true);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(slideUpAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(buttonScaleAnim, {
            toValue: 1,
            duration: 800,
            delay: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    };

    runIntroAnimation();
  }, []);

  // Afficher un aperçu avant de naviguer vers About
  const showAboutPreview = () => {
    Alert.alert(
      "À propos d'ArtisCo",
      "Notre mission est de connecter les artisans locaux avec les clients à la recherche de services de qualité. Créé en 2025, ArtisCo est votre plateforme de référence pour soutenir l'économie locale.",
      [
        { 
          text: "En savoir plus", 
          onPress: () => router.push('./About'),
          style: "default"
        },
        {
          text: "Fermer",
          style: "cancel"
        }
      ]
    );
  };

  // Transformation pour l'animation du marteau
  const hammerTransform = {
    transform: [
      {
        rotate: hammerRotation.interpolate({
          inputRange: [-0.25, 0],
          outputRange: ['-0.25rad', '0rad'],
        }),
      },
    ],
  };

  return (
    <View style={styles.fullScreenContainer}>
      {/* Rendre la barre de statut transparente */}
      <StatusBar 
        translucent={true} 
        backgroundColor="transparent" 
        barStyle="light-content" 
      />
      
      {/* Image d'arrière-plan */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          {/* Animation d'introduction */}
          <Animated.View 
            style={[
              styles.introOverlay,
              { opacity: introOverlayOpacity }
            ]}
            pointerEvents={introCompleted ? 'none' : 'auto'}
          >
            <Animated.View style={{
              opacity: introTextOpacity,
              transform: [{ scale: introTextScale }]
            }}>
              <Text style={styles.introText}>ArtisCo</Text>
              <Text style={styles.introSubtext}>L'artisanat à portée de main</Text>
            </Animated.View>
          </Animated.View>

          {/* Effet de particules en arrière-plan */}
          <View style={styles.particlesContainer}>
            {[...Array(15)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.particle,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Math.random() * 0.5 + 0.1],
                    }),
                    transform: [
                      { translateY: Animated.multiply(slideUpAnim, Math.random() * -1 - 0.5) },
                    ],
                  },
                ]}
              />
            ))}
          </View>

          {/* Animation du logo et du marteau */}
          <Animated.View
            style={[
              styles.iconContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
            ]}
          >
            <Animated.View style={hammerTransform}>
              <MaterialCommunityIcons name="hammer" size={60} color="#FFD700" />
            </Animated.View>
          </Animated.View>

          {/* Titre avec animation */}
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            Bienvenue sur ArtisCo
          </Animated.Text>

          {/* Sous-titre avec animation */}
          <Animated.Text
            style={[
              styles.subtitle,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            Soutenez les artisans de votre région et trouvez facilement le service dont vous avez besoin
          </Animated.Text>

          {/* Bouton d'inscription avec animation */}
          <Animated.View
            style={{
              width: '80%',
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim },
                { scale: buttonScaleAnim },
              ],
            }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('./Signup')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Bouton de connexion avec animation */}
          <Animated.View
            style={{
              width: '80%',
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim },
                { scale: buttonScaleAnim },
              ],
            }}
          >
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => router.push('./Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Icône d'information avec effet pulse */}
          <Animated.View
            style={[
              styles.infoIcon,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <TouchableOpacity onPress={showAboutPreview}>
              <MaterialCommunityIcons name="information" size={30} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    width: '100%', 
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)', // Overlay semi-transparent sur l'image
    paddingTop: 0, // S'assurer qu'il n'y a pas de padding supplémentaire en haut
    paddingBottom: 0, // S'assurer qu'il n'y a pas de padding supplémentaire en bas
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  // Styles pour l'animation d'introduction
  introOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Fond d'intro noir
    zIndex: 1000,
  },
  introText: {
    color: '#FFD700',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(255,215,0,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  introSubtext: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 1,
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#FFD700',
  },
  iconContainer: {
    marginBottom: 30,
    padding: 18,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    elevation: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    textShadowColor: 'rgba(255,215,0,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
    lineHeight: 22,
    fontWeight: '300',
  },
  button: {
    width: '100%',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#0000FF', // Bleu pur pour le bouton S'inscrire
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#0000FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  loginButton: {
    backgroundColor: 'green',
    shadowColor: '#28A745',
  },
  infoIcon: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 50,
    padding: 12,
    elevation: 5,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});