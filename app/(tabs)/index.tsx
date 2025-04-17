import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, Dimensions, Alert, ImageBackground, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

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

  // Animation d'introduction
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
      
      {/* Image d'arrière-plan améliorée */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1517971053567-8bde93bc6a58?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=85' }}
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

          {/* Carte principale avec effet de verre */}
          <Animated.View style={[
            styles.mainCard,
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideUpAnim }] 
            }
          ]}>
            {Platform.OS === 'ios' ? (
              <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
                <View style={styles.cardContent}>
                  {/* Logo et animation du marteau */}
                  <View style={styles.logoBadge}>
                    <Animated.View style={hammerTransform}>
                      <MaterialCommunityIcons name="hammer" size={40} color="#FFD700" />
                    </Animated.View>
                  </View>
                  
                  <Text style={styles.title}>
                    ArtisCo
                  </Text>
                  
                  <Text style={styles.subtitle}>
                    Soutenez les artisans de votre région et trouvez facilement le service dont vous avez besoin
                  </Text>
                </View>
              </BlurView>
            ) : (
              <View style={[styles.blurContainer, styles.androidBlur]}>
                <View style={styles.cardContent}>
                  {/* Logo et animation du marteau */}
                  <View style={styles.logoBadge}>
                    <Animated.View style={hammerTransform}>
                      <MaterialCommunityIcons name="hammer" size={40} color="#FFD700" />
                    </Animated.View>
                  </View>
                  
                  <Text style={styles.title}>
                    ArtisCo
                  </Text>
                  
                  <Text style={styles.subtitle}>
                    Soutenez les artisans de votre région et trouvez facilement le service dont vous avez besoin
                  </Text>
                </View>
              </View>
            )}
          </Animated.View>

          {/* Section des boutons avec nouveau design */}
          <Animated.View style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim },
                { scale: buttonScaleAnim },
              ],
            }
          ]}>
            {/* Bouton d'inscription avec icône */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('./Signup')}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add-outline" size={22} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>

            {/* Séparateur élégant */}
            <View style={styles.orSeparator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>ou</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Bouton de connexion avec icône */}
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => router.push('./Login')}
              activeOpacity={0.8}
            >
              <Ionicons name="log-in-outline" size={22} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer avec informations et mentions légales */}
          <Animated.View
            style={[
              styles.footer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <TouchableOpacity onPress={showAboutPreview} style={styles.footerButton}>
              <Ionicons name="information-circle-outline" size={22} color="white" />
              <Text style={styles.footerText}>À propos</Text>
            </TouchableOpacity>
            
            <View style={styles.footerDivider} />
            
            <TouchableOpacity onPress={() => router.push('./legal')} style={styles.footerButton}>
              <Ionicons name="document-text-outline" size={22} color="white" />
              <Text style={styles.footerText}>Mentions légales</Text>
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
    backgroundColor: 'rgba(0,0,0,0.6)', // Overlay semi-transparent sur l'image
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
  // Carte principale avec effet de verre
  mainCard: {
    width: '100%',
    maxWidth: 450,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  blurContainer: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 16,
  },
  androidBlur: {
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardContent: {
    padding: 25,
    alignItems: 'center',
  },
  logoBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.7)',
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(255,215,0,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '300',
    marginBottom: 5,
  },
  // Container pour les boutons
  buttonContainer: {
    width: '100%',
    maxWidth: 450,
    marginBottom: 40,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4361EE', // Bleu moderne
    marginBottom: 10,
    elevation: 8,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  loginButton: {
    backgroundColor: '#10B981', // Vert moderne
    shadowColor: '#10B981',
  },
  // Séparateur "ou"
  orSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  separatorText: {
    color: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 15,
    fontSize: 14,
  },
  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  footerText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '300',
  },
  footerDivider: {
    height: 15,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 15,
  },
});