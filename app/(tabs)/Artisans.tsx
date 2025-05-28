import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Switch, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeInLeft, FadeInRight, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Palette de couleurs avec jaune or pur et vert riche
const VibrantColors = {
  light: {
    primary: '#FFD700', // Jaune or pur
    secondary: '#00A86B', // Vert riche
    accent: '#F59E0B', // Amber
    success: '#10B981', // Emerald
    warning: '#F97316', // Orange
    purple: '#8B5CF6', // Violet
    cyan: '#06B6D4', // Cyan
    teal: '#14B8A6', // Teal
    background: '#F8FAFC', // Slate clair
    surface: '#FFFFFF',
    card: 'rgba(255, 255, 255, 0.95)',
    text: '#1E293B',
    textSecondary: '#64748B',
  },
  dark: {
    primary: '#FFC107', // Jaune or clair
    secondary: '#00C4B4', // Vert clair
    accent: '#FBBF24', // Amber clair
    success: '#34D399', // Emerald clair
    warning: '#FB923C', // Orange clair
    purple: '#A78BFA', // Violet clair
    cyan: '#22D3EE', // Cyan clair
    teal: '#2DD4BF', // Teal clair
    background: '#0F172A', // Slate foncé
    surface: '#1E293B',
    card: 'rgba(30, 41, 59, 0.95)',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
  },
};

export default function Artisans() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  
  const colors = isDarkMode ? VibrantColors.dark : VibrantColors.light;

  const artisanProducts = [
    { id: 1, name: 'Table Océan', price: '18,500 FCFA', description: 'Table en bois flotté avec résine bleue', rating: 4.9, category: 'Mobilier', color: colors.cyan },
    { id: 2, name: 'Lampe Aurore', price: '12,800 FCFA', description: 'Luminaire en céramique avec LED colorées', rating: 4.7, category: 'Luminaires', color: colors.purple },
    { id: 3, name: 'Vase Flamme', price: '8,900 FCFA', description: 'Vase en verre soufflé aux reflets dorés', rating: 4.8, category: 'Décoration', color: colors.warning },
    { id: 4, name: 'Tapis Cosmos', price: '25,600 FCFA', description: 'Tapis tissé aux motifs galactiques', rating: 4.6, category: 'Mobilier', color: colors.secondary },
    { id: 5, name: 'Miroir Soleil', price: '15,200 FCFA', description: 'Miroir décoratif avec cadre en métal doré', rating: 4.9, category: 'Décoration', color: colors.accent },
    { id: 6, name: 'Étagère Nuage', price: '22,400 FCFA', description: 'Étagère suspendue en forme de nuage', rating: 4.5, category: 'Mobilier', color: colors.primary },
  ];

  const categories = ['Tous', 'Mobilier', 'Décoration', 'Luminaires', 'Art de la table'];

  const testimonials = [
    { id: 1, name: 'Aminata K.', comment: 'Des créations extraordinaires qui transforment mon intérieur !', rating: 5, avatar: colors.secondary },
    { id: 2, name: 'Kofi M.', comment: 'Un artisan d\'exception, je recommande les yeux fermés.', rating: 4.9, avatar: colors.primary },
    { id: 3, name: 'Fatou S.', comment: 'Qualité irréprochable et service client parfait.', rating: 4.8, avatar: colors.success },
  ];

  const StarRating = ({ rating, size = 14 }) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesome5
            key={star}
            name={star <= Math.floor(rating) ? "star" : star <= rating + 0.5 ? "star-half-alt" : "star"}
            solid={star <= Math.floor(rating)}
            size={size}
            color={colors.accent}
            style={{ marginRight: 2 }}
          />
        ))}
        <Text style={[styles.ratingText, { color: colors.accent, fontSize: size - 2 }]}>{rating}</Text>
      </View>
    );
  };

  const AnimatedButton = ({ onPress, children, style }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.8);
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withSpring(scale.value) }],
      opacity: withTiming(opacity.value),
    }));

    return (
      <TouchableOpacity
        onPressIn={() => {
          scale.value = 0.95;
          opacity.value = 0.6;
        }}
        onPressOut={() => {
          scale.value = 1;
          opacity.value = 0.8;
        }}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
      </TouchableOpacity>
    );
  };

  const filteredProducts = selectedCategory === 'Tous'
    ? artisanProducts
    : artisanProducts.filter(product => product.category === selectedCategory);

  if (userRole === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        
        <View style={styles.backgroundShapes}>
          <Animated.View 
            entering={FadeInUp.duration(2000)}
            style={[styles.shape, styles.shape1, { backgroundColor: colors.primary + '20' }]} 
          />
          <Animated.View 
            entering={FadeInDown.duration(2500)}
            style={[styles.shape, styles.shape2, { backgroundColor: colors.secondary + '20' }]} 
          />
          <Animated.View 
            entering={FadeInLeft.duration(2200)}
            style={[styles.shape, styles.shape3, { backgroundColor: colors.accent + '20' }]} 
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(800)} style={styles.heroSection}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoContainer}
            >
              <MaterialCommunityIcons name="palette" size={40} color="#FFF" />
            </LinearGradient>
            
            <Text style={[styles.heroTitle, { color: colors.text }]}>ARTISCO</Text>
            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
              Où l'art prend vie entre vos mains
            </Text>
            
            <View style={styles.decorativeLine}>
              <View style={[styles.line, { backgroundColor: colors.primary }]} />
              <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
              <View style={[styles.line, { backgroundColor: colors.accent }]} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(1000).delay(400)} style={styles.selectionContainer}>
            <Text style={[styles.selectionTitle, { color: colors.text }]}>
              Choisissez votre parcours
            </Text>
            
            <View style={styles.roleCards}>
              <AnimatedButton
                onPress={() => setUserRole('client')}
                style={[styles.roleCard, { marginRight: 10 }]}
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.roleCardGradient}
                >
                  <View style={styles.roleCardIcon}>
                    <MaterialCommunityIcons name="heart-outline" size={28} color="#FFF" />
                  </View>
                  <Text style={styles.roleCardTitle}>Espace Client</Text>
                  <Text style={styles.roleCardSubtitle}>Découvrez des créations uniques</Text>
                  <View style={[styles.roleCardBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Text style={styles.roleCardBadgeText}>Explorer</Text>
                  </View>
                </LinearGradient>
              </AnimatedButton>

              <AnimatedButton
                onPress={() => setUserRole('artisan')}
                style={styles.roleCard}
              >
                <LinearGradient
                  colors={[colors.secondary, colors.purple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.roleCardGradient}
                >
                  <View style={styles.roleCardIcon}>
                    <MaterialCommunityIcons name="palette-outline" size={28} color="#FFF" />
                  </View>
                  <Text style={styles.roleCardTitle}>Espace Artisan</Text>
                  <Text style={styles.roleCardSubtitle}>Partagez vos œuvres d'art</Text>
                  <View style={[styles.roleCardBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Text style={styles.roleCardBadgeText}>Créer</Text>
                  </View>
                </LinearGradient>
              </AnimatedButton>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(1000).delay(800)} style={styles.featuresSection}>
            <Text style={[styles.featuresTitle, { color: colors.text }]}>
              Pourquoi choisir ARTISCO ?
            </Text>
            <View style={styles.featuresGrid}>
              <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
                <LinearGradient
                  colors={[colors.success + '20', colors.teal + '20']}
                  style={styles.featureIconContainer}
                >
                  <MaterialCommunityIcons name="shield-check" size={24} color={colors.success} />
                </LinearGradient>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Qualité Garantie</Text>
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  Chaque création est vérifiée par nos experts
                </Text>
              </View>
              <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
                <LinearGradient
                  colors={[colors.warning + '20', colors.accent + '20']}
                  style={styles.featureIconContainer}
                >
                  <MaterialCommunityIcons name="lightning-bolt" size={24} color={colors.warning} />
                </LinearGradient>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Livraison Rapide</Text>
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  Recevez vos commandes en 24-48h
                </Text>
              </View>
              <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
                <LinearGradient
                  colors={[colors.primary + '20', colors.purple + '20']}
                  style={styles.featureIconContainer}
                >
                  <MaterialCommunityIcons name="account-group" size={24} color={colors.primary} />
                </LinearGradient>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Communauté</Text>
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  Rejoignez une communauté passionnée
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  if (userRole === 'client') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(800)} style={styles.clientHero}>
            <LinearGradient
              colors={[colors.primary, colors.secondary, colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.clientHeroGradient}
            >
              <MaterialCommunityIcons name="crown" size={48} color="#FFF" />
              <Text style={styles.clientHeroTitle}>Espace Privilège</Text>
              <Text style={styles.clientHeroSubtitle}>
                Accès exclusif aux créations d'exception
              </Text>
            </LinearGradient>
          </Animated.View>
          <Animated.View entering={FadeInUp.duration(800).delay(200)}>
            <View style={[styles.clientInfoCard, { backgroundColor: colors.card }]}>
              <LinearGradient
                colors={[colors.cyan + '20', colors.teal + '20']}
                style={styles.clientInfoGradient}
              >
                <MaterialCommunityIcons name="information" size={24} color={colors.cyan} />
                <Text style={[styles.clientInfoTitle, { color: colors.text }]}>
                  Réservé aux Artisans
                </Text>
                <Text style={[styles.clientInfoText, { color: colors.textSecondary }]}>
                  Cette section est dédiée à nos artisans partenaires pour gérer leurs créations et leur boutique.
                </Text>
              </LinearGradient>
            </View>
          </Animated.View>
          <Animated.View entering={FadeInUp.duration(800).delay(400)}>
            <AnimatedButton
              onPress={() => router.push('/Discover')}
              style={styles.clientActionButton}
            >
              <LinearGradient
                colors={[colors.secondary, colors.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.clientActionGradient}
              >
                <MaterialCommunityIcons name="compass" size={24} color="#FFF" />
                <Text style={styles.clientActionText}>Découvrir la Collection</Text>
                <MaterialCommunityIcons name="arrow-right" size={24} color="#FFF" />
              </LinearGradient>
            </AnimatedButton>
          </Animated.View>
          <TouchableOpacity
            onPress={() => setUserRole(null)}
            style={styles.backButton}
          >
            <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>
              ← Retour à l'accueil
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.artisanHeader}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => setUserRole(null)} style={styles.headerBackBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.artisanHeaderTitle}>Atelier Créatif</Text>
          <View style={styles.headerActions}>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              thumbColor="#FFF"
              trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.5)' }}
            />
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications" size={24} color="#FFF" />
              <View style={styles.notificationDot}>
                <Text style={styles.notificationText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statusIndicators}>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>En ligne</Text>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          </View>
        </View>
      </LinearGradient>

      {!showProducts ? (
        <ScrollView style={styles.artisanContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(800)} style={styles.profileSection}>
            <LinearGradient
              colors={[colors.card, colors.surface]}
              style={styles.profileContainer}
            >
              <View style={styles.profileMain}>
                <LinearGradient
                  colors={[colors.accent, colors.warning]}
                  style={styles.avatarContainer}
                >
                  <FontAwesome5 name="user-alt" size={28} color="#FFF" />
                </LinearGradient>
                <View style={styles.profileInfo}>
                  <View style={styles.profileNameRow}>
                    <Text style={[styles.profileName, { color: colors.text }]}>DIGBEU Franck</Text>
                    <View style={[styles.verifiedBadge, { backgroundColor: colors.success + '20' }]}>
                      <MaterialCommunityIcons name="check-decagram" size={12} color={colors.success} />
                      <Text style={[styles.verifiedText, { color: colors.success }]}>Vérifié</Text>
                    </View>
                  </View>
                  <Text style={[styles.profileRole, { color: colors.primary }]}>Maître Ébéniste</Text>
                  <View style={styles.profileLocation}>
                    <Ionicons name="location" size={12} color={colors.textSecondary} />
                    <Text style={[styles.locationText, { color: colors.textSecondary }]}>Gagnoa, Côte d'Ivoire</Text>
                  </View>
                </View>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={[colors.primary + '20', colors.cyan + '20']}
                    style={styles.statCardGradient}
                  >
                    <MaterialCommunityIcons name="palette" size={20} color={colors.primary} />
                    <Text style={[styles.statNumber, { color: colors.text }]}>67</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Créations</Text>
                  </LinearGradient>
                </View>
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={[colors.success + '20', colors.teal + '20']}
                    style={styles.statCardGradient}
                  >
                    <MaterialCommunityIcons name="shopping" size={20} color={colors.success} />
                    <Text style={[styles.statNumber, { color: colors.text }]}>158</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Ventes</Text>
                  </LinearGradient>
                </View>
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={[colors.accent + '20', colors.warning + '20']}
                    style={styles.statCardGradient}
                  >
                    <MaterialCommunityIcons name="star" size={20} color={colors.accent} />
                    <Text style={[styles.statNumber, { color: colors.text }]}>4.9</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
                  </LinearGradient>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
          <Animated.View entering={FadeInUp.duration(800).delay(200)} style={styles.quickActions}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions Rapides</Text>
            <View style={styles.actionsGrid}>
              <AnimatedButton onPress={() => setShowProducts(true)} style={styles.actionCard}>
                <LinearGradient colors={[colors.primary, colors.cyan]} style={styles.actionCardGradient}>
                  <MaterialCommunityIcons name="view-grid" size={28} color="#FFF" />
                  <Text style={styles.actionCardTitle}>Mes Créations</Text>
                </LinearGradient>
              </AnimatedButton>
              <AnimatedButton style={styles.actionCard}>
                <LinearGradient colors={[colors.secondary, colors.purple]} style={styles.actionCardGradient}>
                  <MaterialCommunityIcons name="plus-circle" size={28} color="#FFF" />
                  <Text style={styles.actionCardTitle}>Nouvelle Œuvre</Text>
                </LinearGradient>
              </AnimatedButton>
              <AnimatedButton style={styles.actionCard}>
                <LinearGradient colors={[colors.success, colors.teal]} style={styles.actionCardGradient}>
                  <MaterialCommunityIcons name="chart-line" size={28} color="#FFF" />
                  <Text style={styles.actionCardTitle}>Statistiques</Text>
                </LinearGradient>
              </AnimatedButton>
              <AnimatedButton style={styles.actionCard}>
                <LinearGradient colors={[colors.warning, colors.accent]} style={styles.actionCardGradient}>
                  <MaterialCommunityIcons name="message" size={28} color="#FFF" />
                  <Text style={styles.actionCardTitle}>Messages</Text>
                </LinearGradient>
              </AnimatedButton>
            </View>
          </Animated.View>
          <Animated.View entering={FadeInLeft.duration(800).delay(400)} style={styles.popularCreations}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Créations Populaires</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {artisanProducts.slice(0, 4).map((product, index) => (
                <Animated.View
                  key={product.id}
                  entering={FadeInRight.duration(600).delay(index * 100)}
                  style={styles.popularCard}
                >
                  <LinearGradient colors={[product.color + '20', product.color + '10']} style={styles.popularCardGradient}>
                    <View style={[styles.popularImage, { backgroundColor: product.color + '30' }]}>
                      <MaterialCommunityIcons name="diamond" size={32} color={product.color} />
                    </View>
                    <Text style={[styles.popularName, { color: colors.text }]} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text style={[styles.popularPrice, { color: product.color }]}>{product.price}</Text>
                    <StarRating rating={product.rating} size={12} />
                  </LinearGradient>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
          <Animated.View entering={FadeInUp.duration(800).delay(600)} style={styles.testimonialSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Avis Clients</Text>
            {testimonials.map((testimonial, index) => (
              <Animated.View
                key={testimonial.id}
                entering={FadeInLeft.duration(600).delay(index * 100)}
                style={[styles.testimonialCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.testimonialHeader}>
                  <View style={[styles.avatarSmall, { backgroundColor: testimonial.avatar }]}>
                    <Text style={styles.avatarText}>{testimonial.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.testimonialInfo}>
                    <Text style={[styles.testimonialName, { color: colors.text }]}>{testimonial.name}</Text>
                    <StarRating rating={testimonial.rating} size={12} />
                  </View>
                </View>
                <Text style={[styles.testimonialText, { color: colors.textSecondary }]}>
                  "{testimonial.comment}"
                </Text>
              </Animated.View>
            ))}
          </Animated.View>
        </ScrollView>
      ) : (
        <View style={styles.productsContainer}>
          <View style={styles.productsHeader}>
            <TouchableOpacity onPress={() => setShowProducts(false)} style={styles.productsBackBtn}>
              <Ionicons name="arrow-back" size={20} color={colors.primary} />
              <Text style={[styles.productsBackText, { color: colors.primary }]}>Retour</Text>
            </TouchableOpacity>
            <Text style={[styles.productsTitle, { color: colors.text }]}>Mes Créations</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <AnimatedButton
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[styles.categoryButton, selectedCategory === category && { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.categoryButtonText, { color: selectedCategory === category ? '#FFF' : colors.textSecondary }]}>
                  {category}
                </Text>
              </AnimatedButton>
            ))}
          </ScrollView>
          <ScrollView style={styles.productsGrid} showsVerticalScrollIndicator={false}>
            <View style={styles.gridContainer}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <Animated.View
                    key={product.id}
                    entering={FadeInUp.duration(600).delay(index * 50)}
                    style={styles.productCard}
                  >
                    <LinearGradient colors={[colors.card, colors.surface]} style={styles.productCardGradient}>
                      <View style={[styles.productImage, { backgroundColor: product.color + '20' }]}>
                        <MaterialCommunityIcons name="diamond" size={36} color={product.color} />
                        <View style={[styles.productBadge, { backgroundColor: product.color }]}>
                          <Text style={styles.productBadgeText}>Nouveau</Text>
                        </View>
                      </View>
                      <View style={styles.productInfo}>
                        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
                          {product.name}
                        </Text>
                        <Text style={[styles.productPrice, { color: product.color }]}>{product.price}</Text>
                        <Text style={[styles.productDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                          {product.description}
                        </Text>
                        <StarRating rating={product.rating} size={14} />
                        <AnimatedButton style={styles.productActionButton}>
                          <LinearGradient
                            colors={[product.color, product.color + '80']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.productActionGradient}
                          >
                            <Text style={styles.productActionText}>Voir Détails</Text>
                            <MaterialCommunityIcons name="arrow-right" size={16} color="#FFF" />
                          </LinearGradient>
                        </AnimatedButton>
                      </View>
                    </LinearGradient>
                  </Animated.View>
                ))
              ) : (
                <View style={styles.noProductsContainer}>
                  <Text style={[styles.noProductsText, { color: colors.textSecondary }]}>
                    Aucune création dans cette catégorie
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 15, paddingBottom: 80 },
  backgroundShapes: { position: 'absolute', width, height, zIndex: -1 },
  shape: { position: 'absolute', borderRadius: 100, opacity: 0.3 },
  shape1: { width: 180, height: 180, top: -40, left: -40 },
  shape2: { width: 140, height: 140, bottom: 80, right: -20 },
  shape3: { width: 100, height: 100, top: 280, right: 40 },
  heroSection: { alignItems: 'center', marginTop: 15 },
  logoContainer: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  heroTitle: { fontSize: 32, fontWeight: '800', letterSpacing: 1.2 },
  heroSubtitle: { fontSize: 14, marginTop: 6, textAlign: 'center', lineHeight: 20 },
  decorativeLine: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  line: { flex: 1, height: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 8 },
  selectionContainer: { marginTop: 15 },
  selectionTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 15 },
  roleCards: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  roleCard: { flex: 1, borderRadius: 14, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 6 },
  roleCardGradient: { padding: 15, alignItems: 'center' },
  roleCardIcon: { marginBottom: 8 },
  roleCardTitle: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  roleCardSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 4, textAlign: 'center' },
  roleCardBadge: { marginTop: 8, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 10 },
  roleCardBadgeText: { fontSize: 10, color: '#FFF', fontWeight: '600' },
  featuresSection: { marginTop: 30 },
  featuresTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 15 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  featureCard: { width: (width - 45) / 2, padding: 12, borderRadius: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  featureIconContainer: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  featureTitle: { fontSize: 14, fontWeight: '600' },
  featureText: { fontSize: 11, marginTop: 3, lineHeight: 16 },
  clientHero: { marginBottom: 15 },
  clientHeroGradient: { borderRadius: 14, padding: 15, alignItems: 'center' },
  clientHeroTitle: { fontSize: 26, fontWeight: '700', color: '#FFF', marginTop: 10 },
  clientHeroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 6, textAlign: 'center' },
  clientInfoCard: { borderRadius: 10, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  clientInfoGradient: { padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 },
  clientInfoTitle: { fontSize: 16, fontWeight: '600' },
  clientInfoText: { fontSize: 12, lineHeight: 18, marginTop: 6 },
  clientActionButton: { marginTop: 15, borderRadius: 10, overflow: 'hidden' },
  clientActionGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
  clientActionText: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  backButton: { marginTop: 15, alignSelf: 'center' },
  backButtonText: { fontSize: 12, fontWeight: '500' },
  artisanHeader: { padding: 15, paddingTop: StatusBar.currentHeight || 30 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerBackBtn: { padding: 6 },
  artisanHeaderTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notificationBtn: { position: 'relative' },
  notificationDot: { position: 'absolute', top: -2, right: -2, backgroundColor: VibrantColors.light.warning, borderRadius: 8, width: 14, height: 14, alignItems: 'center', justifyContent: 'center' },
  notificationText: { fontSize: 8, color: '#FFF', fontWeight: '600' },
  statusIndicators: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  statusItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusValue: { fontSize: 12, color: '#FFF', fontWeight: '500' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  artisanContent: { flex: 1, padding: 15 },
  profileSection: { marginBottom: 15 },
  profileContainer: { borderRadius: 14, padding: 15, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 6 },
  profileMain: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  profileInfo: { flex: 1 },
  profileNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  profileName: { fontSize: 16, fontWeight: '700' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 10, gap: 3 },
  verifiedText: { fontSize: 10, fontWeight: '500' },
  profileRole: { fontSize: 12, fontWeight: '600', marginTop: 3 },
  profileLocation: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  locationText: { fontSize: 10 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, borderRadius: 10, overflow: 'hidden' },
  statCardGradient: { padding: 10, alignItems: 'center' },
  statNumber: { fontSize: 16, fontWeight: '700', marginTop: 6 },
  statLabel: { fontSize: 10, marginTop: 3 },
  quickActions: { marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard: { width: (width - 45) / 2, borderRadius: 10, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  actionCardGradient: { padding: 15, alignItems: 'center' },
  actionCardTitle: { fontSize: 12, fontWeight: '600', color: '#FFF', marginTop: 6 },
  popularCreations: { marginBottom: 15 },
  popularCard: { width: 120, marginRight: 12, borderRadius: 10, overflow: 'hidden' },
  popularCardGradient: { padding: 10 },
  popularImage: { width: '100%', height: 80, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  popularName: { fontSize: 12, fontWeight: '600' },
  popularPrice: { fontSize: 10, fontWeight: '500', marginTop: 3 },
  testimonialSection: { marginBottom: 15 },
  testimonialCard: { borderRadius: 10, padding: 12, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  testimonialHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatarSmall: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  avatarText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  testimonialInfo: { flex: 1 },
  testimonialName: { fontSize: 12, fontWeight: '600' },
  testimonialText: { fontSize: 10, lineHeight: 14 },
  starContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  ratingText: { fontSize: 10, fontWeight: '500', marginLeft: 3 },
  productsContainer: { flex: 1, padding: 15, paddingTop: 0 },
  productsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  productsBackBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  productsBackText: { fontSize: 14, fontWeight: '500' },
  productsTitle: { flex: 1, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  categoriesContainer: { marginBottom: 15 },
  categoryButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, marginRight: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  categoryButtonText: { fontSize: 12, fontWeight: '500' },
  productsGrid: { flex: 1 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  productCard: { width: (width - 45) / 2, borderRadius: 10, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  productCardGradient: { padding: 10 },
  productImage: { width: '100%', height: 100, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 6, position: 'relative' },
  productBadge: { position: 'absolute', top: 6, right: 6, paddingVertical: 2, paddingHorizontal: 6, borderRadius: 8 },
  productBadgeText: { fontSize: 8, color: '#FFF', fontWeight: '600' },
  productInfo: { flex: 1 },
  productName: { fontSize: 12, fontWeight: '600' },
  productPrice: { fontSize: 10, fontWeight: '500', marginTop: 3 },
  productDescription: { fontSize: 10, marginTop: 3, lineHeight: 14 },
  productActionButton: { marginTop: 6, borderRadius: 8, overflow: 'hidden' },
  productActionGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 6, gap: 6 },
  productActionText: { fontSize: 10, fontWeight: '600', color: '#FFF' },
  noProductsContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 15 },
  noProductsText: { fontSize: 14, textAlign: 'center' },
});