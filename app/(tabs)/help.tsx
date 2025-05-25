
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
  TextInput,
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
    accent: ['#F7EAB5', '#E6C55C'],
  },
  success: '#4CAF50',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#007AFF',
};

const Fonts = {
  light: 'Inter-Light',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

const { width } = Dimensions.get('window');

// Types de FAQs
const FAQ_TYPES = {
  GENERAL: 'general',
  PAYMENT: 'payment',
  DELIVERY: 'delivery',
  OTHER: 'other',
};

// Icônes par type de FAQ
const getFaqIcon = (type) => {
  switch (type) {
    case FAQ_TYPES.GENERAL:
      return { name: 'info-circle', component: FontAwesome5, color: AppColors.primary };
    case FAQ_TYPES.PAYMENT:
      return { name: 'credit-card', component: FontAwesome5, color: AppColors.info };
    case FAQ_TYPES.DELIVERY:
      return { name: 'truck', component: FontAwesome5, color: AppColors.success };
    default:
      return { name: 'question-circle', component: FontAwesome5, color: AppColors.accent };
  }
};

const getFaqTypeLabel = (type) => {
  switch (type) {
    case FAQ_TYPES.GENERAL:
      return 'Général';
    case FAQ_TYPES.PAYMENT:
      return 'Paiement';
    case FAQ_TYPES.DELIVERY:
      return 'Livraison';
    default:
      return 'Autre';
  }
};

export default function Help() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      type: FAQ_TYPES.GENERAL,
      question: 'Comment créer un compte ?',
      answer: 'Pour créer un compte, allez sur l\'écran Profil et cliquez sur "S\'inscrire". Remplissez les informations requises et validez.',
      createdAt: new Date(Date.now() - 86400000 * 30),
    },
    {
      id: 2,
      type: FAQ_TYPES.PAYMENT,
      question: 'Quels moyens de paiement sont acceptés ?',
      answer: 'Nous acceptons Orange Money, MTN MoMo, les cartes Visa/Mastercard, et les virements bancaires.',
      createdAt: new Date(Date.now() - 86400000 * 15),
    },
    {
      id: 3,
      type: FAQ_TYPES.DELIVERY,
      question: 'Quels sont les délais de livraison ?',
      answer: 'Les délais de livraison varient de 1 à 3 jours ouvrables à Abidjan, et jusqu\'à 7 jours pour les autres régions.',
      createdAt: new Date(Date.now() - 86400000 * 7),
    },
  ]);

  const [formData, setFormData] = useState({
    type: FAQ_TYPES.GENERAL,
    question: '',
    answer: '',
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

  const deleteFaq = (id) => {
    Alert.alert(
      'Supprimer la FAQ',
      'Voulez-vous vraiment supprimer cette question ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setFaqs((prev) => prev.filter((faq) => faq.id !== id));
          },
        },
      ]
    );
  };

  const openFaqModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({ ...faq });
    } else {
      setEditingFaq(null);
      setFormData({
        type: FAQ_TYPES.GENERAL,
        question: '',
        answer: '',
      });
    }
    setModalVisible(true);
  };

  const closeFaqModal = () => {
    setModalVisible(false);
    setEditingFaq(null);
  };

  const saveFaq = () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (editingFaq) {
      // Modification
      setFaqs((prev) =>
        prev.map((faq) =>
          faq.id === editingFaq.id
            ? { ...formData, id: editingFaq.id, createdAt: editingFaq.createdAt }
            : faq
        )
      );
    } else {
      // Nouvelle FAQ
      const newFaq = {
        ...formData,
        id: Date.now(),
        createdAt: new Date(),
      };
      setFaqs((prev) => [...prev, newFaq]);
    }

    closeFaqModal();
  };

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: modalScale.value }],
  }));

  const renderFaqItem = (item, index) => {
    const icon = getFaqIcon(item.type);
    const IconComponent = icon.component;

    return (
      <Animated.View
        key={item.id}
        entering={FadeInDown.delay(index * 100).duration(600)}
        style={styles.faqItem}
      >
        <View style={styles.faqContent}>
          <View style={styles.faqLeft}>
            <LinearGradient
              colors={AppColors.gradient.accent}
              style={styles.faqIconContainer}
            >
              <IconComponent name={icon.name} size={20} color={icon.color} />
            </LinearGradient>

            <View style={styles.faqDetails}>
              <Text style={styles.faqType}>{getFaqTypeLabel(item.type)}</Text>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Text style={styles.faqAnswer}>{item.answer}</Text>
              <Text style={styles.faqCreatedAt}>
                Ajouté le {item.createdAt.toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </View>

          <View style={styles.faqActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openFaqModal(item)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="edit" size={20} color={AppColors.info} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteFaq(item.id)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="delete-outline" size={20} color={AppColors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderFaqForm = () => (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      {/* Type de FAQ */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Type de question *</Text>
        <View style={styles.typeSelector}>
          {Object.values(FAQ_TYPES).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeOption,
                formData.type === type && styles.selectedType,
              ]}
              onPress={() => setFormData((prev) => ({ ...prev, type }))}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.typeOptionText,
                  formData.type === type && styles.selectedTypeText,
                ]}
              >
                {getFaqTypeLabel(type)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Question */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Question *</Text>
        <TextInput
          style={styles.formInput}
          value={formData.question}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, question: text }))}
          placeholder="Ex: Comment passer une commande ?"
          placeholderTextColor={AppColors.mediumGray}
        />
      </View>

      {/* Réponse */}
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Réponse *</Text>
        <TextInput
          style={[styles.formInput, styles.textArea]}
          value={formData.answer}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, answer: text }))}
          placeholder="Entrez la réponse détaillée..."
          placeholderTextColor={AppColors.mediumGray}
          multiline
          numberOfLines={4}
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
            <Text style={styles.headerTitle}>Aide & FAQ</Text>
            {faqs.length > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{faqs.length}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => openFaqModal()}
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
        {faqs.length > 0 && (
          <Animated.View style={styles.infoBar} entering={FadeIn.delay(200).duration(600)}>
            <LinearGradient colors={AppColors.gradient.accent} style={styles.infoContainer}>
              <FontAwesome5 name="info-circle" size={16} color={AppColors.primary} />
              <Text style={styles.infoText}>
                Consultez les questions fréquentes ou ajoutez vos propres questions pour référence.
              </Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* FAQs List */}
        {faqs.length > 0 ? (
          <View style={styles.faqsList}>
            {faqs.map((item, index) => renderFaqItem(item, index))}
          </View>
        ) : (
          <Animated.View style={styles.emptyState} entering={FadeIn.delay(300).duration(800)}>
            <LinearGradient colors={AppColors.gradient.accent} style={styles.emptyIconContainer}>
              <FontAwesome5 name="question-circle" size={48} color={AppColors.primary} />
            </LinearGradient>
            <Text style={styles.emptyTitle}>Aucune FAQ enregistrée</Text>
            <Text style={styles.emptyMessage}>
              Ajoutez des questions fréquentes pour obtenir de l'aide rapidement.
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => openFaqModal()}
              activeOpacity={0.8}
            >
              <LinearGradient colors={AppColors.gradient.primary} style={styles.addButtonGradient}>
                <Ionicons name="add" size={18} color={AppColors.white} />
                <Text style={styles.addButtonText}>Ajouter une FAQ</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Add FAQ FAB */}
        {faqs.length > 0 && (
          <Animated.View style={styles.fabContainer} entering={FadeIn.delay(400).duration(600)}>
            <TouchableOpacity
              style={styles.fab}
              onPress={() => openFaqModal()}
              activeOpacity={0.8}
            >
              <LinearGradient colors={AppColors.gradient.primary} style={styles.fabGradient}>
                <Ionicons name="add" size={24} color={AppColors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      {/* Modal pour ajouter/modifier une FAQ */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeFaqModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
            <LinearGradient colors={AppColors.gradient.primary} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingFaq ? 'Modifier la FAQ' : 'Nouvelle FAQ'}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeFaqModal}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={AppColors.darkText} />
              </TouchableOpacity>
            </LinearGradient>

            {renderFaqForm()}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeFaqModal}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveFaq}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={AppColors.gradient.primary}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>{editingFaq ? 'Modifier' : 'Ajouter'}</Text>
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
  faqsList: {
    paddingHorizontal: 16,
  },
  faqItem: {
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
  faqContent: {
    flexDirection: 'row',
    padding: 16,
  },
  faqLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  faqIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  faqDetails: {
    flex: 1,
  },
  faqType: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: AppColors.primary,
    marginBottom: 4,
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: AppColors.darkText,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.darkText,
    marginBottom: 8,
    lineHeight: 20,
  },
  faqCreatedAt: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
  },
  faqActions: {
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
    minHeight: 100,
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
