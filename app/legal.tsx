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

const LEGAL_SECTIONS = [
  {
    icon: 'info',
    title: 'Éditeur du site',
    content: `ArtisCo SAS
Capital social : 10 000 €
Siège social : 123 Avenue de l'Artisanat, 75001 Abidjan
RCS Abidjan : 123 456 789
SIRET : 123 456 789 00012
TVA intracommunautaire : FR12123456789

Directeur de la publication : BIYO EMMANUEL
Contact : contact@artisco.fr
Téléphone : +225 05 99 70 17 61`
  },
  {
    icon: 'server',
    title: 'Hébergement',
    content: `Le site ArtisCo est hébergé par :
OVH SAS
2 rue Remblais
59100 Cocody - Côte d'Ivoire
Téléphone : +225 05 99 70 17 61`
  },
  {
    icon: 'shield',
    title: 'Données personnelles',
    content: `Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.

Pour exercer ces droits, contactez-nous à : dpo@artisco.fr

Responsable du traitement : ArtisCo SAS
Finalité : Mise en relation entre artisans et clients
Durée de conservation : 3 ans après la dernière activité`
  },
  {
    icon: 'eye',
    title: 'Propriété intellectuelle',
    content: `L'ensemble du contenu du site ArtisCo (textes, images, vidéos, logos, etc.) est protégé par le droit d'auteur et appartient à ArtisCo ou à ses partenaires.

Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site est interdite sans autorisation préalable écrite.`
  },
  {
    icon: 'alert-triangle',
    title: 'Responsabilité',
    content: `ArtisCo s'efforce de fournir des informations exactes et à jour. Cependant, nous ne garantissons pas l'exactitude, la complétude ou l'actualité des informations diffusées sur le site.

ArtisCo ne pourra être tenue responsable des dommages directs ou indirects causés au matériel de l'utilisateur lors de l'accès au site.`
  },
  {
    icon: 'file-text',
    title: 'Conditions d\'utilisation',
    content: `L'utilisation du site ArtisCo implique l'acceptation pleine et entière des conditions générales d'utilisation décrites ci-dessous.

L'utilisateur s'engage à utiliser le site conformément à sa destination et de manière loyale. Tout usage abusif ou frauduleux est strictement interdit.`
  }
];

export default function Legal() {
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
          <Text style={styles.headerBlurTitle}>Mentions Légales</Text>
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
            <Text style={styles.title}>Mentions Légales</Text>
            <Text style={styles.subtitle}>Informations légales et réglementaires</Text>
            <View style={styles.titleDivider} />
          </Animated.View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          {/* Introduction */}
          <Animated.View style={[styles.introSection, { opacity: fadeAnim }]}>
            <Text style={styles.introText}>
              Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la confiance en l'économie numérique, nous vous informons des mentions légales relatives au site ArtisCo.
            </Text>
          </Animated.View>

          {/* Legal sections */}
          {LEGAL_SECTIONS.map((section, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.section,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                  })}]
                }
              ]}
            >
              <View style={styles.sectionHeader}>
                <Feather name={section.icon} size={22} color="#1E3A5F" />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </Animated.View>
          ))}

          {/* Contact section */}
          <View style={styles.contactContainer}>
            <LinearGradient
              colors={['#2A4F80', '#3A6098']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.contactSection}
            >
              <View style={styles.contactHeader}>
                <Feather name="mail" size={24} color="white" />
                <Text style={styles.contactTitle}>Une question ?</Text>
              </View>
              <Text style={styles.contactText}>
                Pour toute question concernant ces mentions légales ou vos données personnelles, n'hésitez pas à nous contacter.
              </Text>
              <Text style={styles.contactEmail}>contact@artisco.fr</Text>
            </LinearGradient>
          </View>

          {/* Last update */}
          <View style={styles.updateSection}>
            <Text style={styles.updateText}>
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </Text>
          </View>

          {/* Call to action - Back button */}
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
    height: height * 0.3,
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
  introSection: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
  },
  introText: {
    fontSize: 16,
    color: '#1E3A5F',
    lineHeight: 24,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
    marginLeft: 10,
  },
  sectionContent: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  contactContainer: {
    marginBottom: 25,
  },
  contactSection: {
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginLeft: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 15,
  },
  contactEmail: {
    fontSize: 18,
    color: '#F97316',
    fontWeight: '600',
    textAlign: 'center',
  },
  updateSection: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    alignItems: 'center',
  },
  updateText: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
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