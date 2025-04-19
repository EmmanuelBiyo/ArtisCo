import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// Utilisation de la même palette de couleurs que dans le composant Artisans
const LuxuryColors = {
  light: {
    gold: '#D4AF37',
    lightGold: '#F4E9CD',
    darkGold: '#A58123',
    ivory: '#FFFFF0',
    cream: '#FFFDD0',
    charcoal: '#36454F',
    deepBlue: '#1A237E',
    offWhite: '#FAF9F6',
    champagne: '#F7E7CE',
    background: '#FAF9F6',
    card: '#FFFFFF',
  },
  dark: {
    gold: '#D4AF37',
    lightGold: '#F4E9CD',
    darkGold: '#A58123',
    ivory: '#FFFFF0',
    cream: '#FFFDD0',
    charcoal: '#E0E0E0',
    deepBlue: '#3F51B5',
    offWhite: '#2D2D2D',
    champagne: '#F7E7CE',
    background: '#1C2526',
    card: '#2A3439',
  },
};

export default function SignUpArtisan() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    specialty: '',
    password: '',
    confirmPassword: '',
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colors = isDarkMode ? LuxuryColors.dark : LuxuryColors.light;

  // Gestion des changements dans les champs de saisie
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Composant bouton animé
  const AnimatedButton = ({ onPress, children, style }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Animated.View entering={FadeInDown.duration(600)} style={style}>
          {children}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = () => {
    const { fullName, email, phone, location, specialty, password, confirmPassword } = formData;
    // Validation simple
    if (!fullName || !email || !phone || !location || !specialty || !password || !confirmPassword) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    // Naviguer vers Artisans avec userRole = 'artisan'
    router.push({
      pathname: '/Artisans',
      params: { userRole: 'artisan' },
    });
  };

  return (
    <View style={[styles.backgroundImage, { backgroundColor: colors.charcoal }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
        style={styles.overlay}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View entering={FadeInUp.duration(600)}>
            <BlurView intensity={85} tint="dark" style={styles.blurCard}>
              {/* En-tête */}
              <View style={styles.headerSection}>
                <MaterialCommunityIcons name="hammer-wrench" size={45} color={colors.gold} />
                <Text style={[styles.sectionTitle, { color: colors.ivory }]}>
                  Inscription Artisan
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.lightGold }]}>
                  Rejoignez la communauté ARTISCO
                </Text>
              </View>

              {/* Formulaire */}
              <View style={styles.formContainer}>
                <Animated.View entering={FadeInDown.duration(600).delay(100)}>
                  <Text style={[styles.label, { color: colors.ivory }]}>Nom complet</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, color: colors.charcoal }]}
                    value={formData.fullName}
                    onChangeText={(text) => handleInputChange('fullName', text)}
                    placeholder="Entrez votre nom"
                    placeholderTextColor={colors.charcoal + '80'}
                  />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(200)}>
                  <Text style={[styles.label, { color: colors.ivory }]}>Email</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, color: colors.charcoal }]}
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    placeholder="Entrez votre email"
                    placeholderTextColor={colors.charcoal + '80'}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(300)}>
                  <Text style={[styles.label, { color: colors.ivory }]}>Téléphone</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, color: colors.charcoal }]}
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange('phone', text)}
                    placeholder="Entrez votre numéro"
                    placeholderTextColor={colors.charcoal + '80'}
                    keyboardType="phone-pad"
                  />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(400)}>
                  <Text style={[styles.label, { color: colors.ivory }]}>Localisation</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, color: colors.charcoal }]}
                    value={formData.location}
                    onChangeText={(text) => handleInputChange('location', text)}
                    placeholder="Entrez votre ville"
                    placeholderTextColor={colors.charcoal + '80'}
                  />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(500)}>
                  <Text style={[styles.label, { color: colors.ivory }]}>Spécialité</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, color: colors.charcoal }]}
                    value={formData.specialty}
                    onChangeText={(text) => handleInputChange('specialty', text)}
                    placeholder="Ex: Menuisier, Ébéniste"
                    placeholderTextColor={colors.charcoal + '80'}
                  />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(600)}>
                  <Text style={[styles.label, { color: colors.ivory }]}>Mot de passe</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, color: colors.charcoal }]}
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    placeholder="Entrez votre mot de passe"
                    placeholderTextColor={colors.charcoal + '80'}
                    secureTextEntry
                  />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(700)}>
                  <Text style={[styles.label, { color: colors.ivory }]}>Confirmer le mot de passe</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, color: colors.charcoal }]}
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    placeholder="Confirmez votre mot de passe"
                    placeholderTextColor={colors.charcoal + '80'}
                    secureTextEntry
                  />
                </Animated.View>
              </View>

              {/* Bouton de soumission */}
              <AnimatedButton
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <LinearGradient
                  colors={[colors.gold, colors.darkGold]}
                  style={styles.submitButtonGradient}
                >
                  <Text style={[styles.submitButtonText, { color: colors.ivory }]}>
                    Créer mon compte
                  </Text>
                </LinearGradient>
              </AnimatedButton>

              {/* Bouton de retour */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/Artisans')}
              >
                <Text style={[styles.backButtonText, { color: 'rgba(255,255,255,0.7)' }]}>
                  Retour à l'accueil
                </Text>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>

          {/* Footer */}
          <Text style={[styles.footerText, { color: 'rgba(255,255,255,0.7)' }]}>
            © 2025 ARTISCO • L'excellence artisanale
          </Text>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  blurCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 25,
    padding: 35,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 10,
    letterSpacing: 1.5,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginTop: 5,
    letterSpacing: 1,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  submitButton: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 30,
    marginBottom: 15,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 30,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  backButton: {
    marginTop: 15,
  },
  backButtonText: {
    fontSize: 14,
  },
  footerText: {
    fontSize: 12,
    marginTop: 20,
  },
});