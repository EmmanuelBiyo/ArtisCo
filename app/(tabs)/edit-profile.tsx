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
  TextInput,
  KeyboardAvoidingView,
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

export default function EditProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    firstName: 'Amadou',
    lastName: 'Diallo',
    email: 'amadou.diallo@example.com',
    phone: '+223 76 12 34 56',
    address: 'Bamako, Mali',
    city: 'Bamako',
    country: 'Mali',
    bio: 'Passionné d\'artisanat malien et de culture traditionnelle.'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Animation
  const headerOpacity = useSharedValue(1);

  useEffect(() => {
    headerOpacity.value = withSpring(1);
  }, []);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  // Gestion des changements
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
    
    // Effacer l'erreur si elle existe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsLoading(true);

    // Simuler une sauvegarde
    setTimeout(() => {
      setIsLoading(false);
      setHasChanges(false);
      Alert.alert(
        'Succès', 
        'Votre profil a été mis à jour avec succès !',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 1500);
  };

  // Confirmer l'annulation
  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Modifications non sauvegardées',
        'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?',
        [
          { text: 'Rester', style: 'cancel' },
          { text: 'Quitter', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  // Changer la photo de profil
  const changeProfilePhoto = () => {
    Alert.alert(
      'Photo de profil',
      'Choisissez une option',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Galerie', onPress: () => Alert.alert('Info', 'Ouverture de la galerie...') },
        { text: 'Appareil photo', onPress: () => Alert.alert('Info', 'Ouverture de l\'appareil photo...') }
      ]
    );
  };

  // Configuration des champs
  const formFields = [
    {
      id: 'personal',
      title: 'Informations personnelles',
      fields: [
        {
          key: 'firstName',
          label: 'Prénom',
          placeholder: 'Entrez votre prénom',
          icon: 'person',
          iconType: 'ionicon'
        },
        {
          key: 'lastName',
          label: 'Nom',
          placeholder: 'Entrez votre nom',
          icon: 'person',
          iconType: 'ionicon'
        },
        {
          key: 'bio',
          label: 'Bio',
          placeholder: 'Parlez-nous de vous...',
          icon: 'document-text',
          iconType: 'ionicon',
          multiline: true,
          numberOfLines: 3
        }
      ]
    },
    {
      id: 'contact',
      title: 'Informations de contact',
      fields: [
        {
          key: 'email',
          label: 'Email',
          placeholder: 'votre@email.com',
          icon: 'mail',
          iconType: 'ionicon',
          keyboardType: 'email-address',
          autoCapitalize: 'none'
        },
        {
          key: 'phone',
          label: 'Téléphone',
          placeholder: '+223 XX XX XX XX',
          icon: 'call',
          iconType: 'ionicon',
          keyboardType: 'phone-pad'
        }
      ]
    },
    {
      id: 'location',
      title: 'Localisation',
      fields: [
        {
          key: 'address',
          label: 'Adresse',
          placeholder: 'Votre adresse complète',
          icon: 'location',
          iconType: 'ionicon'
        },
        {
          key: 'city',
          label: 'Ville',
          placeholder: 'Votre ville',
          icon: 'business',
          iconType: 'ionicon'
        },
        {
          key: 'country',
          label: 'Pays',
          placeholder: 'Votre pays',
          icon: 'flag',
          iconType: 'ionicon'
        }
      ]
    }
  ];

  const renderFormField = (field, sectionIndex, fieldIndex) => {
    const getIconComponent = () => {
      switch (field.iconType) {
        case 'material':
          return MaterialIcons;
        case 'fontawesome':
          return FontAwesome5;
        default:
          return Ionicons;
      }
    };

    const IconComponent = getIconComponent();
    const hasError = errors[field.key];

    return (
      <Animated.View
        key={field.key}
        entering={FadeInDown.delay((sectionIndex * 100) + (fieldIndex * 50)).duration(600)}
        style={styles.fieldContainer}
      >
        <Text style={styles.fieldLabel}>{field.label}</Text>
        
        <View style={[
          styles.inputContainer,
          hasError && styles.inputContainerError
        ]}>
          <LinearGradient
            colors={AppColors.gradient.accent}
            style={styles.inputIconContainer}
          >
            <IconComponent 
              name={field.icon} 
              size={16} 
              color={AppColors.primary}
            />
          </LinearGradient>
          
          <TextInput
            style={[
              styles.textInput,
              field.multiline && styles.textInputMultiline
            ]}
            value={formData[field.key]}
            onChangeText={(value) => handleInputChange(field.key, value)}
            placeholder={field.placeholder}
            placeholderTextColor={AppColors.mediumGray}
            keyboardType={field.keyboardType || 'default'}
            autoCapitalize={field.autoCapitalize || 'words'}
            multiline={field.multiline || false}
            numberOfLines={field.numberOfLines || 1}
            textAlignVertical={field.multiline ? 'top' : 'center'}
          />
        </View>
        
        {hasError && (
          <Text style={styles.errorText}>{hasError}</Text>
        )}
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
            onPress={handleCancel} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={22} color={AppColors.darkText} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Modifier le profil</Text>
          
          <TouchableOpacity 
            onPress={handleSave}
            style={[
              styles.saveButton,
              (!hasChanges || isLoading) && styles.saveButtonDisabled
            ]}
            activeOpacity={0.7}
            disabled={!hasChanges || isLoading}
          >
            <Text style={[
              styles.saveButtonText,
              (!hasChanges || isLoading) && styles.saveButtonTextDisabled
            ]}>
              {isLoading ? 'Saving...' : 'Sauver'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo de profil */}
        <Animated.View 
          style={styles.profilePhotoSection}
          entering={FadeIn.delay(100).duration(600)}
        >
          <TouchableOpacity
            style={styles.profilePhotoContainer}
            onPress={changeProfilePhoto}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={AppColors.gradient.primary}
              style={styles.profilePhoto}
            >
              <Text style={styles.profilePhotoText}>AD</Text>
            </LinearGradient>
            
            <View style={styles.cameraIconContainer}>
              <LinearGradient
                colors={AppColors.gradient.accent}
                style={styles.cameraIcon}
              >
                <Ionicons name="camera" size={16} color={AppColors.primary} />
              </LinearGradient>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.changePhotoText}>Modifier la photo</Text>
        </Animated.View>

        {/* Formulaire */}
        {formFields.map((section, sectionIndex) => (
          <Animated.View 
            key={section.id}
            style={styles.section}
            entering={FadeIn.delay((sectionIndex + 2) * 150).duration(600)}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <View style={styles.sectionContent}>
              {section.fields.map((field, fieldIndex) => 
                renderFormField(field, sectionIndex, fieldIndex)
              )}
            </View>
          </Animated.View>
        ))}

        {/* Actions supplémentaires */}
        <Animated.View 
          style={styles.additionalActions}
          entering={FadeIn.delay(800).duration(600)}
        >
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Info', 'Changement de mot de passe...')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={AppColors.gradient.accent}
              style={styles.actionIconContainer}
            >
              <Ionicons name="lock-closed" size={18} color={AppColors.primary} />
            </LinearGradient>
            <Text style={styles.actionButtonText}>Changer le mot de passe</Text>
            <Ionicons name="chevron-forward" size={18} color={AppColors.mediumGray} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Info', 'Désactivation du compte...')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#FFE5E5', '#FFCCCC']}
              style={styles.actionIconContainer}
            >
              <Ionicons name="person-remove" size={18} color={AppColors.error} />
            </LinearGradient>
            <Text style={[styles.actionButtonText, { color: AppColors.error }]}>
              Désactiver le compte
            </Text>
            <Ionicons name="chevron-forward" size={18} color={AppColors.mediumGray} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: AppColors.primary,
  },
  saveButtonTextDisabled: {
    color: AppColors.mediumGray,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  profilePhotoSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  profilePhotoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: 'rgba(212, 175, 55, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profilePhotoText: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: AppColors.white,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  cameraIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppColors.white,
  },
  changePhotoText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.primary,
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
    padding: 16,
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.lightGray,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  inputContainerError: {
    borderColor: AppColors.error,
  },
  inputIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: AppColors.darkText,
    paddingVertical: 12,
    paddingRight: 16,
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: AppColors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  additionalActions: {
    paddingHorizontal: 16,
  },
  actionButton: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
    flex: 1,
  },
});