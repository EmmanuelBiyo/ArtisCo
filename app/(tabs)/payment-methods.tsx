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
  RefreshControl,
  Dimensions,
  TextInput,
  Modal
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
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Palette de couleurs (identique aux autres écrans)
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

// Types de méthodes de paiement
const PAYMENT_TYPES = {
  MOBILE_MONEY: 'mobile_money',
  CARD: 'card',
  BANK: 'bank',
  CASH: 'cash'
};

// Icônes par type de paiement
const getPaymentIcon = (type, provider) => {
  switch (type) {
    case PAYMENT_TYPES.MOBILE_MONEY:
      if (provider === 'Orange Money') return { name: 'mobile-alt', component: FontAwesome5, color: AppColors.warning };
      if (provider === 'MTN MoMo') return { name: 'mobile-alt', component: FontAwesome5, color: AppColors.warning };
      if (provider === 'Moov Money') return { name: 'mobile-alt', component: FontAwesome5, color: AppColors.info };
      return { name: 'mobile-alt', component: FontAwesome5, color: AppColors.primary };
    case PAYMENT_TYPES.CARD:
      return { name: 'credit-card', component: FontAwesome5, color: AppColors.info };
    case PAYMENT_TYPES.BANK:
      return { name: 'bank', component: FontAwesome5, color: AppColors.success };
    case PAYMENT_TYPES.CASH:
      return { name: 'money-bill-wave', component: FontAwesome5, color: AppColors.accent };
    default:
      return { name: 'payment', component: MaterialIcons, color: AppColors.primary };
  }
};

export default function PaymentMethods() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: PAYMENT_TYPES.MOBILE_MONEY,
      provider: 'Orange Money',
      number: '07 XX XX XX 45',
      name: 'Mon Orange Money',
      isDefault: true,
      balance: '125,000 FCFA',
      lastUsed: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      type: PAYMENT_TYPES.MOBILE_MONEY,
      provider: 'MTN MoMo',
      number: '05 XX XX XX 32',
      name: 'MTN Mobile Money',
      isDefault: false,
      balance: '89,500 FCFA',
      lastUsed: new Date(Date.now() - 86400000)
    },
    {
      id: 3,
      type: PAYMENT_TYPES.CARD,
      provider: 'Visa',
      number: '**** **** **** 1234',
      name: 'Ma Carte Visa',
      isDefault: false,
      expiryDate: '12/26',
      lastUsed: new Date(Date.now() - 172800000)
    },
    {
      id: 4,
      type: PAYMENT_TYPES.BANK,
      provider: 'SGBCI',
      number: 'CI05 XXXX XXXX XXXX 7890',
      name: 'Compte SGBCI',
      isDefault: false,
      balance: '340,000 FCFA',
      lastUsed: new Date(Date.now() - 259200000)
    }
  ]);

  // États pour le nouveau moyen de paiement
  const [newPayment, setNewPayment] = useState({
    type: PAYMENT_TYPES.MOBILE_MONEY,
    provider: 'Orange Money',
    number: '',
    name: ''
  });

  // Animations
  const headerOpacity = useSharedValue(1);
  const modalScale = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withSpring(1);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simuler le rechargement
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const setAsDefault = (id) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const deletePaymentMethod = (id) => {
    Alert.alert(
      'Supprimer le moyen de paiement',
      'Voulez-vous vraiment supprimer ce moyen de paiement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(p => p.id !== id));
          }
        }
      ]
    );
  };

  const addPaymentMethod = () => {
    if (!newPayment.number.trim() || !newPayment.name.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs requis.');
      return;
    }

    const newMethod = {
      id: Date.now(),
      ...newPayment,
      isDefault: paymentMethods.length === 0,
      balance: newPayment.type === PAYMENT_TYPES.CARD ? undefined : '0 FCFA',
      lastUsed: new Date()
    };

    setPaymentMethods(prev => [...prev, newMethod]);
    setNewPayment({
      type: PAYMENT_TYPES.MOBILE_MONEY,
      provider: 'Orange Money',
      number: '',
      name: ''
    });
    setShowAddModal(false);
  };

  const initiatePayment = (method) => {
    setSelectedPayment(method);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!paymentAmount.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un montant.');
      return;
    }

    const amount = parseFloat(paymentAmount.replace(/[^\d]/g, ''));
    if (amount <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide.');
      return;
    }

    setIsProcessing(true);

    // Simulation du processus de paiement
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentModal(false);
      setPaymentAmount('');
      
      Alert.alert(
        'Paiement réussi !',
        `Votre paiement de ${paymentAmount} FCFA via ${selectedPayment.name} a été effectué avec succès.`,
        [{ text: 'OK' }]
      );

      // Mettre à jour la dernière utilisation
      setPaymentMethods(prev =>
        prev.map(method =>
          method.id === selectedPayment.id
            ? { ...method, lastUsed: new Date() }
            : method
        )
      );
    }, 2000);
  };

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
  }));

  const openModal = () => {
    setShowAddModal(true);
    modalScale.value = withSpring(1);
  };

  const closeModal = () => {
    modalScale.value = withTiming(0, { duration: 200 });
    setTimeout(() => setShowAddModal(false), 200);
  };

  const renderPaymentMethod = (method, index) => {
    const icon = getPaymentIcon(method.type, method.provider);
    const IconComponent = icon.component;

    return (
      <Animated.View
        key={method.id}
        entering={FadeInDown.delay(index * 100).duration(600)}
        style={[
          styles.paymentItem,
          method.isDefault && styles.defaultPayment
        ]}
      >
        <TouchableOpacity
          style={styles.paymentContent}
          onPress={() => initiatePayment(method)}
          activeOpacity={0.7}
        >
          <View style={styles.paymentLeft}>
            <LinearGradient
              colors={method.isDefault ? AppColors.gradient.primary : AppColors.gradient.accent}
              style={styles.paymentIconContainer}
            >
              <IconComponent
                name={icon.name}
                size={20}
                color={icon.color}
              />
            </LinearGradient>

            <View style={styles.paymentText}>
              <View style={styles.paymentHeader}>
                <Text style={[
                  styles.paymentName,
                  method.isDefault && styles.defaultPaymentName
                ]}>
                  {method.name}
                </Text>
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Défaut</Text>
                  </View>
                )}
              </View>

              <Text style={styles.paymentProvider}>
                {method.provider}
              </Text>
              <Text style={styles.paymentNumber}>
                {method.number}
              </Text>
              {method.balance && (
                <Text style={styles.paymentBalance}>
                  Solde: {method.balance}
                </Text>
              )}
              {method.expiryDate && (
                <Text style={styles.paymentExpiry}>
                  Expire: {method.expiryDate}
                </Text>
              )}
              <Text style={styles.paymentLastUsed}>
                Dernière utilisation: {method.lastUsed.toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </View>

          <View style={styles.paymentActions}>
            {!method.isDefault && (
              <TouchableOpacity
                style={styles.setDefaultButton}
                onPress={() => setAsDefault(method.id)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="star-outline" size={18} color={AppColors.primary} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deletePaymentMethod(method.id)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="close" size={18} color={AppColors.mediumGray} />
            </TouchableOpacity>
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

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Moyens de Paiement</Text>
          </View>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={openModal}
            activeOpacity={0.7}
          >
            <MaterialIcons name="add" size={22} color={AppColors.darkText} />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColors.primary]}
            tintColor={AppColors.primary}
          />
        }
      >
        {/* Payment Methods List */}
        {paymentMethods.length > 0 ? (
          <View style={styles.paymentsList}>
            {paymentMethods.map((method, index) => renderPaymentMethod(method, index))}
          </View>
        ) : (
          <Animated.View
            style={styles.emptyState}
            entering={FadeIn.delay(300).duration(800)}
          >
            <LinearGradient
              colors={AppColors.gradient.accent}
              style={styles.emptyIconContainer}
            >
              <FontAwesome5 name="credit-card" size={48} color={AppColors.primary} />
            </LinearGradient>
            <Text style={styles.emptyTitle}>Aucun moyen de paiement</Text>
            <Text style={styles.emptyMessage}>
              Ajoutez votre premier moyen de paiement pour commencer.
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={openModal}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={AppColors.gradient.primary}
                style={styles.addButtonGradient}
              >
                <MaterialIcons name="add" size={18} color={AppColors.white} />
                <Text style={styles.addButtonText}>Ajouter</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      {/* Modal d'ajout de moyen de paiement */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, animatedModalStyle]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouveau moyen de paiement</Text>
              <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                <MaterialIcons name="close" size={24} color={AppColors.mediumGray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Type de paiement</Text>
                <View style={styles.typeSelector}>
                  {Object.entries({
                    [PAYMENT_TYPES.MOBILE_MONEY]: 'Mobile Money',
                    [PAYMENT_TYPES.CARD]: 'Carte bancaire',
                    [PAYMENT_TYPES.BANK]: 'Compte bancaire',
                    [PAYMENT_TYPES.CASH]: 'Espèces'
                  }).map(([type, label]) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        newPayment.type === type && styles.selectedTypeOption
                      ]}
                      onPress={() => setNewPayment(prev => ({ ...prev, type }))}
                    >
                      <Text style={[
                        styles.typeOptionText,
                        newPayment.type === type && styles.selectedTypeOptionText
                      ]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {newPayment.type === PAYMENT_TYPES.MOBILE_MONEY && (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Opérateur</Text>
                  <View style={styles.providerSelector}>
                    {['Orange Money', 'MTN MoMo', 'Moov Money'].map(provider => (
                      <TouchableOpacity
                        key={provider}
                        style={[
                          styles.providerOption,
                          newPayment.provider === provider && styles.selectedProviderOption
                        ]}
                        onPress={() => setNewPayment(prev => ({ ...prev, provider }))}
                      >
                        <Text style={[
                          styles.providerOptionText,
                          newPayment.provider === provider && styles.selectedProviderOptionText
                        ]}>
                          {provider}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  {newPayment.type === PAYMENT_TYPES.MOBILE_MONEY ? 'Numéro de téléphone' :
                   newPayment.type === PAYMENT_TYPES.CARD ? 'Numéro de carte' :
                   newPayment.type === PAYMENT_TYPES.BANK ? 'Numéro de compte' :
                   'Identifiant'}
                </Text>
                <TextInput
                  style={styles.formInput}
                  value={newPayment.number}
                  onChangeText={(text) => setNewPayment(prev => ({ ...prev, number: text }))}
                  placeholder={
                    newPayment.type === PAYMENT_TYPES.MOBILE_MONEY ? '07 XX XX XX XX' :
                    newPayment.type === PAYMENT_TYPES.CARD ? '1234 5678 9012 3456' :
                    newPayment.type === PAYMENT_TYPES.BANK ? 'CI05 XXXX XXXX XXXX XXXX' :
                    'Identifiant'
                  }
                  keyboardType={newPayment.type === PAYMENT_TYPES.MOBILE_MONEY ? 'phone-pad' : 'default'}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nom du moyen de paiement</Text>
                <TextInput
                  style={styles.formInput}
                  value={newPayment.name}
                  onChangeText={(text) => setNewPayment(prev => ({ ...prev, name: text }))}
                  placeholder="Mon Orange Money"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={addPaymentMethod}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={AppColors.gradient.primary}
                  style={styles.confirmButtonGradient}
                >
                  <Text style={styles.confirmButtonText}>Ajouter</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Modal de paiement */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Effectuer un paiement</Text>
              <TouchableOpacity 
                onPress={() => setShowPaymentModal(false)} 
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color={AppColors.mediumGray} />
              </TouchableOpacity>
            </View>

            {selectedPayment && (
              <View style={styles.selectedPaymentInfo}>
                <LinearGradient
                  colors={AppColors.gradient.accent}
                  style={styles.selectedPaymentIcon}
                >
                  <FontAwesome5 
                    name={getPaymentIcon(selectedPayment.type, selectedPayment.provider).name}
                    size={20}
                    color={getPaymentIcon(selectedPayment.type, selectedPayment.provider).color}
                  />
                </LinearGradient>
                <View>
                  <Text style={styles.selectedPaymentName}>{selectedPayment.name}</Text>
                  <Text style={styles.selectedPaymentDetails}>{selectedPayment.number}</Text>
                </View>
              </View>
            )}

            <View style={styles.paymentAmountSection}>
              <Text style={styles.amountLabel}>Montant à payer</Text>
              <TextInput
                style={styles.amountInput}
                value={paymentAmount}
                onChangeText={setPaymentAmount}
                placeholder="0 FCFA"
                keyboardType="numeric"
                editable={!isProcessing}
              />
            </View>

            <TouchableOpacity
              style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
              onPress={processPayment}
              disabled={isProcessing}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isProcessing ? ['#CCCCCC', '#999999'] : AppColors.gradient.primary}
                style={styles.payButtonGradient}
              >
                {isProcessing ? (
                  <Text style={styles.payButtonText}>Traitement en cours...</Text>
                ) : (
                  <>
                    <MaterialIcons name="payment" size={18} color={AppColors.white} />
                    <Text style={styles.payButtonText}>Payer maintenant</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: AppColors.darkText,
  },
  headerIconButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  paymentsList: {
    paddingHorizontal: 16,
  },
  paymentItem: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
  },
  defaultPayment: {
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.02)',
  },
  paymentContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  paymentLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  paymentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentText: {
    flex: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  paymentName: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
    flex: 1,
  },
  defaultPaymentName: {
    fontFamily: Fonts.semiBold,
  },
  defaultBadge: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: AppColors.white,
  },
  paymentProvider: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    marginBottom: 2,
  },
  paymentNumber: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    marginBottom: 4,
  },
  paymentBalance: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: AppColors.success,
    marginBottom: 2,
  },
  paymentExpiry: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    marginBottom: 2,
  },
  paymentLastUsed: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
  },
  paymentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setDefaultButton: {
    padding: 8,
    marginRight: 4,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: AppColors.darkText,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addButtonText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.white,
    marginLeft: 8,
  },
  // Styles pour les modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: AppColors.white,
    borderRadius: 20,
    width: width - 40,
      maxWidth: 400,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: AppColors.darkText,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalBody: {
    padding: 16,
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    backgroundColor: AppColors.white,
  },
  selectedTypeOption: {
    borderColor: AppColors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  typeOptionText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.darkText,
  },
  selectedTypeOptionText: {
    fontFamily: Fonts.medium,
    color: AppColors.primary,
  },
  providerSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  providerOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    backgroundColor: AppColors.white,
  },
  selectedProviderOption: {
    borderColor: AppColors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  providerOptionText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.darkText,
  },
  selectedProviderOptionText: {
    fontFamily: Fonts.medium,
    color: AppColors.primary,
  },
  formInput: {
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.darkText,
    backgroundColor: AppColors.white,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: AppColors.lightGray,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.mediumGray,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    padding: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.white,
  },
  paymentModalContent: {
    backgroundColor: AppColors.white,
    borderRadius: 20,
    width: width - 40,
    maxWidth: 400,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  selectedPaymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: AppColors.lightGray,
    marginBottom: 16,
  },
  selectedPaymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedPaymentName: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
  },
  selectedPaymentDetails: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
  },
  paymentAmountSection: {
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
    marginBottom: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: AppColors.darkText,
    backgroundColor: AppColors.white,
  },
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  payButtonText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.white,
    marginLeft: 8,
  },
});
