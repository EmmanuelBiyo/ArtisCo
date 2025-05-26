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
  Dimensions,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInUp
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Palette de couleurs (identique à l'écran principal)
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

const { width, height } = Dimensions.get('window');

// Types de méthodes de paiement
const PAYMENT_TYPES = {
  MOBILE_MONEY: 'mobile_money',
  CARD: 'card',
  BANK: 'bank',
  CASH: 'cash'
};

// Configuration des types de paiement
const paymentTypeConfig = {
  [PAYMENT_TYPES.MOBILE_MONEY]: {
    title: 'Mobile Money',
    icon: 'mobile-alt',
    iconComponent: FontAwesome5,
    color: AppColors.warning,
    providers: ['Orange Money', 'MTN MoMo', 'Moov Money'],
    placeholder: '07 XX XX XX XX',
    label: 'Numéro de téléphone'
  },
  [PAYMENT_TYPES.CARD]: {
    title: 'Carte bancaire',
    icon: 'credit-card',
    iconComponent: FontAwesome5,
    color: AppColors.info,
    providers: ['Visa', 'Mastercard', 'American Express'],
    placeholder: '1234 5678 9012 3456',
    label: 'Numéro de carte'
  },
  [PAYMENT_TYPES.BANK]: {
    title: 'Compte bancaire',
    icon: 'bank',
    iconComponent: FontAwesome5,
    color: AppColors.success,
    providers: ['SGBCI', 'BOA', 'UBA', 'Ecobank'],
    placeholder: 'CI05 XXXX XXXX XXXX XXXX',
    label: 'Numéro de compte'
  },
  [PAYMENT_TYPES.CASH]: {
    title: 'Espèces',
    icon: 'money-bill-wave',
    iconComponent: FontAwesome5,
    color: AppColors.accent,
    providers: ['Comptant'],
    placeholder: 'Identifiant espèces',
    label: 'Identifiant'
  }
};

export default function AddPaymentMethod() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState(PAYMENT_TYPES.MOBILE_MONEY);
  const [selectedProvider, setSelectedProvider] = useState('Orange Money');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [paymentName, setPaymentName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Animations
  const headerOpacity = useSharedValue(1);
  const stepOpacity = useSharedValue(1);

  useEffect(() => {
    headerOpacity.value = withSpring(1);
  }, []);

  useEffect(() => {
    // Réinitialiser le provider quand le type change
    const config = paymentTypeConfig[selectedType];
    setSelectedProvider(config.providers[0]);
    setErrors({});
  }, [selectedType]);

  const validateForm = () => {
    const newErrors = {};

    if (!paymentNumber.trim()) {
      newErrors.number = 'Ce champ est requis';
    } else if (selectedType === PAYMENT_TYPES.MOBILE_MONEY) {
      const cleaned = paymentNumber.replace(/\s/g, '');
      if (!/^\d{10}$/.test(cleaned)) {
        newErrors.number = 'Format de numéro invalide (10 chiffres requis)';
      }
    } else if (selectedType === PAYMENT_TYPES.CARD) {
      const cleaned = paymentNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cleaned)) {
        newErrors.number = 'Format de carte invalide (16 chiffres requis)';
      }
    }

    if (!paymentName.trim()) {
      newErrors.name = 'Ce champ est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.replace(/(\d{2})(?=\d)/g, '$1 ');
    return formatted.slice(0, 14); // Limite à 10 chiffres + espaces
  };

  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // Limite à 16 chiffres + espaces
  };

  const handleNumberInput = (value) => {
    let formatted = value;
    
    if (selectedType === PAYMENT_TYPES.MOBILE_MONEY) {
      formatted = formatPhoneNumber(value);
    } else if (selectedType === PAYMENT_TYPES.CARD) {
      formatted = formatCardNumber(value);
    }
    
    setPaymentNumber(formatted);
    
    // Supprimer l'erreur si le champ devient valide
    if (errors.number && formatted.trim()) {
      setErrors(prev => ({ ...prev, number: null }));
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      stepOpacity.value = withTiming(0, { duration: 200 }, () => {
        setCurrentStep(currentStep + 1);
        stepOpacity.value = withSpring(1);
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      stepOpacity.value = withTiming(0, { duration: 200 }, () => {
        setCurrentStep(currentStep - 1);
        stepOpacity.value = withSpring(1);
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulation de l'ajout
    setTimeout(() => {
      setIsProcessing(false);
      
      Alert.alert(
        'Succès !',
        `Votre moyen de paiement "${paymentName}" a été ajouté avec succès.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Réinitialiser et retourner
              router.back();
            }
          }
        ]
      );
    }, 2000);
  };

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const animatedStepStyle = useAnimatedStyle(() => ({
    opacity: stepOpacity.value,
  }));

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepRow}>
          <View style={[
            styles.stepCircle,
            step <= currentStep ? styles.stepCircleActive : styles.stepCircleInactive
          ]}>
            {step < currentStep ? (
              <Ionicons name="checkmark" size={16} color={AppColors.white} />
            ) : (
              <Text style={[
                styles.stepNumber,
                step <= currentStep ? styles.stepNumberActive : styles.stepNumberInactive
              ]}>
                {step}
              </Text>
            )}
          </View>
          {step < 3 && (
            <View style={[
              styles.stepLine,
              step < currentStep ? styles.stepLineActive : styles.stepLineInactive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderTypeSelection = () => (
    <Animated.View style={[styles.stepContent, animatedStepStyle]}>
      <Text style={styles.stepTitle}>Choisissez le type de paiement</Text>
      <View style={styles.typeGrid}>
        {Object.entries(paymentTypeConfig).map(([type, config]) => {
          const IconComponent = config.iconComponent;
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeCard,
                selectedType === type ? styles.typeCardSelected : styles.typeCardDefault
              ]}
              onPress={() => setSelectedType(type)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={selectedType === type ? AppColors.gradient.accent : ['#FFFFFF', '#FFFFFF']}
                style={styles.typeCardGradient}
              >
                <View style={[
                  styles.typeIconContainer,
                  selectedType === type ? styles.typeIconContainerSelected : styles.typeIconContainerDefault
                ]}>
                  <IconComponent
                    name={config.icon}
                    size={24}
                    color={selectedType === type ? config.color : AppColors.mediumGray}
                  />
                </View>
                <Text style={[
                  styles.typeCardText,
                  selectedType === type ? styles.typeCardTextSelected : styles.typeCardTextDefault
                ]}>
                  {config.title}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );

  const renderProviderSelection = () => {
    const config = paymentTypeConfig[selectedType];
    
    return (
      <Animated.View style={[styles.stepContent, animatedStepStyle]}>
        <Text style={styles.stepTitle}>
          Sélectionnez {selectedType === PAYMENT_TYPES.MOBILE_MONEY ? "l'opérateur" : 'le fournisseur'}
        </Text>
        <View style={styles.providerList}>
          {config.providers.map((provider, index) => (
            <Animated.View
              key={provider}
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <TouchableOpacity
                style={[
                  styles.providerCard,
                  selectedProvider === provider ? styles.providerCardSelected : styles.providerCardDefault
                ]}
                onPress={() => setSelectedProvider(provider)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.providerText,
                  selectedProvider === provider ? styles.providerTextSelected : styles.providerTextDefault
                ]}>
                  {provider}
                </Text>
                {selectedProvider === provider && (
                  <Ionicons name="checkmark-circle" size={20} color={AppColors.primary} />
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderDetailsForm = () => {
    const config = paymentTypeConfig[selectedType];
    
    return (
      <Animated.View style={[styles.stepContent, animatedStepStyle]}>
        <Text style={styles.stepTitle}>Informations du moyen de paiement</Text>
        
        {/* Résumé de la sélection */}
        <View style={styles.selectionSummary}>
          <LinearGradient
            colors={AppColors.gradient.accent}
            style={styles.summaryIconContainer}
          >
            <config.iconComponent
              name={config.icon}
              size={20}
              color={config.color}
            />
          </LinearGradient>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>{config.title}</Text>
            <Text style={styles.summaryProvider}>{selectedProvider}</Text>
          </View>
        </View>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          {/* Numéro/Identifiant */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>{config.label}</Text>
            <TextInput
              style={[
                styles.formInput,
                errors.number ? styles.formInputError : null
              ]}
              value={paymentNumber}
              onChangeText={handleNumberInput}
              placeholder={config.placeholder}
              placeholderTextColor={AppColors.mediumGray}
              keyboardType={selectedType === PAYMENT_TYPES.MOBILE_MONEY ? 'phone-pad' : 'default'}
            />
            {errors.number && (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={16} color={AppColors.error} />
                <Text style={styles.errorText}>{errors.number}</Text>
              </View>
            )}
          </View>

          {/* Nom du moyen de paiement */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Nom du moyen de paiement</Text>
            <TextInput
              style={[
                styles.formInput,
                errors.name ? styles.formInputError : null
              ]}
              value={paymentName}
              onChangeText={(text) => {
                setPaymentName(text);
                if (errors.name && text.trim()) {
                  setErrors(prev => ({ ...prev, name: null }));
                }
              }}
              placeholder={`Mon ${selectedProvider}`}
              placeholderTextColor={AppColors.mediumGray}
            />
            {errors.name && (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={16} color={AppColors.error} />
                <Text style={styles.errorText}>{errors.name}</Text>
              </View>
            )}
          </View>

          {/* Option par défaut */}
          <TouchableOpacity
            style={styles.defaultOption}
            onPress={() => setIsDefault(!isDefault)}
            activeOpacity={0.7}
          >
            <View style={styles.defaultCheckbox}>
              <View style={[
                styles.checkbox,
                isDefault ? styles.checkboxSelected : styles.checkboxDefault
              ]}>
                {isDefault && (
                  <Ionicons name="checkmark" size={14} color={AppColors.white} />
                )}
              </View>
              <Text style={styles.defaultLabel}>
                Définir comme moyen de paiement par défaut
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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
            onPress={currentStep > 1 ? prevStep : () => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color={AppColors.darkText} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Ajouter un moyen de paiement</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerIconButton}
            activeOpacity={0.7}
          >
            <MaterialIcons name="close" size={22} color={AppColors.darkText} />
          </TouchableOpacity>
        </LinearGradient>

        {renderStepIndicator()}
      </Animated.View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {currentStep === 1 && renderTypeSelection()}
          {currentStep === 2 && renderProviderSelection()}
          {currentStep === 3 && renderDetailsForm()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={prevStep}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Précédent</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < 3 ? (
            <TouchableOpacity
              style={[styles.primaryButton, currentStep === 1 ? styles.primaryButtonFull : null]}
              onPress={nextStep}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={AppColors.gradient.primary}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Suivant</Text>
                <Ionicons name="chevron-forward" size={18} color={AppColors.white} />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSubmit}
              disabled={isProcessing}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isProcessing ? ['#CCCCCC', '#999999'] : AppColors.gradient.primary}
                style={styles.primaryButtonGradient}
              >
                {isProcessing ? (
                  <>
                    <Text style={styles.primaryButtonText}>Ajout en cours...</Text>
                  </>
                ) : (
                  <>
                    <MaterialIcons name="add" size={18} color={AppColors.white} />
                    <Text style={styles.primaryButtonText}>Ajouter</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: AppColors.darkText,
    textAlign: 'center',
  },
  headerIconButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: AppColors.primary,
  },
  stepCircleInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  stepNumber: {
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  stepNumberActive: {
    color: AppColors.white,
  },
  stepNumberInactive: {
    color: AppColors.mediumGray,
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: AppColors.primary,
  },
  stepLineInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: AppColors.darkText,
    marginBottom: 24,
    textAlign: 'center',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: 'rgba(212, 175, 55, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  typeCardSelected: {
    borderWidth: 2,
    borderColor: AppColors.primary,
  },
  typeCardDefault: {
    borderWidth: 1,
    borderColor: AppColors.lightGray,
  },
  typeCardGradient: {
    padding: 20,
    alignItems: 'center',
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIconContainerSelected: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  typeIconContainerDefault: {
    backgroundColor: AppColors.lightGray,
  },
  typeCardText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  typeCardTextSelected: {
    color: AppColors.primary,
  },
  typeCardTextDefault: {
    color: AppColors.darkText,
  },
  providerList: {
    gap: 12,
  },
  providerCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: 'rgba(212, 175, 55, 0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  providerCardSelected: {
    borderWidth: 2,
    borderColor: AppColors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  providerCardDefault: {
    borderWidth: 1,
    borderColor: AppColors.lightGray,
  },
  providerText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
  },
  providerTextSelected: {
    color: AppColors.primary,
  },
  providerTextDefault: {
    color: AppColors.darkText,
  },
  selectionSummary: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
  },
  summaryProvider: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    marginTop: 2,
  },
  formContainer: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
  },
  formInput: {
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: AppColors.darkText,
    backgroundColor: AppColors.white,
  },
  formInputError: {
    borderColor: AppColors.error,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: AppColors.error,
  },
  defaultOption: {
    marginTop: 8,
  },
  defaultCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: AppColors.primary,
  },
  checkboxDefault: {
    borderWidth: 2,
    borderColor: AppColors.lightGray,
    backgroundColor: AppColors.white,
  },
  defaultLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.darkText,
    flex: 1,
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: AppColors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.lightGray,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: AppColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.mediumGray,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButtonFull: {
    flex: 1,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.white,
  },
});