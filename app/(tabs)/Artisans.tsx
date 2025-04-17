import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// Nouvelle palette de couleurs luxueuse avec thème sombre
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

export default function Artisans() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null); // null, 'artisan' ou 'client'
  const [showProducts, setShowProducts] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colors = isDarkMode ? LuxuryColors.dark : LuxuryColors.light;

  // Données fictives pour les produits d'un artisan
  const artisanProducts = [
    { id: 1, name: 'Table en bois massif', price: '14450fcfa', description: 'Table artisanale en chêne', rating: 4.8 },
    { id: 2, name: 'Lampe en céramique', price: '9995fcfa', description: 'Lampe décorative faite à la main', rating: 4.6 },
    { id: 3, name: 'Vase en verre soufflé', price: '1209fcfa', description: 'Vase unique et élégant', rating: 4.9 },
    { id: 4, name: 'Tapis tissé traditionnel', price: '22280fcfa', description: 'Tapis fait main avec des motifs traditionnels', rating: 4.7 },
  ];

  // Données fictives pour les témoignages
  const testimonials = [
    { id: 1, name: 'Marie L.', comment: 'Un travail exceptionnel, ma table est une œuvre d’art !', rating: 5 },
    { id: 2, name: 'Pierre D.', comment: 'Artisan très professionnel, je recommande vivement.', rating: 4.8 },
    { id: 3, name: 'Sophie M.', comment: 'Le vase est magnifique, livraison rapide.', rating: 4.9 },
  ];

  // Composant pour afficher les étoiles de notation
  const StarRating = ({ rating }) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesome5
            key={star}
            name={star <= Math.floor(rating) ? "star" : star <= rating + 0.5 ? "star-half-alt" : "star"}
            solid={star <= Math.floor(rating)}
            size={12}
            color={colors.gold}
            style={{ marginRight: 2 }}
          />
        ))}
        <Text style={[styles.ratingText, { color: colors.gold }]}>{rating}</Text>
      </View>
    );
  };

  // Composant bouton animé
  const AnimatedButton = ({ onPress, children, style }) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withSpring(scale.value) }],
    }));

    return (
      <TouchableOpacity
        onPressIn={() => (scale.value = 0.95)}
        onPressOut={() => (scale.value = 1)}
        onPress={onPress}
      >
        <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
      </TouchableOpacity>
    );
  };

  // Page de sélection du rôle avec arrière-plan élégant
  if (userRole === null) {
    return (
      <View style={[styles.backgroundImage, { backgroundColor: colors.charcoal }]}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
          style={styles.overlay}
        >
          <View style={styles.containerCenter}>
            <Animated.View entering={FadeInDown.duration(600)}>
              <BlurView intensity={80} tint="dark" style={styles.blurCard}>
                <View style={styles.luxuryLogo}>
                  <MaterialCommunityIcons name="treasure-chest" size={50} color={colors.gold} />
                  <View style={[styles.logoLine, { backgroundColor: colors.gold }]} />
                </View>

                <Text style={[styles.luxuryTitle, { color: colors.ivory }]}>ARTISCO</Text>
                <Text style={[styles.luxurySubtitle, { color: colors.lightGold }]}>L'art entre vos mains</Text>

                <View style={styles.divider}>
                  <View style={[styles.dividerLine, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                  <View style={[styles.dividerDot, { backgroundColor: colors.gold }]} />
                  <View style={[styles.dividerLine, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                </View>

                <Text style={[styles.welcomeText, { color: colors.ivory }]}>Comment souhaitez-vous poursuivre ?</Text>

                <View style={styles.roleSelection}>
                  <AnimatedButton
                    style={styles.roleButton}
                    onPress={() => setUserRole('client')}
                  >
                    <LinearGradient
                      colors={[colors.ivory, colors.cream]}
                      style={styles.roleButtonGradient}
                    >
                      <MaterialCommunityIcons name="account-heart" size={40} color={colors.darkGold} />
                      <Text style={[styles.roleButtonText, { color: colors.charcoal }]}>Espace Client</Text>
                    </LinearGradient>
                  </AnimatedButton>

                  <AnimatedButton
                    style={styles.roleButton}
                    onPress={() => setUserRole('artisan')}
                  >
                    <LinearGradient
                      colors={[colors.gold, colors.darkGold]}
                      style={styles.roleButtonGradient}
                    >
                      <MaterialCommunityIcons name="hammer-wrench" size={40} color="#FFF" />
                      <Text style={[styles.roleButtonText, { color: '#FFF' }]}>Espace Artisan</Text>
                    </LinearGradient>
                  </AnimatedButton>
                </View>
              </BlurView>
            </Animated.View>

            <Text style={[styles.footerText, { color: 'rgba(255,255,255,0.7)' }]}>© 2025 ARTISCO • L'excellence artisanale</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Espace client repensé
  if (userRole === 'client') {
    return (
      <View style={[styles.backgroundImage, { backgroundColor: colors.charcoal }]}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
          style={styles.overlay}
        >
          <View style={styles.containerCenter}>
            <Animated.View entering={FadeInUp.duration(600)}>
              <BlurView intensity={85} tint="dark" style={styles.blurCard}>
                <View style={styles.clientHeaderSection}>
                  <MaterialCommunityIcons name="crown" size={45} color={colors.gold} />
                  <Text style={[styles.clientSectionTitle, { color: colors.ivory }]}>Espace Privilège</Text>
                </View>

                <Text style={[styles.clientMessage, { color: colors.ivory }]}>
                  Cet espace est exclusivement réservé à nos artisans partenaires.
                </Text>

                <View style={[styles.clientDivider, { backgroundColor: colors.gold }]} />

                <Text style={[styles.clientRedirectText, { color: colors.lightGold }]}>
                  En tant que client, vous pouvez découvrir nos artisans et leurs créations dans la section "Découvrir".
                </Text>

                <AnimatedButton
                  style={styles.clientActionButton}
                  onPress={() => router.push('/Discover')}
                >
                  <LinearGradient
                    colors={[colors.gold, colors.darkGold]}
                    style={styles.clientActionButtonGradient}
                  >
                    <Text style={[styles.clientActionButtonText, { color: colors.ivory }]}>Découvrir la Collection</Text>
                  </LinearGradient>
                </AnimatedButton>

                <TouchableOpacity
                  style={styles.clientBackButton}
                  onPress={() => setUserRole(null)}
                >
                  <Text style={[styles.clientBackButtonText, { color: 'rgba(255,255,255,0.7)' }]}>Retour à l'accueil</Text>
                </TouchableOpacity>
              </BlurView>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(600).delay(200)}>
              <BlurView intensity={75} tint="dark" style={styles.promoContainer}>
                <View style={styles.promoHeader}>
                  <MaterialCommunityIcons name="certificate" size={28} color={colors.gold} />
                  <Text style={[styles.promoTitle, { color: colors.gold }]}>OFFRE DE BIENVENUE</Text>
                </View>

                <Text style={[styles.promoDescription, { color: colors.ivory }]}>
                  Première prestation -15% Utilise le code ARTISCO15 lors de ta première commande
                </Text>

                <View style={[styles.promoCodeContainer, { backgroundColor: 'rgba(212,175,55,0.2)', borderColor: 'rgba(212,175,55,0.3)' }]}>
                  <Text style={[styles.promoCode, { color: colors.gold }]}>ARTISCO15</Text>
                </View>

                <AnimatedButton style={styles.promoButton} onPress={() => router.push('/Discover')}>
                  <LinearGradient
                    colors={[colors.ivory, colors.cream]}
                    style={styles.promoButtonGradient}
                  >
                    <Text style={[styles.promoButtonText, { color: colors.charcoal }]}>Explorer Maintenant</Text>
                  </LinearGradient>
                </AnimatedButton>
              </BlurView>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Espace artisan totalement redesigné
  return (
    <View style={[styles.containerFull, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header repensé avec effet or */}
      <LinearGradient
        colors={[colors.darkGold, colors.gold]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.luxuryHeader}
      >
        <TouchableOpacity onPress={() => setUserRole(null)} style={styles.headerBackButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: '#FFF' }]}>Espace Artisan</Text>

        <View style={styles.headerRight}>
          <Switch
            value={isDarkMode}
            onValueChange={() => setIsDarkMode(!isDarkMode)}
            thumbColor={isDarkMode ? colors.gold : colors.ivory}
            trackColor={{ false: colors.charcoal, true: colors.darkGold }}
          />
          <TouchableOpacity style={styles.headerNotifButton}>
            <Ionicons name="notifications" size={24} color="#FFF" />
            <View style={[styles.notificationBadge, { backgroundColor: colors.ivory }]}>
              <Text style={[styles.notificationBadgeText, { color: colors.gold }]}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {!showProducts ? (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Bannière de bienvenue */}
          <Animated.View entering={FadeInUp.duration(600)} style={styles.welcomeBanner}>
            <LinearGradient
              colors={[colors.gold + '33', colors.darkGold + '33']}
              style={styles.welcomeBannerGradient}
            >
              <Text style={[styles.welcomeBannerText, { color: colors.charcoal }]}>
                Bienvenue, DIGBEU Franck!
              </Text>
              <Text style={[styles.welcomeBannerQuote, { color: colors.charcoal }]}>
                "L’artisanat, c’est l’âme de l’objet." – ARTISCO
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* Carte de profil repensée */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.gold + '33' }]}>
              <LinearGradient
                colors={['rgba(212,175,55,0.2)', 'rgba(212,175,55,0.05)']}
                style={styles.profileCardGradient}
              >
                <View style={styles.profileHeader}>
                  <View style={[styles.profileImageFrame, { backgroundColor: colors.lightGold }]}>
                    <View style={[styles.profileImage, { backgroundColor: colors.ivory }]}>
                      <FontAwesome5 name="user-alt" size={40} color={colors.charcoal} />
                    </View>
                  </View>

                  <View style={styles.profileTextContainer}>
                    <Text style={[styles.profileName, { color: colors.charcoal }]}>DIGBEU Franck</Text>
                    <View style={styles.profileBadge}>
                      <MaterialCommunityIcons name="check-decagram" size={14} color={colors.gold} />
                      <Text style={[styles.profileBadgeText, { color: colors.gold }]}>Artisan Certifié</Text>
                    </View>
                    <Text style={[styles.profileMetier, { color: colors.charcoal }]}>Menuisier - Ébéniste</Text>
                    <View style={styles.profileLocation}>
                      <Ionicons name="location" size={14} color={colors.charcoal} />
                      <Text style={[styles.profileLocationText, { color: colors.charcoal }]}>Gagnoa, Côte D'Ivoire</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.profileDivider, { backgroundColor: colors.gold + '33' }]} />

                {/* Statistiques repensées */}
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <View style={[styles.statIconContainer, { backgroundColor: colors.gold + '1A' }]}>
                      <MaterialCommunityIcons name="palette" size={18} color={colors.gold} />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.charcoal }]}>42</Text>
                    <Text style={[styles.statLabel, { color: colors.charcoal }]}>Créations</Text>
                  </View>

                  <View style={[styles.statDivider, { backgroundColor: colors.gold + '33' }]} />

                  <View style={styles.statItem}>
                    <View style={[styles.statIconContainer, { backgroundColor: colors.gold + '1A' }]}>
                      <MaterialCommunityIcons name="shopping" size={18} color={colors.gold} />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.charcoal }]}>128</Text>
                    <Text style={[styles.statLabel, { color: colors.charcoal }]}>Ventes</Text>
                  </View>

                  <View style={[styles.statDivider, { backgroundColor: colors.gold + '33' }]} />

                  <View style={styles.statItem}>
                    <View style={[styles.statIconContainer, { backgroundColor: colors.gold + '1A' }]}>
                      <MaterialCommunityIcons name="star" size={18} color={colors.gold} />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.charcoal }]}>4.9</Text>
                    <Text style={[styles.statLabel, { color: colors.charcoal }]}>Évaluation</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Créations en vedette */}
          <Animated.View entering={FadeInDown.duration(600).delay(400)}>
            <View style={[styles.featuredSection, { backgroundColor: colors.card, borderColor: colors.gold + '33' }]}>
              <Text style={[styles.panelTitle, { color: colors.charcoal }]}>Créations en Vedette</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {artisanProducts.slice(0, 3).map((product) => (
                  <AnimatedButton key={product.id} style={[styles.featuredCard, { backgroundColor: colors.background, borderColor: colors.gold + '33' }]}>
                    <LinearGradient
                      colors={['rgba(250,249,246,0.6)', 'rgba(247,231,206,0.6)']}
                      style={styles.featuredImagePlaceholder}
                    >
                      <MaterialCommunityIcons name="image-outline" size={40} color={colors.charcoal} />
                    </LinearGradient>
                    <View style={styles.featuredContent}>
                      <Text style={[styles.featuredName, { color: colors.charcoal }]}>{product.name}</Text>
                      <Text style={[styles.featuredPrice, { color: colors.gold }]}>{product.price}</Text>
                      <StarRating rating={product.rating} />
                    </View>
                  </AnimatedButton>
                ))}
              </ScrollView>
            </View>
          </Animated.View>

          {/* Panneau d'actions repensé */}
          <Animated.View entering={FadeInDown.duration(600).delay(600)}>
            <View style={[styles.actionPanel, { backgroundColor: colors.card, borderColor: colors.gold + '33' }]}>
              <Text style={[styles.panelTitle, { color: colors.charcoal }]}>Tableau de Bord</Text>

              <AnimatedButton
                style={styles.luxuryActionButton}
                onPress={() => setShowProducts(true)}
              >
                <LinearGradient
                  colors={[colors.gold, colors.darkGold]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionButtonGradient}
                >
                  <MaterialCommunityIcons name="view-grid" size={22} color="#FFF" style={styles.actionButtonIcon} />
                  <Text style={styles.actionButtonText}>Gérer mes créations</Text>
                  <MaterialCommunityIcons name="chevron-right" size={22} color="#FFF" />
                </LinearGradient>
              </AnimatedButton>

              <AnimatedButton style={styles.luxuryActionButton}>
                <LinearGradient
                  colors={[colors.ivory, colors.champagne]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionButtonGradient}
                >
                  <MaterialCommunityIcons name="chart-line" size={22} color={colors.charcoal} style={styles.actionButtonIcon} />
                  <Text style={[styles.actionButtonText, { color: colors.charcoal }]}>Statistiques de vente</Text>
                  <MaterialCommunityIcons name="chevron-right" size={22} color={colors.charcoal} />
                </LinearGradient>
              </AnimatedButton>

              <AnimatedButton style={styles.luxuryActionButton}>
                <LinearGradient
                  colors={[colors.ivory, colors.champagne]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionButtonGradient}
                >
                  <MaterialCommunityIcons name="account-edit" size={22} color={colors.charcoal} style={styles.actionButtonIcon} />
                  <Text style={[styles.actionButtonText, { color: colors.charcoal }]}>Modifier mon profil</Text>
                  <MaterialCommunityIcons name="chevron-right" size={22} color={colors.charcoal} />
                </LinearGradient>
              </AnimatedButton>

              <AnimatedButton style={styles.luxuryActionButton}>
                <LinearGradient
                  colors={[colors.ivory, colors.champagne]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionButtonGradient}
                >
                  <MaterialCommunityIcons name="history" size={22} color={colors.charcoal} style={styles.actionButtonIcon} />
                  <Text style={[styles.actionButtonText, { color: colors.charcoal }]}>Historique des commandes</Text>
                  <MaterialCommunityIcons name="chevron-right" size={22} color={colors.charcoal} />
                </LinearGradient>
              </AnimatedButton>
            </View>
          </Animated.View>

          {/* Témoignages */}
          <Animated.View entering={FadeInDown.duration(600).delay(800)}>
            <View style={[styles.testimonialSection, { backgroundColor: colors.card, borderColor: colors.gold + '33' }]}>
              <Text style={[styles.panelTitle, { color: colors.charcoal }]}>Ce que disent vos clients</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {testimonials.map((testimonial) => (
                  <View key={testimonial.id} style={[styles.testimonialCard, { backgroundColor: colors.background, borderColor: colors.gold + '33' }]}>
                    <Text style={[styles.testimonialComment, { color: colors.charcoal }]}>"{testimonial.comment}"</Text>
                    <View style={styles.testimonialFooter}>
                      <Text style={[styles.testimonialName, { color: colors.gold }]}>{testimonial.name}</Text>
                      <StarRating rating={testimonial.rating} />
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </Animated.View>

          {/* Panneau d'actions créatives */}
          <Animated.View entering={FadeInDown.duration(600).delay(1000)}>
            <View style={[styles.actionPanel, { backgroundColor: colors.card, borderColor: colors.gold + '33' }]}>
              <Text style={[styles.panelTitle, { color: colors.charcoal }]}>Créations & Ventes</Text>

              <AnimatedButton style={styles.luxuryCreativeButton}>
                <LinearGradient
                  colors={[colors.gold, colors.darkGold]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.actionButtonGradient, styles.creativeButtonGradient]}
                >
                  <MaterialCommunityIcons name="plus-circle" size={28} color="#FFF" />
                  <Text style={styles.creativeButtonText}>Ajouter une nouvelle création</Text>
                </LinearGradient>
              </AnimatedButton>

              <View style={styles.quickStatsContainer}>
                <View style={[styles.quickStatItem, { backgroundColor: colors.gold + '1A' }]}>
                  <Text style={[styles.quickStatTitle, { color: colors.charcoal }]}>En Stock</Text>
                  <Text style={[styles.quickStatValue, { color: colors.gold }]}>28</Text>
                </View>

                <View style={[styles.quickStatItem, { backgroundColor: colors.gold + '1A' }]}>
                  <Text style={[styles.quickStatTitle, { color: colors.charcoal }]}>Commandes</Text>
                  <Text style={[styles.quickStatValue, { color: colors.gold }]}>5</Text>
                </View>

                <View style={[styles.quickStatItem, { backgroundColor: colors.gold + '1A' }]}>
                  <Text style={[styles.quickStatTitle, { color: colors.charcoal }]}>Vues</Text>
                  <Text style={[styles.quickStatValue, { color: colors.gold }]}>342</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Panneau promotionnel */}
          <Animated.View entering={FadeInDown.duration(600).delay(1200)}>
            <View style={[styles.promoPanel, { backgroundColor: colors.card, borderColor: colors.gold + '33' }]}>
              <LinearGradient
                colors={['rgba(212,175,55,0.2)', 'rgba(212,175,55,0.1)']}
                style={styles.promoPanelGradient}
              >
                <MaterialCommunityIcons name="lightbulb-on" size={30} color={colors.gold} />
                <Text style={[styles.promoTipTitle, { color: colors.gold }]}>Conseil du jour</Text>
                <Text style={[styles.promoTipText, { color: colors.charcoal }]}>
                  Ajoutez des photographies de haute qualité pour mettre en valeur vos créations et augmenter vos ventes de 40%.
                </Text>
                <AnimatedButton style={styles.promoTipButton}>
                  <Text style={[styles.promoTipButtonText, { color: colors.gold }]}>En savoir plus</Text>
                </AnimatedButton>
              </LinearGradient>
            </View>
          </Animated.View>
        </ScrollView>
      ) : (
        // Section des produits complètement redessinée
        <ScrollView style={styles.productsScrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.productsHeader}>
            <View style={styles.productsTitleContainer}>
              <Text style={[styles.productsMainTitle, { color: colors.charcoal }]}>Mes Créations</Text>
              <Text style={[styles.productsSubtitle, { color: colors.charcoal }]}>Gérez votre collection</Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowProducts(false)}
              style={styles.backToDashboardButton}
            >
              <MaterialCommunityIcons name="view-dashboard" size={18} color={colors.gold} />
              <Text style={[styles.backToDashboardText, { color: colors.gold }]}>Tableau de bord</Text>
            </TouchableOpacity>
          </View>

          <AnimatedButton style={styles.addProductButton}>
            <LinearGradient
              colors={[colors.gold, colors.darkGold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addProductButtonGradient}
            >
              <MaterialCommunityIcons name="plus" size={22} color="#FFF" />
              <Text style={styles.addProductButtonText}>Ajouter une création</Text>
            </LinearGradient>
          </AnimatedButton>

          <View style={styles.productCategoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              <AnimatedButton style={[styles.categoryTab, styles.categoryTabActive, { backgroundColor: colors.gold }]}>
                <Text style={[styles.categoryTabText, styles.categoryTabTextActive, { color: '#FFF' }]}>Tous</Text>
              </AnimatedButton>
              <AnimatedButton style={[styles.categoryTab, { backgroundColor: colors.gold + '1A' }]}>
                <Text style={[styles.categoryTabText, { color: colors.gold }]}>Mobilier</Text>
              </AnimatedButton>
              <AnimatedButton style={[styles.categoryTab, { backgroundColor: colors.gold + '1A' }]}>
                <Text style={[styles.categoryTabText, { color: colors.gold }]}>Décoration</Text>
              </AnimatedButton>
              <AnimatedButton style={[styles.categoryTab, { backgroundColor: colors.gold + '1A' }]}>
                <Text style={[styles.categoryTabText, { color: colors.gold }]}>Luminaires</Text>
              </AnimatedButton>
              <AnimatedButton style={[styles.categoryTab, { backgroundColor: colors.gold + '1A' }]}>
                <Text style={[styles.categoryTabText, { color: colors.gold }]}>Art de la table</Text>
              </AnimatedButton>
            </ScrollView>
          </View>

          <View style={styles.productGrid}>
            {artisanProducts.map((product, index) => (
              <Animated.View entering={FadeInDown.duration(600).delay(index * 100)} key={product.id}>
                <AnimatedButton style={[styles.luxuryProductCard, { backgroundColor: colors.card, borderColor: colors.gold + '33' }]}>
                  <View style={styles.productImageContainer}>
                    <LinearGradient
                      colors={['rgba(250,249,246,0.6)', 'rgba(247,231,206,0.6)']}
                      style={styles.productImagePlaceholder}
                    >
                      <MaterialCommunityIcons name="image-outline" size={30} color={colors.charcoal} />
                    </LinearGradient>
                    <View style={[styles.productStatusBadge, { backgroundColor: colors.gold + 'E6' }]}>
                      <Text style={styles.productStatusText}>En Stock</Text>
                    </View>
                  </View>

                  <View style={styles.productContent}>
                    <Text style={[styles.productName, { color: colors.charcoal }]}>{product.name}</Text>
                    <Text style={[styles.productPrice, { color: colors.gold }]}>{product.price}</Text>
                    <Text style={[styles.productDescription, { color: colors.charcoal }]}>{product.description}</Text>

                    <StarRating rating={product.rating} />

                    <View style={[styles.productActions, { borderTopColor: colors.gold + '1A' }]}>
                      <TouchableOpacity style={styles.productActionButton}>
                        <MaterialCommunityIcons name="pencil" size={18} color={colors.gold} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.productActionButton}>
                        <MaterialCommunityIcons name="content-duplicate" size={18} color={colors.gold} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.productActionButton}>
                        <MaterialCommunityIcons name="delete-outline" size={18} color="#C95050" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </AnimatedButton>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  blurCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 25,
    padding: 35,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  luxuryLogo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoLine: {
    width: 60,
    height: 2,
    marginTop: 40,
  },
  luxuryTitle: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 4,
  },
  luxurySubtitle: {
    fontSize: 16,
    marginTop: 5,
    letterSpacing: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 128,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 15,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  roleSelection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    width: '98%',
    overflow: 'hidden',
    borderRadius: 15,
  },
  roleButtonGradient: {
    padding: 25,
    alignItems: 'center',
    borderRadius: 15,
  },
  roleButtonText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    marginTop: 20,
  },

  // Styles pour l'espace client
  clientHeaderSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  clientSectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 10,
    letterSpacing: 1.5,
  },
  clientMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  clientDivider: {
    width: '50%',
    height: 1,
    marginVertical: 25,
  },
  clientRedirectText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  clientActionButton: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 30,
    marginBottom: 15,
  },
  clientActionButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 30,
  },
  clientActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  clientBackButton: {
    marginTop: 15,
  },
  clientBackButtonText: {
    fontSize: 14,
  },

  // Styles pour la promotion
  promoContainer: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 25,
    padding: 30,
    marginTop: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 1,
  },
  promoDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  promoCodeContainer: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    borderWidth: 1,
    alignSelf: 'center',
    marginBottom: 20,
  },
  promoCode: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
  },
  promoButton: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 30,
  },
  promoButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 30,
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Styles pour l'espace artisan
  containerFull: {
    flex: 1,
  },
  luxuryHeader: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerBackButton: {
    position: 'absolute',
    left: 20,
    top: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerRight: {
    position: 'absolute',
    right: 20,
    top: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerNotifButton: {
    marginLeft: 10,
  },
  notificationBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },

  // Bannière de bienvenue
  welcomeBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  welcomeBannerGradient: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeBannerText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },
  welcomeBannerQuote: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.8,
  },

  // Carte de profil
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileCardGradient: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageFrame: {
    width: 90,
    height: 90,
    borderRadius: 45,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  profileBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  profileMetier: {
    fontSize: 16,
    marginBottom: 4,
  },
  profileLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileLocationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  profileDivider: {
    height: 1,
    marginVertical: 15,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 50,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },

  // Créations en vedette
  featuredSection: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  featuredCard: {
    width: 200,
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 1,
    overflow: 'hidden',
  },
  featuredImagePlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredContent: {
    padding: 10,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  featuredPrice: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },

  // Témoignages
  testimonialSection: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  testimonialCard: {
    width: 250,
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    borderWidth: 1,
  },
  testimonialComment: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  testimonialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testimonialName: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Panneau d'actions
  actionPanel: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  luxuryActionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  actionButtonIcon: {
    marginRight: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },

  // Bouton créatif
  luxuryCreativeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  creativeButtonGradient: {
    justifyContent: 'center',
    paddingVertical: 20,
    alignItems: 'center',
  },
  creativeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 10,
  },

  // Quick stats
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 5,
  },
  quickStatTitle: {
    fontSize: 12,
    marginBottom: 5,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '700',
  },

  // Panneau promo
  promoPanel: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  promoPanelGradient: {
    padding: 20,
    alignItems: 'center',
  },
  promoTipTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 8,
  },
  promoTipText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  promoTipButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
  },
  promoTipButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Gestion des produits
  productsScrollContainer: {
    flex: 1,
    padding: 15,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  productsTitleContainer: {
    flex: 1,
  },
  productsMainTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  productsSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  backToDashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  backToDashboardText: {
    fontSize: 14,
    marginLeft: 5,
  },

  // Ajouter produit
  addProductButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  addProductButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  addProductButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },

  // Catégories
  productCategoriesContainer: {
    marginBottom: 20,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryTabActive: {
  },
  categoryTabText: {
    fontSize: 14,
  },
  categoryTabTextActive: {
    fontWeight: '600',
  },

  // Grille de produits
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  luxuryProductCard: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    width: '132%',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  productImageContainer: {
    height: 150,
    position: 'relative',
  },
  productImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productStatusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  productStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
  },
  productContent: {
    padding: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '500',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  productActionButton: {
    padding: 8,
    marginLeft: 8,
  },
});