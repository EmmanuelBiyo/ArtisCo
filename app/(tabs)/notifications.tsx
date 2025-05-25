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
  withTiming,
  withSpring,
  SlideInRight
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

// Types de notifications
const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PROMOTION: 'promotion',
  SYSTEM: 'system',
  PAYMENT: 'payment',
  REVIEW: 'review'
};

// Icônes et couleurs par type
const getNotificationIcon = (type, isRead) => {
  const iconColor = isRead ? AppColors.mediumGray : AppColors.primary;
  
  switch (type) {
    case NOTIFICATION_TYPES.ORDER:
      return { name: 'shopping-bag', component: FontAwesome5, color: iconColor };
    case NOTIFICATION_TYPES.PROMOTION:
      return { name: 'local-offer', component: MaterialIcons, color: iconColor };
    case NOTIFICATION_TYPES.PAYMENT:
      return { name: 'credit-card', component: FontAwesome5, color: iconColor };
    case NOTIFICATION_TYPES.REVIEW:
      return { name: 'star', component: MaterialIcons, color: iconColor };
    default:
      return { name: 'notifications', component: Ionicons, color: iconColor };
  }
};

export default function Notifications() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: NOTIFICATION_TYPES.ORDER,
      title: 'Commande confirmée',
      message: 'Votre commande #12345 a été confirmée et sera livrée dans 2-3 jours.',
      time: '2 min',
      isRead: false,
      date: new Date()
    },
    {
      id: 2,
      type: NOTIFICATION_TYPES.PROMOTION,
      title: 'Offre spéciale !',
      message: '🎉 -20% sur tous les produits artisanaux. Profitez-en maintenant !',
      time: '1h',
      isRead: false,
      date: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      type: NOTIFICATION_TYPES.PAYMENT,
      title: 'Paiement effectué',
      message: 'Votre paiement de 45,000 FCFA a été traité avec succès.',
      time: '3h',
      isRead: true,
      date: new Date(Date.now() - 10800000)
    },
    {
      id: 4,
      type: NOTIFICATION_TYPES.REVIEW,
      title: 'Évaluez votre achat',
      message: 'Que pensez-vous de votre récent achat ? Partagez votre avis.',
      time: '1j',
      isRead: true,
      date: new Date(Date.now() - 86400000)
    },
    {
      id: 5,
      type: NOTIFICATION_TYPES.SYSTEM,
      title: 'Mise à jour disponible',
      message: 'Une nouvelle version de l\'application est disponible.',
      time: '2j',
      isRead: true,
      date: new Date(Date.now() - 172800000)
    }
  ]);

  // Animations
  const headerOpacity = useSharedValue(1);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    headerOpacity.value = withSpring(1);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simuler le rechargement des notifications
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    Alert.alert(
      'Marquer tout comme lu',
      'Voulez-vous marquer toutes les notifications comme lues ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: () => {
            setNotifications(prev => 
              prev.map(notification => ({ ...notification, isRead: true }))
            );
          }
        }
      ]
    );
  };

  const deleteNotification = (id) => {
    Alert.alert(
      'Supprimer la notification',
      'Voulez-vous vraiment supprimer cette notification ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(n => n.id !== id));
          }
        }
      ]
    );
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Effacer toutes les notifications',
      'Cette action supprimera définitivement toutes vos notifications.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Effacer tout', 
          style: 'destructive',
          onPress: () => setNotifications([])
        }
      ]
    );
  };

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const renderNotificationItem = (item, index) => {
    const icon = getNotificationIcon(item.type, item.isRead);
    const IconComponent = icon.component;

    return (
      <Animated.View
        key={item.id}
        entering={FadeInDown.delay(index * 100).duration(600)}
        style={[
          styles.notificationItem,
          !item.isRead && styles.unreadNotification
        ]}
      >
        <TouchableOpacity
          style={styles.notificationContent}
          onPress={() => markAsRead(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.notificationLeft}>
            <LinearGradient
              colors={!item.isRead ? AppColors.gradient.accent : ['#F5F5F5', '#E8E8E8']}
              style={styles.notificationIconContainer}
            >
              <IconComponent 
                name={icon.name} 
                size={18} 
                color={icon.color} 
              />
            </LinearGradient>
            
            <View style={styles.notificationText}>
              <View style={styles.notificationHeader}>
                <Text style={[
                  styles.notificationTitle,
                  !item.isRead && styles.unreadTitle
                ]}>
                  {item.title}
                </Text>
                {!item.isRead && <View style={styles.unreadDot} />}
              </View>
              
              <Text style={styles.notificationMessage}>
                {item.message}
              </Text>
              
              <Text style={styles.notificationTime}>
                {item.time}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteNotification(item.id)}
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
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.headerIconButton} 
            onPress={markAllAsRead}
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
        {notifications.length > 0 && (
          <Animated.View 
            style={styles.actionsBar}
            entering={FadeIn.delay(200).duration(600)}
          >
            {unreadCount > 0 && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={markAllAsRead}
                activeOpacity={0.7}
              >
                <MaterialIcons name="mark-email-read" size={16} color={AppColors.primary} />
                <Text style={styles.actionButtonText}>Tout marquer comme lu</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteActionButton]}
              onPress={clearAllNotifications}
              activeOpacity={0.7}
            >
              <MaterialIcons name="delete-outline" size={16} color={AppColors.error} />
              <Text style={[styles.actionButtonText, styles.deleteActionText]}>
                Effacer tout
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <View style={styles.notificationsList}>
            {notifications.map((item, index) => renderNotificationItem(item, index))}
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
              <Ionicons name="notifications-off" size={48} color={AppColors.primary} />
            </LinearGradient>
            <Text style={styles.emptyTitle}>Aucune notification</Text>
            <Text style={styles.emptyMessage}>
              Vous n'avez aucune notification pour le moment.
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
  notificationsList: {
    paddingHorizontal: 16,
  },
  notificationItem: {
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
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.02)',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  notificationLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.darkText,
    flex: 1,
  },
  unreadTitle: {
    fontFamily: Fonts.semiBold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
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