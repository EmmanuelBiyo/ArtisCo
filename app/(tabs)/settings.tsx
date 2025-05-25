import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Platform,
  Alert,
  Switch,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Palette de couleurs (même que les autres écrans)
const AppColors = {
  primary: '#D4AF37',
  primaryLight: '#F5EFD6',
  primaryDark: '#A98307',
  secondary: '#1E1E24',
  accent: '#E6C55C',
  white: '#FFFFFF',
  offWhite: '#F9F9F9',
  lightGray: '#F2F2F2',
  mediumGray: '#81818A',
  darkText: '#212121',
  gradient: {
    primary: ['#F2E3AA', '#D4AF37', '#A98307'],
    secondary: ['#2E2E36', '#1E1E24'],
    accent: ['#F7EAB5', '#E6C55C']
  },
  success: '#4CAF50',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#007AFF'
};

const Fonts = {
  light: 'Inter-Light',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

const { width } = Dimensions.get('window');

// Types de paramètres
const SETTING_TYPES = {
  TOGGLE: 'toggle',
  NAVIGATION: 'navigation',
  ACTION: 'action'
};

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // États des paramètres
  const [settings, setSettings] = useState({
    notifications: true,
    pushNotifications: true,
    emailNotifications: false,
    darkMode: false,
    locationServices: true,
    analytics: true,
    autoUpdate: true
  });

  // Animation
  const headerOpacity = useSharedValue(1);

  useEffect(() => {
    headerOpacity.value = withSpring(1);
  }, []);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  // Gestion des toggles
  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Actions de navigation
  const navigateToScreen = (screen) => {
    Alert.alert(
      'Navigation',
      `Redirection vers ${screen}`,
      [{ text: 'OK' }]
    );
  };

  // Actions spéciales
  const handleSpecialAction = (action) => {
    switch (action) {
      case 'clearCache':
        Alert.alert(
          'Vider le cache',
          'Voulez-vous vraiment vider le cache de l\'application ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { 
              text: 'Confirmer', 
              onPress: () => Alert.alert('Succès', 'Cache vidé avec succès !') 
            }
          ]
        );
        break;
      case 'logout':
        Alert.alert(
          'Déconnexion',
          'Voulez-vous vraiment vous déconnecter ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { 
              text: 'Déconnecter', 
              style: 'destructive',
              onPress: () => Alert.alert('Déconnecté', 'Vous avez été déconnecté avec succès !') 
            }
          ]
        );
        break;
      case 'deleteAccount':
        Alert.alert(
          'Supprimer le compte',
          'Cette action est irréversible. Voulez-vous vraiment supprimer votre compte ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { 
              text: 'Supprimer', 
              style: 'destructive',
              onPress: () => Alert.alert('Compte supprimé', 'Votre compte a été supprimé.') 
            }
          ]
        );
        break;
      default:
        Alert.alert('Action', `Action ${action} effectuée`);
    }
  };

  // Configuration des sections de paramètres
  const settingSections = [
    {
      title: 'Notifications',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Recevoir toutes les notifications',
          icon: 'notifications',
          iconType: 'ionicon',
          type: SETTING_TYPES.TOGGLE,
          value: settings.notifications,
          onToggle: () => toggleSetting('notifications')
        },
        {
          id: 'pushNotifications',
          title: 'Notifications push',
          subtitle: 'Notifications en temps réel',
          icon: 'phone-portrait',
          iconType: 'ionicon',
          type: SETTING_TYPES.TOGGLE,
          value: settings.pushNotifications,
          onToggle: () => toggleSetting('pushNotifications')
        },
        {
          id: 'emailNotifications',
          title: 'Notifications email',
          subtitle: 'Recevoir les emails de mise à jour',
          icon: 'mail',
          iconType: 'ionicon',
          type: SETTING_TYPES.TOGGLE,
          value: settings.emailNotifications,
          onToggle: () => toggleSetting('emailNotifications')
        }
      ]
    },
    {
      title: 'Apparence',
      items: [
        {
          id: 'darkMode',
          title: 'Mode sombre',
          subtitle: 'Thème sombre pour l\'application',
          icon: 'moon',
          iconType: 'ionicon',
          type: SETTING_TYPES.TOGGLE,
          value: settings.darkMode,
          onToggle: () => toggleSetting('darkMode')
        },
        {
          id: 'language',
          title: 'Langue',
          subtitle: 'Français',
          icon: 'language',
          iconType: 'ionicon',
          type: SETTING_TYPES.NAVIGATION,
          onPress: () => navigateToScreen('Langues')
        }
      ]
    },
    {
      title: 'Confidentialité',
      items: [
        {
          id: 'locationServices',
          title: 'Services de localisation',
          subtitle: 'Permettre la géolocalisation',
          icon: 'location',
          iconType: 'ionicon',
          type: SETTING_TYPES.TOGGLE,
          value: settings.locationServices,
          onToggle: () => toggleSetting('locationServices')
        },
        {
          id: 'analytics',
          title: 'Données d\'analyse',
          subtitle: 'Partager les données d\'utilisation',
          icon: 'analytics',
          iconType: 'ionicon',
          type: SETTING_TYPES.TOGGLE,
          value: settings.analytics,
          onToggle: () => toggleSetting('analytics')
        },
        {
          id: 'privacy',
          title: 'Politique de confidentialité',
          subtitle: 'Consulter nos conditions',
          icon: 'shield-checkmark',
          iconType: 'ionicon',
          type: SETTING_TYPES.NAVIGATION,
          onPress: () => navigateToScreen('Politique de confidentialité')
        }
      ]
    },
    {
      title: 'Application',
      items: [
        {
          id: 'autoUpdate',
          title: 'Mise à jour automatique',
          subtitle: 'Mettre à jour automatiquement',
          icon: 'download',
          iconType: 'ionicon',
          type: SETTING_TYPES.TOGGLE,
          value: settings.autoUpdate,
          onToggle: () => toggleSetting('autoUpdate')
        },
        {
          id: 'clearCache',
          title: 'Vider le cache',
          subtitle: 'Libérer de l\'espace de stockage',
          icon: 'trash',
          iconType: 'ionicon',
          type: SETTING_TYPES.ACTION,
          onPress: () => handleSpecialAction('clearCache')
        },
        {
          id: 'about',
          title: 'À propos',
          subtitle: 'Version 1.0.0',
          icon: 'information-circle',
          iconType: 'ionicon',
          type: SETTING_TYPES.NAVIGATION,
          onPress: () => navigateToScreen('À propos')
        }
      ]
    },
    {
      title: 'Compte',
      items: [
        {
          id: 'help',
          title: 'Aide et support',
          subtitle: 'Centre d\'aide et FAQ',
          icon: 'help-circle',
          iconType: 'ionicon',
          type: SETTING_TYPES.NAVIGATION,
          onPress: () => navigateToScreen('Aide')
        },
        {
          id: 'logout',
          title: 'Déconnexion',
          subtitle: 'Se déconnecter de l\'application',
          icon: 'log-out',
          iconType: 'ionicon',
          type: SETTING_TYPES.ACTION,
          onPress: () => handleSpecialAction('logout'),
          textColor: AppColors.warning
        },
        {
          id: 'deleteAccount',
          title: 'Supprimer le compte',
          subtitle: 'Supprimer définitivement le compte',
          icon: 'trash-bin',
          iconType: 'ionicon',
          type: SETTING_TYPES.ACTION,
          onPress: () => handleSpecialAction('deleteAccount'),
          textColor: AppColors.error
        }
      ]
    }
  ];

  const renderSettingItem = (item, index, sectionIndex) => {
    const getIconComponent = () => {
      switch (item.iconType) {
        case 'material':
          return MaterialIcons;
        case 'fontawesome':
          return FontAwesome5;
        default:
          return Ionicons;
      }
    };

    const IconComponent = getIconComponent();

    return (
      <Animated.View
        key={item.id}
        entering={FadeInDown.delay((sectionIndex * 100) + (index * 50)).duration(600)}
        style={styles.settingItem}
      >
        <TouchableOpacity
          style={styles.settingContent}
          onPress={item.type === SETTING_TYPES.NAVIGATION || item.type === SETTING_TYPES.ACTION ? item.onPress : null}
          activeOpacity={item.type === SETTING_TYPES.TOGGLE ? 1 : 0.7}
        >
          <View style={styles.settingLeft}>
            <LinearGradient
              colors={AppColors.gradient.accent}
              style={styles.settingIconContainer}
            >
              <IconComponent 
                name={item.icon} 
                size={18} 
                color={AppColors.primary}
              />
            </LinearGradient>
            
            <View style={styles.settingText}>
              <Text style={[
                styles.settingTitle,
                item.textColor && { color: item.textColor }
              ]}>
                {item.title}
              </Text>
              <Text style={styles.settingSubtitle}>
                {item.subtitle}
              </Text>
            </View>
          </View>

          <View style={styles.settingRight}>
            {item.type === SETTING_TYPES.TOGGLE ? (
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ 
                  false: AppColors.lightGray, 
                  true: AppColors.primaryLight 
                }}
                thumbColor={item.value ? AppColors.primary : AppColors.mediumGray}
                ios_backgroundColor={AppColors.lightGray}
              />
            ) : (
              <Ionicons 
                name="chevron-forward" 
                size={18} 
                color={AppColors.mediumGray} 
              />
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
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
          
          <Text style={styles.headerTitle}>Paramètres</Text>
          
          <View style={styles.headerIconPlaceholder} />
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {settingSections.map((section, sectionIndex) => (
          <Animated.View 
            key={section.title}
            style={styles.section}
            entering={FadeIn.delay(sectionIndex * 150).duration(600)}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <View style={styles.sectionContent}>
              {section.items.map((item, index) => 
                renderSettingItem(item, index, sectionIndex)
              )}
            </View>
          </Animated.View>
        ))}
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
    position: 'relative',
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
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
    elevation: 8,
    shadowColor: 'rgba(212, 175, 55, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
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
  headerIconPlaceholder: {
    width: 38,
    height: 38,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: AppColors.darkText,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.1)',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
  },
  settingRight: {
    marginLeft: 12,
  },
});