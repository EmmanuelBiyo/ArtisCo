import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, StatusBar, Platform, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withSequence,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Palette de couleurs sophistiquée - nuances vertes et nature
const AppColors = {
  primary: '#2E7D32', // Vert profond
  primaryLight: '#E8F5E8', // Vert très pâle
  primaryDark: '#1B5E20', // Vert très foncé
  secondary: '#1E1E24', // Noir élégant
  accent: '#4CAF50', // Vert éclatant
  accentLight: '#81C784', // Vert clair
  white: '#FFFFFF',
  offWhite: '#F9F9F9',
  lightGray: '#F2F2F2',
  mediumGray: '#81818A',
  darkText: '#212121',
  gradient: {
    primary: ['#A5D6A7', '#4CAF50', '#2E7D32'],
    secondary: ['#2E2E36', '#1E1E24'],
    accent: ['#C8E6C9', '#81C784']
  },
  success: '#4CAF50',
  statusActive: '#66BB6A'
};

// Polices élégantes
const Fonts = {
  light: 'Inter-Light',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

const { width } = Dimensions.get('window');

export default function Profile() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const insets = useSafeAreaInsets();
  const [image, setImage] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [showBlurHeader, setShowBlurHeader] = useState(false);
  const [userStats, setUserStats] = useState({
    orders: 12,
    reviews: 8,
    points: 560
  });
  
  // Animation values
  const photoScale = useSharedValue(0.8);
  const imageOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.97);
  const headerHeight = useSharedValue(Platform.OS === 'ios' ? 90 + insets.top : 90);
  const badgeScale = useSharedValue(1);
  
  useEffect(() => {
    // Request permissions
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Accès à la galerie nécessaire pour changer la photo de profil.');
      }
    })();
    
    // Trigger initial animations
    photoScale.value = withSpring(1, { damping: 12, stiffness: 90 });
    imageOpacity.value = withTiming(1, { duration: 600 });
    cardScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    
    // Simulate badge notification with pulse animation
    setTimeout(() => {
      animateBadge();
    }, 1500);
  }, []);
  
  const animateBadge = () => {
    badgeScale.value = withSequence(
      withTiming(1.25, { duration: 300 }),
      withTiming(1, { duration: 300 }),
      withTiming(1.25, { duration: 300 }),
      withTiming(1, { duration: 300 })
    );
  };

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(currentScrollY);
    
    // Show blur header when scrolling down
    if (currentScrollY > 60 && !showBlurHeader) {
      runOnJS(setShowBlurHeader)(true);
    } else if (currentScrollY <= 60 && showBlurHeader) {
      runOnJS(setShowBlurHeader)(false);
    }
    
    // Animate header height
    const targetHeight = Math.max(
      Platform.OS === 'ios' ? 60 + insets.top : 60,
      Platform.OS === 'ios' ? 90 + insets.top - currentScrollY * 0.5 : 90 - currentScrollY * 0.5
    );
    
    headerHeight.value = withTiming(targetHeight, { duration: 120 });
  };

  const pickImage = async () => {
    photoScale.value = withSequence(
      withTiming(0.95, { duration: 150 }),
      withTiming(1, { duration: 300 })
    );
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      // Animate image change
      imageOpacity.value = withSequence(
        withTiming(0, { duration: 150 }),
        withTiming(1, { duration: 450 })
      );
      
      setImage(result.assets[0].uri);
    }
  };

  const logout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: () => {
            // Animation avant la déconnexion
            cardScale.value = withTiming(0.95, { duration: 300 });
            imageOpacity.value = withTiming(0, { duration: 400 });
            
            // Simuler la déconnexion après animation
            setTimeout(() => {
              Alert.alert('Déconnecté', 'Vous avez été déconnecté avec succès.');
              // router.replace('/(types)/Login'); // Redirection vers la page de connexion
            }, 500);
          } 
        }
      ]
    );
  };

  // Animated styles
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    height: headerHeight.value,
  }));
  
  const animatedPhotoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: photoScale.value }],
    opacity: imageOpacity.value,
  }));

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: interpolate(
      cardScale.value,
      [0.97, 1],
      [0.7, 1],
      Extrapolate.CLAMP
    ),
  }));
  
  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Dynamic Header with Gradient */}
      <Animated.View style={[styles.headerContainer, animatedHeaderStyle]}>
        <LinearGradient
          colors={AppColors.gradient.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : 12 }]}
        >
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color={AppColors.darkText} />
          </TouchableOpacity>
          
          {!showBlurHeader && (
            <Text style={styles.headerTitle}>Mon Profil</Text>
          )}
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.headerIconButton} 
              onPress={() => router.push('/notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color={AppColors.darkText} />
              <Animated.View style={[styles.notificationBadge, animatedBadgeStyle]}>
                <Text style={styles.badgeText}>2</Text>
              </Animated.View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerIconButton} 
              onPress={() => router.push('/settings')}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={22} color={AppColors.darkText} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
      
      {/* Blur Header on Scroll */}
      {showBlurHeader && (
        <BlurView
          intensity={80}
          tint="light"
          style={[
            styles.blurHeader,
            { height: Platform.OS === 'ios' ? 60 + insets.top : 60, paddingTop: Platform.OS === 'ios' ? insets.top : 0 }
          ]}
        >
          <Text style={styles.blurHeaderTitle}>DIGBEU Franck</Text>
        </BlurView>
      )}
      
      <ScrollView 
        ref={scrollRef}
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Profile Photo Section */}
        <Animated.View style={[styles.photoSection, animatedPhotoStyle]} entering={FadeIn.duration(600)}>
          <TouchableOpacity 
            onPress={pickImage} 
            style={styles.photoContainer}
            activeOpacity={0.9}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <LinearGradient
                colors={AppColors.gradient.accent}
                style={styles.placeholderImageGradient}
              >
                <View style={styles.placeholderImage}>
                  <Text style={styles.initials}>JD</Text>
                </View>
              </LinearGradient>
            )}
            <View style={styles.cameraIconContainer}>
              <MaterialIcons name="photo-camera" size={16} color={AppColors.white} />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.username}>DIGBEU Franck</Text>
          
          <View style={styles.userStatusContainer}>
            <View style={styles.statusIndicator} />
            <Text style={styles.userStatus}>Actif</Text>
          </View>
          
          <View style={styles.memberSince}>
            <MaterialCommunityIcons name="account-check" size={14} color={AppColors.mediumGray} />
            <Text style={styles.memberText}>Membre depuis Avril 2023</Text>
          </View>
          
          {/* User Stats */}
          <Animated.View 
            style={styles.statsContainer}
            entering={FadeInDown.delay(300).duration(600)}
          >
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.orders}</Text>
              <Text style={styles.statLabel}>Commandes</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.reviews}</Text>
              <Text style={styles.statLabel}>Avis</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={styles.pointsRow}>
                <Text style={styles.statNumber}>{userStats.points}</Text>
                <MaterialCommunityIcons name="star" size={14} color={AppColors.primary} style={styles.pointStar} />
              </View>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </Animated.View>
        </Animated.View>
        
        {/* Info Cards */}
        <Animated.View 
          style={[styles.infoCard, animatedCardStyle]} 
          entering={FadeInDown.delay(400).duration(500)}
        >
          <View style={styles.sectionTitle}>
            <LinearGradient
              colors={AppColors.gradient.accent}
              style={styles.iconBackground}
            >
              <MaterialIcons name="person-outline" size={18} color={AppColors.darkText} />
            </LinearGradient>
            <Text style={styles.sectionTitleText}>Informations Personnelles</Text>
            <TouchableOpacity 
              style={styles.sectionEditButton}
              onPress={() => router.push('/edit-profile')}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionEditText}>Modifier</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nom complet</Text>
            <Text style={styles.infoValue}>DIGBEU Franck</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>franck.digbeu@email.com</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>+225 0595335547</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date de naissance</Text>
            <Text style={styles.infoValue}>14 mai 1988</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Langue</Text>
            <View style={styles.languageContainer}>
              <Image 
                source={{ uri: 'https://flagcdn.com/w20/fr.png' }} 
                style={styles.flagIcon} 
                resizeMode="contain"
              />
              <Text style={styles.infoValue}>Français</Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Payment Info Card */}
        <Animated.View 
          style={[styles.infoCard, animatedCardStyle]} 
          entering={FadeInDown.delay(500).duration(500)}
        >
          <View style={styles.sectionTitle}>
            <LinearGradient
              colors={AppColors.gradient.accent}
              style={styles.iconBackground}
            >
              <FontAwesome5 name="credit-card" size={16} color={AppColors.darkText} />
            </LinearGradient>
            <Text style={styles.sectionTitleText}>Moyens de paiement</Text>
            <TouchableOpacity 
              style={styles.sectionEditButton}
              onPress={() => router.push('/payment-methods')}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionEditText}>Gérer</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.paymentMethodCard}>
            <View style={styles.cardTypeContainer}>
              <FontAwesome5 name="cc-visa" size={24} color={AppColors.darkText} />
              <View style={styles.cardDetails}>
                <Text style={styles.cardTitle}>Visa terminant par 4582</Text>
                <Text style={styles.cardExpiry}>Expire 09/26</Text>
              </View>
            </View>
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Principal</Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Menu Items */}
        <Animated.View 
          style={[styles.menuCard, animatedCardStyle]} 
          entering={FadeInDown.delay(600).duration(500)}
        >
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/orders')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={AppColors.gradient.accent}
              style={styles.menuIconContainer}
            >
              <FontAwesome5 name="shopping-bag" size={16} color={AppColors.darkText} />
            </LinearGradient>
            <Text style={styles.menuText}>Mes commandes</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color={AppColors.mediumGray} />
          </TouchableOpacity>
          
          <View style={styles.menuDivider} />
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/addresses')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={AppColors.gradient.accent}
              style={styles.menuIconContainer}
            >
              <FontAwesome5 name="map-marker-alt" size={16} color={AppColors.darkText} />
            </LinearGradient>
            <Text style={styles.menuText}>Mes adresses</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color={AppColors.mediumGray} />
          </TouchableOpacity>
          
          <View style={styles.menuDivider} />
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/wishlist')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={AppColors.gradient.accent}
              style={styles.menuIconContainer}
            >
              <MaterialIcons name="favorite-border" size={18} color={AppColors.darkText} />
            </LinearGradient>
            <Text style={styles.menuText}>Liste de souhaits</Text>
            <View style={styles.wishlistBadge}>
              <Text style={styles.wishlistBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.menuDivider} />
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/help')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={AppColors.gradient.accent}
              style={styles.menuIconContainer}
            >
              <MaterialIcons name="help-outline" size={18} color={AppColors.darkText} />
            </LinearGradient>
            <Text style={styles.menuText}>Aide & support</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color={AppColors.mediumGray} />
          </TouchableOpacity>
          
          <View style={styles.menuDivider} />
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('Langue', 'Choisissez une langue:', [
              { text: 'Français', onPress: () => console.log('Français selected') },
              { text: 'English', onPress: () => console.log('English selected') },
              { text: 'Español', onPress: () => console.log('Español selected') },
              { text: 'Cancel', style: 'cancel' }
            ])}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={AppColors.gradient.accent}
              style={styles.menuIconContainer}
            >
              <Ionicons name="language" size={18} color={AppColors.darkText} />
            </LinearGradient>
            <Text style={styles.menuText}>Changer la langue</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color={AppColors.mediumGray} />
          </TouchableOpacity>
        </Animated.View>
        
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={logout}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={AppColors.gradient.secondary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutButtonGradient}
          >
            <MaterialIcons name="logout" size={18} color={AppColors.white} />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.version}>
          <Text style={styles.versionText}>Version 2.1.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.offWhite,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 175, 80, 0.3)',
    elevation: 8,
    shadowColor: 'rgba(76, 175, 80, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  blurHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 175, 80, 0.2)',
  },
  blurHeaderTitle: {
    fontSize: 17,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: AppColors.darkText,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    marginLeft: 12,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.white,
  },
  badgeText: {
    color: AppColors.white,
    fontSize: 10,
    fontFamily: Fonts.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 40,
  },
  photoSection: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 25,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: AppColors.white,
  },
  placeholderImageGradient: {
    width: 110,
    height: 110,
    borderRadius: 55,
    padding: 3, // Border width equivalent
  },
  placeholderImage: {
    flex: 1,
    borderRadius: 52,
    backgroundColor: AppColors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    color: AppColors.primary,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: AppColors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppColors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  username: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: AppColors.darkText,
    marginBottom: 5,
  },
  userStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 187, 106, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppColors.statusActive,
    marginRight: 4,
  },
  userStatus: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: AppColors.statusActive,
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  memberText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 8,
    width: width * 0.85,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: 'rgba(76, 175, 80, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.1)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: AppColors.darkText,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    marginTop: 4,
  },
  statDivider: {
    height: 24,
    width: 1,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointStar: {
    marginLeft: 2,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: AppColors.white,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: 'rgba(76, 175, 80, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.1)',
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBackground: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitleText: {
    fontSize: 17,
    fontFamily: Fonts.semiBold,
    color: AppColors.darkText,
    marginLeft: 10,
    flex: 1,
  },
  sectionEditButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
   sectionEditText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.accent,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
    flex: 2,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    marginVertical: 8,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 2,
  },
  flagIcon: {
    width: 20,
    height: 14,
    marginRight: 6,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.lightGray,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardDetails: {
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
  },
  cardExpiry: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: AppColors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  defaultText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: AppColors.white,
  },
  menuCard: {
    backgroundColor: AppColors.white,
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: 'rgba(76, 175, 80, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
    flex: 1,
    marginLeft: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    marginHorizontal: 8,
  },
  wishlistBadge: {
    backgroundColor: AppColors.accent,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: AppColors.white,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: AppColors.white,
    marginLeft: 8,
  },
  version: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
  },
});

export default Profile;