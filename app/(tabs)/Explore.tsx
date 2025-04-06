import React, { useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  Animated, 
  Dimensions 
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const Explore = () => {
  const router = useRouter();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(50)).current;
  const titleAnim = useRef(new Animated.Value(-30)).current;
  const subtitleAnim = useRef(new Animated.Value(-20)).current;
  const buttonAnim = useRef(new Animated.Value(30)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  
  // Animation pour le bouton
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation séquentielle au chargement
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(cardAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(titleAnim, {
          toValue: 0,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleAnim, {
          toValue: 0,
          duration: 700,
          delay: 400,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 0,
          duration: 700,
          delay: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    // Animation pulsante pour l'icône
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(iconAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animations pour le bouton
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 5,
      tension: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  // Animation de l'icône
  const iconScale = iconAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <View style={styles.container}>
      {/* Fond coloré au lieu de LinearGradient */}
      <View style={styles.overlayBackground} />
      
      <Animated.View 
        style={[
          styles.contentContainer, 
          { opacity: fadeAnim }
        ]}
      >
        <Animated.View 
          style={[
            styles.iconContainer,
            {
              transform: [
                { scale: iconScale }
              ]
            }
          ]}
        >
          <Ionicons name="compass" size={60} color="#fff" />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.card,
            {
              transform: [
                { translateY: cardAnim }
              ]
            }
          ]}
        >
          <Animated.Text 
            style={[
              styles.title,
              {
                transform: [
                  { translateY: titleAnim }
                ]
              }
            ]}
          >
            Explorez l'artisanat
          </Animated.Text>
          
          <Animated.Text 
            style={[
              styles.subtitle,
              {
                transform: [
                  { translateY: subtitleAnim }
                ]
              }
            ]}
          >
            Inscrivez-vous pour découvrir les meilleures offres et créations 
            artisanales spécialement sélectionnées pour vous.
          </Animated.Text>
          
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                transform: [
                  { translateY: buttonAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/Signup')}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Ionicons name="person-add" size={22} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Rejoignez notre communauté d'artisans et de passionnés
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff7e5f",
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ff5733",
    opacity: 0.8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
    padding: 15,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ff5733",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 126, 95, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: "#444",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff5733",
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#ff7e5f",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});

export default Explore;