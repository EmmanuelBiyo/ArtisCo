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
  withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Palette de couleurs (identique à Notifications)
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

// Types de commandes
const ORDER_TYPES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DELIVERED: 'delivered'
};

// Icônes et couleurs par type
const getOrderIcon = (status, isCompleted) => {
  const iconColor = isCompleted ? AppColors.mediumGray : AppColors.primary;

  switch (status) {
    case ORDER_TYPES.PENDING:
      return { name: 'hourglass', component: FontAwesome5, color: iconColor };
    case ORDER_TYPES.IN_PROGRESS:
      return { name: 'tools', component: FontAwesome5, color: iconColor };
    case ORDER_TYPES.COMPLETED:
      return { name: 'check-circle', component: MaterialIcons, color: iconColor };
    case ORDER_TYPES.DELIVERED:
      return { name: 'truck', component: FontAwesome5, color: iconColor };
    default:
      return { name: 'shopping-cart', component: FontAwesome5, color: iconColor };
  }
};

export default function Orders() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([
    {
      id: 1,
      type: 'order',
      artisan: 'Marie Kouakou',
      service: 'Couture - Robe sur mesure',
      status: ORDER_TYPES.PENDING,
      amount: '35,000 FCFA',
      time: '5 min',
      date: new Date(),
      isCompleted: false
    },
    {
      id: 2,
      type: 'order',
      artisan: 'Digbeu Franck',
      service: 'Plomberie - Réparation fuite',
      status: ORDER_TYPES.IN_PROGRESS,
      amount: '25,000 FCFA',
      time: '2h',
      date: new Date(Date.now() - 7200000),
      isCompleted: false
    },
    {
      id: 3,
      type: 'order',
      artisan: 'Jean Yao',
      service: 'Menuiserie - Table en bois',
      status: ORDER_TYPES.COMPLETED,
      amount: '80,000 FCFA',
      time: '1j',
      date: new Date(Date.now() - 86400000),
      isCompleted: true
    },
    {
      id: 4,
      type: 'order',
      artisan: 'Awa Traoré',
      service: 'Poterie - Vase décoratif',
      status: ORDER_TYPES.DELIVERED,
      amount: '15,000 FCFA',
      time: '2j',
      date: new Date(Date.now() - 172800000),
      isCompleted: true
    }
  ]);

  // Animations
  const headerOpacity = useSharedValue(1);
  const pendingCount = orders.filter(o => !o.isCompleted).length;

  useEffect(() => {
    headerOpacity.value = withSpring(1);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simuler le rechargement des commandes
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const markAsCompleted = (id) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, isCompleted: true, status: ORDER_TYPES.COMPLETED } : order
      )
    );
  };

  const markAllAsCompleted = () => {
    Alert.alert(
      'Marquer tout comme terminé',
      'Voulez-vous marquer toutes les commandes comme terminées ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            setOrders(prev =>
              prev.map(order => ({ ...order, isCompleted: true, status: ORDER_TYPES.COMPLETED }))
            );
          }
        }
      ]
    );
  };

  const deleteOrder = (id) => {
    Alert.alert(
      'Supprimer la commande',
      'Voulez-vous vraiment supprimer cette commande ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setOrders(prev => prev.filter(o => o.id !== id));
          }
        }
      ]
    );
  };

  const clearAllOrders = () => {
    Alert.alert(
      'Effacer toutes les commandes',
      'Cette action supprimera définitivement toutes vos commandes.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer tout',
          style: 'destructive',
          onPress: () => setOrders([])
        }
      ]
    );
  };

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const renderOrderItem = (item, index) => {
    const icon = getOrderIcon(item.status, item.isCompleted);
    const IconComponent = icon.component;

    return (
      <Animated.View
        key={item.id}
        entering={FadeInDown.delay(index * 100).duration(600)}
        style={[
          styles.orderItem,
          !item.isCompleted && styles.pendingOrder
        ]}
      >
        <TouchableOpacity
          style={styles.orderContent}
          onPress={() => !item.isCompleted && markAsCompleted(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.orderLeft}>
            <LinearGradient
              colors={!item.isCompleted ? AppColors.gradient.accent : ['#F5F5F5', '#E8E8E8']}
              style={styles.orderIconContainer}
            >
              <IconComponent
                name={icon.name}
                size={18}
                color={icon.color}
              />
            </LinearGradient>

            <View style={styles.orderText}>
              <View style={styles.orderHeader}>
                <Text style={[
                  styles.orderTitle,
                  !item.isCompleted && styles.pendingTitle
                ]}>
                  {item.service}
                </Text>
                {!item.isCompleted && <View style={styles.pendingDot} />}
              </View>

              <Text style={styles.orderDetails}>
                Artisan: {item.artisan}
              </Text>
              <Text style={styles.orderDetails}>
                Montant: {item.amount}
              </Text>
              <Text style={styles.orderStatus}>
                Statut: {item.status === ORDER_TYPES.PENDING ? 'En attente' :
                         item.status === ORDER_TYPES.IN_PROGRESS ? 'En cours' :
                         item.status === ORDER_TYPES.COMPLETED ? 'Terminée' :
                         'Livrée'}
              </Text>
              <Text style={styles.orderTime}>
                {item.time}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteOrder(item.id)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="close" size={20} color={AppColors.mediumGray} />
          </TouchableOpacity>
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
            <Text style={styles.headerTitle}>Mes Commandes</Text>
            {pendingCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{pendingCount}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={markAllAsCompleted}
            activeOpacity={0.7}
          >
            <MaterialIcons name="done-all" size={22} color={AppColors.darkText} />
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
        {/* Actions Bar */}
        {orders.length > 0 && (
          <Animated.View
            style={styles.actionsBar}
            entering={FadeIn.delay(200).duration(600)}
          >
            {pendingCount > 0 && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={markAllAsCompleted}
                activeOpacity={0.7}
              >
                <MaterialIcons name="check-circle-outline" size={16} color={AppColors.primary} />
                <Text style={styles.actionButtonText}>Tout marquer comme terminé</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteActionButton]}
              onPress={clearAllOrders}
              activeOpacity={0.7}
            >
              <MaterialIcons name="delete-outline" size={16} color={AppColors.error} />
              <Text style={[styles.actionButtonText, styles.deleteActionText]}>
                Effacer tout
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Orders List */}
        {orders.length > 0 ? (
          <View style={styles.ordersList}>
            {orders.map((item, index) => renderOrderItem(item, index))}
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
              <FontAwesome5 name="shopping-cart" size={48} color={AppColors.primary} />
            </LinearGradient>
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptyMessage}>
              Vous n'avez aucune commande pour le moment.
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={onRefresh}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={AppColors.gradient.primary}
                style={styles.refreshButtonGradient}
              >
                <Ionicons name="refresh" size={18} color={AppColors.white} />
                <Text style={styles.refreshButtonText}>Actualiser</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
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
    backgroundColor: AppColors.error,
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
    paddingBottom: 40,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  deleteActionButton: {
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  actionButtonText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: AppColors.primary,
    marginLeft: 6,
  },
  deleteActionText: {
    color: AppColors.error,
  },
  ordersList: {
    paddingHorizontal: 16,
  },
  orderItem: {
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
  pendingOrder: {
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.02)',
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  orderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  orderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderText: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderTitle: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
    flex: 1,
  },
  pendingTitle: {
    fontFamily: Fonts.semiBold,
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
    marginLeft: 8,
  },
  orderDetails: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    lineHeight: 20,
  },
  orderStatus: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    lineHeight: 20,
    marginBottom: 8,
  },
  orderTime: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
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
  refreshButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  refreshButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  refreshButtonText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.white,
    marginLeft: 8,
  },
});