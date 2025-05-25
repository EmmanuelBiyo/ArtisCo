import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Palette de couleurs luxueuse
const LuxuryColors = {
  light: {
    gold: '#D4AF37',
    lightGold: '#F4E9CD',
    darkGold: '#A58123',
    ivory: '#FFFFF0',
    cream: '#FFFDD0',
    charcoal: '#36454F',
    deepBlue: '#1A237E',
    offWhite: '#FAF9F6',
    champagne: '#F7E7CE',
    background: '#FAF9F6',
    card: '#FFFFFF',
  },
  dark: {
    gold: '#D4AF37',
    lightGold: '#F4E9CD',
    darkGold: '#A58123',
    ivory: '#FFFFF0',
    cream: '#FFFDD0',
    charcoal: '#E0E0E0',
    deepBlue: '#3F51B5',
    offWhite: '#2D2D2D',
    champagne: '#F7E7CE',
    background: '#1C2526',
    card: '#2A3439',
  },
};

// Données fictives
const featuredArtisans = [
  {
    id: 1,
    name: 'DIGBEU Franck',
    specialty: 'Menuisier - Ébéniste',
    location: 'Gagnoa, Côte D\'Ivoire',
    rating: 4.9,
    products: 42,
    sales: 128,
    verified: true,
    avatar: '🪑',
    featured: true
  },
  {
    id: 2,
    name: 'KOUASSI Marie',
    specialty: 'Céramiste - Potière',
    location: 'Bouaké, Côte D\'Ivoire',
    rating: 4.8,
    products: 38,
    sales: 95,
    verified: true,
    avatar: '🏺',
    featured: true
  },
  {
    id: 3,
    name: 'TRAORE Ibrahim',
    specialty: 'Maroquinier',
    location: 'Abidjan, Côte D\'Ivoire',
    rating: 4.7,
    products: 55,
    sales: 156,
    verified: true,
    avatar: '👜',
    featured: false
  }
];

const products = [
  {
    id: 1,
    name: 'Table en bois massif artisanale',
    artisan: 'DIGBEU Franck',
    price: '145,000',
    originalPrice: '165,000',
    category: 'Mobilier',
    description: 'Table sculptée à la main en bois de teck massif',
    rating: 4.8,
    reviews: 23,
    images: ['🪑'],
    isNew: true,
    isPopular: true,
    inStock: true,
    discount: 12
  },
  {
    id: 2,
    name: 'Vase en céramique traditionnel',
    artisan: 'KOUASSI Marie',
    price: '35,500',
    category: 'Décoration',
    description: 'Vase fait main avec motifs traditionnels ivoiriens',
    rating: 4.9,
    reviews: 18,
    images: ['🏺'],
    isNew: false,
    isPopular: true,
    inStock: true,
    discount: 0
  },
  {
    id: 3,
    name: 'Sac en cuir artisanal',
    artisan: 'TRAORE Ibrahim',
    price: '89,000',
    category: 'Maroquinerie',
    description: 'Sac à main en cuir véritable, cousu main',
    rating: 4.7,
    reviews: 31,
    images: ['👜'],
    isNew: true,
    isPopular: false,
    inStock: true,
    discount: 0
  },
  {
    id: 4,
    name: 'Lampe sculptée en bois',
    artisan: 'DIGBEU Franck',
    price: '67,500',
    category: 'Luminaires',
    description: 'Lampe décorative sculptée dans du bois d\'ébène',
    rating: 4.6,
    reviews: 14,
    images: ['💡'],
    isNew: false,
    isPopular: false,
    inStock: false,
    discount: 0
  }
];

const categories = [
  { id: 'all', name: 'Tous', icon: 'apps', count: 156 },
  { id: 'furniture', name: 'Mobilier', icon: 'chair', count: 42 },
  { id: 'decoration', name: 'Décoration', icon: 'palette', count: 38 },
  { id: 'lighting', name: 'Luminaires', icon: 'lightbulb', count: 25 },
  { id: 'leather', name: 'Maroquinerie', icon: 'bag', count: 31 },
  { id: 'textiles', name: 'Textiles', icon: 'color-wand', count: 20 }
];

export default function DiscoverScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState('popular');
  
  const colors = isDarkMode ? LuxuryColors.dark : LuxuryColors.light;

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const StarRating = ({ rating, reviews }) => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name="star"
          size={12}
          color={star <= Math.floor(rating) ? '#FFC107' : '#E0E0E0'}
        />
      ))}
      <Text style={[styles.reviewText, { color: isDarkMode ? colors.charcoal : '#666' }]}>
        ({reviews})
      </Text>
    </View>
  );

  const renderArtisan = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.artisanCard,
        { 
          backgroundColor: isDarkMode ? colors.card : colors.card,
          borderColor: isDarkMode ? '#374151' : '#E5E7EB'
        }
      ]}
    >
      <View style={styles.artisanContent}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        
        <View style={styles.artisanInfo}>
          <View style={styles.nameContainer}>
            <Text style={[styles.artisanName, { color: isDarkMode ? colors.charcoal : colors.charcoal }]}>
              {item.name}
            </Text>
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={10} color="white" />
              </View>
            )}
          </View>
          
          <Text style={[styles.specialty, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
            {item.specialty}
          </Text>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color="#9CA3AF" />
            <Text style={[styles.location, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
              {item.location}
            </Text>
          </View>
          
          <View style={styles.artisanStats}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFC107" />
              <Text style={[styles.rating, { color: isDarkMode ? colors.charcoal : colors.charcoal }]}>
                {item.rating}
              </Text>
            </View>
            <Text style={[styles.products, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
              {item.products} créations
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.productCard,
        { 
          backgroundColor: isDarkMode ? colors.card : colors.card,
          borderColor: isDarkMode ? '#374151' : '#E5E7EB'
        }
      ]}
    >
      <View style={styles.productImageContainer}>
        <View style={styles.productImage}>
          <Text style={styles.productEmoji}>{item.images[0]}</Text>
        </View>
        
        {/* Badges */}
        <View style={styles.badgeContainer}>
          {item.isNew && (
            <View style={[styles.badge, { backgroundColor: '#10B981' }]}>
              <Text style={styles.badgeText}>Nouveau</Text>
            </View>
          )}
          {item.isPopular && (
            <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
              <Text style={styles.badgeText}>Populaire</Text>
            </View>
          )}
          {item.discount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.gold }]}>
              <Text style={styles.badgeText}>-{item.discount}%</Text>
            </View>
          )}
        </View>

        {/* Bouton favori */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons
            name={favorites.has(item.id) ? "heart" : "heart-outline"}
            size={16}
            color={favorites.has(item.id) ? "#EF4444" : "#6B7280"}
          />
        </TouchableOpacity>

        {!item.inStock && (
          <View style={styles.outOfStockOverlay}>
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Rupture de stock</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.productContent}>
        <Text style={[styles.productName, { color: isDarkMode ? colors.charcoal : colors.charcoal }]}>
          {item.name}
        </Text>

        <Text style={[styles.artisanCredit, { color: colors.gold }]}>
          Par {item.artisan}
        </Text>

        <Text style={[styles.productDescription, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
          {item.description}
        </Text>

        <View style={styles.priceRatingContainer}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: isDarkMode ? colors.charcoal : colors.charcoal }]}>
              {item.price} FCFA
            </Text>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>
                {item.originalPrice} FCFA
              </Text>
            )}
          </View>
          
          <StarRating rating={item.rating} reviews={item.reviews} />
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              { backgroundColor: item.inStock ? colors.gold : '#9CA3AF' }
            ]}
            disabled={!item.inStock}
          >
            <Text style={styles.addToCartText}>
              {item.inStock ? 'Ajouter au panier' : 'Indisponible'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.viewButton,
              { borderColor: isDarkMode ? '#374151' : '#E5E7EB' }
            ]}
          >
            <Ionicons
              name="eye-outline"
              size={20}
              color={isDarkMode ? colors.charcoal : '#6B7280'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? colors.background : colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#374151' : 'white' }]}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Text style={styles.sparkle}>✨</Text>
            <View>
              <Text style={styles.logoText}>ARTISCO</Text>
              <Text style={styles.logoSubtext}>Découvrir l'artisanat</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.themeButton}
              onPress={() => setIsDarkMode(!isDarkMode)}
            >
              <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
            
            <View style={styles.cartContainer}>
              <Ionicons name="bag-outline" size={24} color="white" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>3</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchBar,
            { 
              backgroundColor: isDarkMode ? '#374151' : 'white',
              borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
            }
          ]}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={[
                styles.searchInput,
                { color: isDarkMode ? 'white' : '#1F2937' }
              ]}
              placeholder="Rechercher des créations ou artisans..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bannière promotionnelle */}
        <View style={styles.promoContainer}>
          <View style={styles.promoBanner}>
            <Text style={styles.promoArt}>🎨</Text>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Offre de Bienvenue</Text>
              <Text style={styles.promoSubtitle}>-15% sur votre première commande</Text>
              <View style={styles.promoActions}>
                <View style={styles.promoCode}>
                  <Text style={styles.promoCodeText}>ARTISCO15</Text>
                </View>
                <TouchableOpacity style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>Utiliser maintenant</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Artisans en vedette */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="verified" size={20} color={colors.gold} />
              <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.charcoal : colors.charcoal }]}>
                Artisans Certifiés
              </Text>
            </View>
            <Text style={[styles.sectionSubtitle, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
              Découvrez nos maîtres artisans vérifiés
            </Text>
          </View>

          <FlatList
            data={featuredArtisans}
            renderItem={renderArtisan}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.artisansList}
          />
        </View>

        {/* Catégories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.charcoal : colors.charcoal }]}>
            Catégories
          </Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: selectedCategory === category.id ? colors.gold : (isDarkMode ? colors.card : 'white'),
                    borderColor: selectedCategory === category.id ? colors.gold : (isDarkMode ? '#374151' : '#E5E7EB')
                  }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons
                  name={category.icon}
                  size={20}
                  color={selectedCategory === category.id ? 'white' : colors.gold}
                />
                <Text style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.id ? 'white' : (isDarkMode ? colors.charcoal : colors.charcoal)
                  }
                ]}>
                  {category.name}
                </Text>
                <View style={[
                  styles.categoryCount,
                  {
                    backgroundColor: selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : '#F3F4F6'
                  }
                ]}>
                  <Text style={[
                    styles.categoryCountText,
                    {
                      color: selectedCategory === category.id ? 'white' : '#6B7280'
                    }
                  ]}>
                    {category.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Contrôles de vue */}
        <View style={styles.controlsContainer}>
          <Text style={[styles.resultCount, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
            {products.length} créations trouvées
          </Text>
          
          <View style={styles.viewControls}>
            <TouchableOpacity
              style={[
                styles.viewButton,
                {
                  backgroundColor: viewMode === 'grid' ? colors.gold : (isDarkMode ? colors.card : 'white'),
                  borderColor: isDarkMode ? '#374151' : '#E5E7EB'
                }
              ]}
              onPress={() => setViewMode('grid')}
            >
              <Ionicons
                name="grid-outline"
                size={16}
                color={viewMode === 'grid' ? 'white' : (isDarkMode ? colors.charcoal : '#6B7280')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewButton,
                {
                  backgroundColor: viewMode === 'list' ? colors.gold : (isDarkMode ? colors.card : 'white'),
                  borderColor: isDarkMode ? '#374151' : '#E5E7EB'
                }
              ]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons
                name="list-outline"
                size={16}
                color={viewMode === 'list' ? 'white' : (isDarkMode ? colors.charcoal : '#6B7280')}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Grille de produits */}
        <View style={styles.productsContainer}>
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={viewMode}
            scrollEnabled={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* Bouton charger plus */}
        <TouchableOpacity style={[
          styles.loadMoreButton,
          { borderColor: isDarkMode ? '#374151' : '#D1D5DB' }
        ]}>
          <MaterialIcons name="trending-up" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <Text style={[styles.loadMoreText, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
            Voir plus de créations
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTop: {
    backgroundColor: '#EAB308',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sparkle: {
    fontSize: 28,
  },
  logoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoSubtext: {
    color: '#FEF3C7',
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 18,
  },
  cartContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#EAB308',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  promoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  promoBanner: {
    backgroundColor: '#EAB308',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  promoArt: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 60,
    opacity: 0.2,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  promoSubtitle: {
    color: '#FEF3C7',
    fontSize: 14,
    marginBottom: 12,
  },
  promoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  promoCode: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  promoCodeText: {
    color: 'white',
    fontFamily: 'monospace',
    fontSize: 14,
  },
  promoButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  promoButtonText: {
    color: '#EAB308',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  artisansList: {
    paddingHorizontal: 16,
  },
  artisanCard: {
    width: 250,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  artisanContent: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#EAB308',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  artisanInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  artisanName: {
    fontSize: 14,
    fontWeight: '600',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialty: {
    fontSize: 12,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
  },
  artisanStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
  },
  products: {
    fontSize: 12,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryCountText: {
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  resultCount: {
    fontSize: 14,
  },
    viewControls: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsContainer: {
    paddingHorizontal: 16,
  },
  productsList: {
    paddingBottom: 16,
  },
  productCard: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F3F4F6',
  },
  productImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productEmoji: {
    fontSize: 60,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  outOfStockText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  productContent: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  artisanCredit: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewText: {
    fontSize: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addToCartButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 24,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
});