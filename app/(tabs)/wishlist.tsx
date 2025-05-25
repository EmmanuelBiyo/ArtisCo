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
  Image
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

export default function Wishlist() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Collier Artisanal en Or',
      price: 85000,
      originalPrice: 95000,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
      category: 'Bijoux',
      rating: 4.8,
      reviews: 24,
      inStock: true,
      discount: 10,
      addedDate: new Date(Date.now() - 86400000 * 2) // 2 jours
    },
    {
      id: 2,
      name: 'Sac Traditionnel Tissé',
      price: 35000,
      originalPrice: 42000,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      category: 'Accessoires',
      rating: 4.6,
      reviews: 18,
      inStock: true,
      discount: 17,
      addedDate: new Date(Date.now() - 86400000 * 5) // 5 jours
    },
    {
      id: 3,
      name: 'Poterie Décorative',
      price: 25000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      category: 'Décoration',
      rating: 4.9,
      reviews: 31,
      inStock: false,
      discount: null,
      addedDate: new Date(Date.now() - 86400000 * 7) // 7 jours
    },
    {
      id: 4,
      name: 'Bracelet en Perles',
      price: 15000,
      originalPrice: 18000,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
      category: 'Bijoux',
      rating: 4.5,
      reviews: 12,
      inStock: true,
      discount: 17,
      addedDate: new Date(Date.now() - 86400000 * 10) // 10 jours
    },
    {
      id: 5,
      name: 'Sculpture en Bois',
      price: 75000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1544967882-6abeb8f447a4?w=400',
      category: 'Art',
      rating: 5.0,
      reviews: 8,
      inStock: true,
      discount: null,
      addedDate: new Date(Date.now() - 86400000 * 14) // 14 jours
    }
  ]);

  // Animations
  const headerOpacity = useSharedValue(1);
  const totalItems = wishlistItems.length;

  useEffect(() => {
    headerOpacity.value = withSpring(1);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simuler le rechargement de la wishlist
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const removeFromWishlist = (id) => {
    Alert.alert(
      'Retirer de la liste de souhaits',
      'Voulez-vous vraiment retirer cet article de votre liste de souhaits ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Retirer', 
          style: 'destructive',
          onPress: () => {
            setWishlistItems(prev => prev.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  const clearWishlist = () => {
    Alert.alert(
      'Vider la liste de souhaits',
      'Cette action supprimera tous les articles de votre liste de souhaits.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Vider', 
          style: 'destructive',
          onPress: () => setWishlistItems([])
        }
      ]
    );
  };

  const addToCart = (item) => {
    if (!item.inStock) {
      Alert.alert('Produit indisponible', 'Ce produit n\'est actuellement pas en stock.');
      return;
    }
    
    Alert.alert(
      'Ajouté au panier',
      `${item.name} a été ajouté à votre panier.`,
      [{ text: 'OK' }]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaine${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`;
    return `Il y a ${Math.ceil(diffDays / 30)} mois`;
  };

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const renderWishlistItem = (item, index) => {
    return (
      <Animated.View
        key={item.id}
        entering={FadeInDown.delay(index * 100).duration(600)}
        style={styles.wishlistItem}
      >
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          
          {/* Badge de réduction */}
          {item.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{item.discount}%</Text>
            </View>
          )}
          
          {/* Badge de stock */}
          {!item.inStock && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>Rupture</Text>
            </View>
          )}
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <View style={styles.itemTitleContainer}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFromWishlist(item.id)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="favorite" size={20} color={AppColors.error} />
            </TouchableOpacity>
          </View>
          
          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < Math.floor(item.rating) ? "star" : "star-outline"}
                  size={12}
                  color={AppColors.accent}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {item.rating} ({item.reviews} avis)
            </Text>
          </View>
          
          {/* Prix */}
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>
              {formatPrice(item.price)}
            </Text>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>
                {formatPrice(item.originalPrice)}
              </Text>
            )}
          </View>
          
          {/* Date d'ajout */}
          <Text style={styles.addedDate}>
            Ajouté {formatDate(item.addedDate)}
          </Text>
          
          {/* Actions */}
          <View style={styles.itemActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.viewButton
              ]}
              onPress={() => router.push(`/product/${item.id}`)}
              activeOpacity={0.8}
            >
              <Ionicons name="eye-outline" size={16} color={AppColors.primary} />
              <Text style={styles.viewButtonText}>Voir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.cartButton,
                !item.inStock && styles.disabledButton
              ]}
              onPress={() => addToCart(item)}
              activeOpacity={0.8}
              disabled={!item.inStock}
            >
              <LinearGradient
                colors={item.inStock ? AppColors.gradient.primary : ['#E8E8E8', '#CCCCCC']}
                style={styles.cartButtonGradient}
              >
                <Ionicons 
                  name="cart-outline" 
                  size={16} 
                  color={item.inStock ? AppColors.white : AppColors.mediumGray} 
                />
                <Text style={[
                  styles.cartButtonText,
                  !item.inStock && styles.disabledButtonText
                ]}>
                  {item.inStock ? 'Ajouter' : 'Indisponible'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
            onPress={() => router.back()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color={AppColors.darkText} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Ma Liste de Souhaits</Text>
            {totalItems > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{totalItems}</Text>
              </View>
            )}
          </View>
          
          {totalItems > 0 && (
            <TouchableOpacity 
              style={styles.headerIconButton} 
              onPress={clearWishlist}
              activeOpacity={0.7}
            >
              <MaterialIcons name="clear-all" size={22} color={AppColors.darkText} />
            </TouchableOpacity>
          )}
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
        {/* Stats Bar */}
        {wishlistItems.length > 0 && (
          <Animated.View 
            style={styles.statsBar}
            entering={FadeIn.delay(200).duration(600)}
          >
            <LinearGradient
              colors={AppColors.gradient.accent}
              style={styles.statsContainer}
            >
              <View style={styles.statItem}>
                <FontAwesome5 name="heart" size={16} color={AppColors.primary} />
                <Text style={styles.statNumber}>{totalItems}</Text>
                <Text style={styles.statLabel}>Articles</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <FontAwesome5 name="tag" size={16} color={AppColors.primary} />
                <Text style={styles.statNumber}>
                  {wishlistItems.filter(item => item.discount).length}
                </Text>
                <Text style={styles.statLabel}>En promo</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <FontAwesome5 name="check-circle" size={16} color={AppColors.success} />
                <Text style={styles.statNumber}>
                  {wishlistItems.filter(item => item.inStock).length}
                </Text>
                <Text style={styles.statLabel}>Disponibles</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Wishlist Items */}
        {wishlistItems.length > 0 ? (
          <View style={styles.wishlistContainer}>
            {wishlistItems.map((item, index) => renderWishlistItem(item, index))}
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
              <MaterialIcons name="favorite-border" size={48} color={AppColors.primary} />
            </LinearGradient>
            <Text style={styles.emptyTitle}>Votre liste de souhaits est vide</Text>
            <Text style={styles.emptyMessage}>
              Découvrez nos produits artisanaux et ajoutez vos coups de cœur à votre liste de souhaits.
            </Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => router.push('/shop')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={AppColors.gradient.primary}
                style={styles.shopButtonGradient}
              >
                <FontAwesome5 name="shopping-bag" size={18} color={AppColors.white} />
                <Text style={styles.shopButtonText}>Découvrir la boutique</Text>
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
    paddingBottom: 40,
  },
  statsBar: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: AppColors.darkText,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  wishlistContainer: {
    paddingHorizontal: 16,
  },
  wishlistItem: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
  },
  itemImageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: AppColors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: AppColors.white,
  },
  stockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: AppColors.mediumGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: AppColors.white,
  },
  itemDetails: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: AppColors.darkText,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
  },
  removeButton: {
    padding: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: AppColors.primary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    textDecorationLine: 'line-through',
  },
  addedDate: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: AppColors.mediumGray,
    marginBottom: 16,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  viewButton: {
    backgroundColor: AppColors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.primary,
    marginLeft: 6,
  },
  cartButton: {
    flex: 2,
  },
  cartButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  cartButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: AppColors.white,
    marginLeft: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledButtonText: {
    color: AppColors.mediumGray,
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
  shopButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  shopButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  shopButtonText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: AppColors.white,
    marginLeft: 8,
  },
});