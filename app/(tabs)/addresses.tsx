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
  Modal,
  TextInput
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
  withSpring,
  SlideInRight,
  FadeOut
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Palette de couleurs (même que le profil)
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

// Types d'adresses
const ADDRESS_TYPES = {
  HOME: 'home',
  WORK: 'work',
  OTHER: 'other'
};

// Icônes par type d'adresse
const getAddressIcon = (type) => {
  switch (type) {
    case ADDRESS_TYPES.HOME:
      return { name: 'home', component: Ionicons, color: AppColors.primary };
    case ADDRESS_TYPES.WORK:
      return { name: 'business', component: MaterialIcons, color: AppColors.info };
    default:
      return { name: 'location-outline', component: Ionicons, color: AppColors.accent };
  }
};

const getAddressTypeLabel = (type) => {
  switch (type) {
    case ADDRESS_TYPES.HOME:
      return 'Domicile';
    case ADDRESS_TYPES.WORK:
      return 'Bureau';
    default:
      return 'Autre';
  }
};

export default function Addresses() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: ADDRESS_TYPES.HOME,
      name: 'Domicile',
      fullName: 'Jean Dupont',
      phone: '+225 07 12 34 56 78',
      address: '12 Rue des Artisans, Cocody',
      city: 'Abidjan',
      postalCode: '01 BP 1234',
      country: 'Côte d\'Ivoire',
      isDefault: true,
      createdAt: new Date(Date.now() - 86400000 * 30)
    },
    {
      id: 2,
      type: ADDRESS_TYPES.WORK,
      name: 'Bureau',
      fullName: 'Jean Dupont',
      phone: '+225 07 12 34 56 78',
      address: '456 Boulevard Lagunaire, Plateau',
      city: 'Abidjan',
      postalCode: '01 BP 5678',
      country: 'Côte d\'Ivoire',
      isDefault: false,
      createdAt: new Date(Date.now() - 86400000 * 15)
    },
    {
      id: 3,
      type: ADDRESS_TYPES.OTHER,
      name: 'Chez ma sœur',
      fullName: 'Marie Dupont',
      phone: '+225 05 98 76 54 32',
      address: '789 Quartier Résidentiel, Yopougon',
      city: 'Abidjan',
      postalCode: '01 BP 9012',
      country: 'Côte d\'Ivoire',
      isDefault: false,
      createdAt: new Date(Date.now() - 86400000 * 7)
    }
  ]);

  const [formData, setFormData] = useState({
    type: ADDRESS_TYPES.HOME,
    name: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Côte d\'Ivoire'
  });

  // Animations
  const headerOpacity = useSharedValue(1);
  const modalScale = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withSpring(1);
  }, []);

  useEffect(() => {
    modalScale.value = modalVisible ? withSpring(1) : withTiming(0);
  }, [modalVisible]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const setDefaultAddress = (id) => {
    setAddresses(prev => 
      prev.map(address => ({
        ...address,
        isDefault: address.id === id
      }))
    );
  };

  const deleteAddress = (id) => {
    const address = addresses.find(addr => addr.id === id);
    
    if (address?.isDefault && addresses.length > 1) {
      Alert.alert(
        'Adresse par défaut',
        'Vous ne pouvez pas supprimer l\'adresse par défaut. Définissez d\'abord une autre adresse comme défaut.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Supprimer l\'adresse',
      'Voulez-vous vraiment supprimer cette adresse ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            setAddresses(prev => prev.filter(addr => addr.id !== id));
          }
        }
      ]
    );
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({ ...address });
    } else {
      setEditingAddress(null);
      setFormData({
        type: ADDRESS_TYPES.HOME,
        name: '',
        fullName: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Côte d\'Ivoire'
      });
    }
    setModalVisible(true);
  };

  const closeAddressModal = () => {
    setModalVisible(false);
    setEditingAddress(null);
  };

  const saveAddress = () => {
    if (!formData.name || !formData.fullName || !formData.phone || !formData.address || !formData.city) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (editingAddress) {
      // Modification
      setAddresses(prev => 
        prev.map(addr => 
          addr.id === editingAddress.id 
            ? { ...formData, id: editingAddress.id, createdAt: editingAddress.createdAt, isDefault: editingAddress.isDefault }
            : addr
        )
      );
    } else {
      // Nouvelle adresse
      const newAddress = {
        ...formData,
        id: Date.now(),
        isDefault: addresses.length === 0,
        createdAt: new Date()
      };
      setAddresses(prev => [...prev, newAddress]);
    }

    closeAddressModal();
  };

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
  }));

  const renderAddressItem = (item, index) => {
    const icon = getAddressIcon(item.type);
    const IconComponent = icon.component;

    return (
      <Animated.View
        key={item.id}
        entering={FadeInDown.delay(index * 100).duration(600)}
        style={[
          styles.addressItem,
          item.isDefault && styles.defaultAddress
        ]}
      >
        <View style={styles.addressContent}>
          <View style={styles.addressLeft}>
            <LinearGradient
              colors={item.isDefault ? AppColors.gradient.primary : AppColors.gradient.accent}
              style={styles.addressIconContainer}
            >
              <IconComponent 
                name={icon.name} 
                size={20} 
                color={icon.color} 
              />
            </LinearGradient>
            
            <View style={styles.addressDetails}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressName}>
                  {item.name}
                </Text>
                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Défaut</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.addressFullName}>
                {item.fullName}
              </Text>
              
              <Text style={styles.addressPhone}>
                {item.phone}
              </Text>
              
              <Text style={styles.addressLocation}>
                {item.address}
              </Text>
              
              <Text style={styles.addressCity}>
                {item.city}, {item.postalCode}
              </Text>
              
              <Text style={styles.addressCountry}>
                {item.country}
              </Text>
            </View>
          </View>

          <View style={styles.addressActions}>
            {!item.isDefault && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setDefaultAddress(item.id)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="star-outline" size={20} color={AppColors.primary} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openAddressModal(item)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="edit" size={20} color={AppColors.info} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteAddress(item.id)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="delete-outline" size={20} color={AppColors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderAddressForm = () => (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      {/* Type d'adresse */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Type d'adresse *</Text>
        <View style={styles.typeSelector}>
          {Object.values(ADDRESS_TYPES).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeOption,
                formData.type === type && styles.selectedType
              ]}
              onPress={() => setFormData(prev => ({ ...prev, type }))}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.typeOptionText,
                formData.type === type && styles.selectedTypeText
              ]}>
                {getAddressTypeLabel(type)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Nom de l'adresse */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Nom de l'adresse *</Text>
        <TextInput
          style={styles.formInput}
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Ex: Domicile, Bureau..."
          placeholderTextColor={AppColors.mediumGray}
        />
      </View>

      {/* Nom complet */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Nom complet *</Text>
        <TextInput
          style={styles.formInput}
          value={formData.fullName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
          placeholder="Nom et prénom"
          placeholderTextColor={AppColors.mediumGray}
        />
      </View>

      {/* Téléphone */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Téléphone *</Text>
        <TextInput
          style={styles.formInput}
          value={formData.phone}
          onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
          placeholder="+225 XX XX XX XX XX"
          placeholderTextColor={AppColors.mediumGray}
          keyboardType="phone-pad"
        />
      </View>

      {/* Adresse */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Adresse complète *</Text>
        <TextInput
          style={[styles.formInput, styles.textArea]}
          value={formData.address}
          onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
          placeholder="Numéro, rue, quartier..."
          placeholderTextColor={AppColors.mediumGray}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Ville */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Ville *</Text>
        <TextInput
          style={styles.formInput}
          value={formData.city}
          onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
          placeholder="Ex: Abidjan"
          placeholderTextColor={AppColors.mediumGray}
        />
      </View>

      {/* Code postal */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Code postal</Text>
        <TextInput
          style={styles.formInput}
          value={formData.postalCode}
          onChangeText={(text) => setFormData(prev => ({ ...prev, postalCode: text }))}
          placeholder="Ex: 01 BP 1234"
          placeholderTextColor={AppColors.mediumGray}
        />
      </View>

      {/* Pays */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Pays</Text>
        <TextInput
          style={styles.formInput}
          value={formData.country}
          onChangeText={(text) => setFormData(prev => ({ ...prev, country: text }))}
          placeholder="Pays"
          placeholderTextColor={AppColors.mediumGray}
        />
      </View>
    </ScrollView>
  );

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
            <Text style={styles.headerTitle}>Mes Adresses</Text>
            {addresses.length > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{addresses.length}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.headerIconButton} 
            onPress={() => openAddressModal()}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={22} color={AppColors.darkText} />
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
        {/* Info Bar */}
        {addresses.length > 0 && (
          <Animated.View 
            style={styles.infoBar}
            entering={FadeIn.delay(200).duration(600)}
          >
            <LinearGradient
              colors={AppColors.gradient.accent}
              style={styles.infoContainer}
            >
              <FontAwesome5 name="info-circle" size={16} color={AppColors.primary} />
              <Text style={styles.infoText}>
                L'adresse par défaut sera utilisée automatiquement lors de vos commandes.
              </Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Addresses List */}
        {addresses.length > 0 ? (
          <View style={styles.addressesList}>
            {addresses.map((item, index) => renderAddressItem(item, index))}
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
              <MaterialIcons name="location-off" size={48} color={AppColors.primary} />
            </LinearGradient>
            <Text style={styles.emptyTitle}>Aucune adresse enregistrée</Text>
            <Text style={styles.emptyMessage}>
              Ajoutez vos adresses de livraison pour faciliter vos commandes.
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => openAddressModal()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={AppColors.gradient.primary}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={18} color={AppColors.white} />
                <Text style={styles.addButtonText}>Ajouter une adresse</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Add Address FAB */}
        {addresses.length > 0 && (
          <Animated.View 
            style={styles.fabContainer}
            entering={FadeIn.delay(400).duration(600)}
          >
            <TouchableOpacity
              style={styles.fab}
              onPress={() => openAddressModal()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={AppColors.gradient.primary}
                style={styles.fabGradient}
              >
                <Ionicons name="add" size={24} color={AppColors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      {/* Modal pour ajouter/modifier une adresse */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeAddressModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
            <LinearGradient
              colors={AppColors.gradient.primary}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>
                {editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeAddressModal}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={AppColors.darkText} />
              </TouchableOpacity>
            </LinearGradient>

            {renderAddressForm()}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeAddressModal}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveAddress}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={AppColors.gradient.primary}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {editingAddress ? 'Modifier' : 'Ajouter'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
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
  headerBadge: {
    backgroundColor: AppColors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: AppColors.white,
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
    paddingBottom: 100,
  },
  infoBar: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.darkText,
    marginLeft: 8,
    lineHeight: 18,
  },
  addressesList: {
    paddingHorizontal: 16,
  },
  addressItem: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
  },
  defaultAddress: {
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.02)',
  },
  addressContent: {
    flexDirection: 'row',
    padding: 16,
  },
  addressLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  addressIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: AppColors.darkText,
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: AppColors.white,
  },
  addressFullName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
    marginBottom: 4,
  },
  addressPhone: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    marginBottom: 6,
  },
  addressLocation: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.darkText,
    marginBottom: 4,
  },
  addressCity: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    marginBottom: 2,
  },
  addressCountry: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
  },
  addressActions: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
    marginBottom: 4,
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
    textAlign: 'center',
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
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  addButtonText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.white,
    marginLeft: 8,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 20,
  },
  fab: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: 'rgba(212, 175, 55, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
      },
  modalContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 20,
    width: width - 40,
    maxWidth: 400,
    maxHeight: Dimensions.get('window').height * 0.85,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: AppColors.darkText,
  },
  modalCloseButton: {
    padding: 8,
  },
  formContainer: {
    padding: 16,
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
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    backgroundColor: AppColors.white,
  },
  selectedType: {
    borderColor: AppColors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  typeOptionText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.darkText,
  },
  selectedTypeText: {
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  saveButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.white,
  },
});