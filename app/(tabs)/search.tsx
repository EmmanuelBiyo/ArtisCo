import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Animated,
  ScrollView,
  Modal,
  Pressable,
  StatusBar,
  Linking,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

// Données fictives complètes (50 artisans, 5 par catégorie)
const mockArtisans = [
  // Menuiserie
  { id: '1', name: 'Koffi Jean', job: 'Menuisier', rating: 4.0, distance: 3.5, locality: 'Cocody', class: 'Expert', experience: '15 ans', description: 'Meubles sur mesure.', contact: 'koffi.jean@artisco.ci', phone: '+22501234567', whatsapp: '+22501234567', projects: '120 projets', certifications: 'CAP Menuiserie' },
  { id: '2', name: 'Aka Michel', job: 'Menuisier', rating: 4.2, distance: 2.8, locality: 'Marcory', class: 'Confirmé', experience: '10 ans', description: 'Portes et fenêtres.', contact: 'aka.michel@artisco.ci', phone: '+22501234568', whatsapp: '+22501234568', projects: '80 projets', certifications: 'BEP Bois' },
  { id: '3', name: 'Yao Paul', job: 'Menuisier', rating: 3.8, distance: 4.0, locality: 'Yopougon', class: 'Artisan', experience: '7 ans', description: 'Charpentes.', contact: 'yao.paul@artisco.ci', phone: '+22501234569', whatsapp: '+22501234569', projects: '50 projets', certifications: 'Formation artisanale' },
  { id: '4', name: 'N’Guessan Luc', job: 'Menuisier', rating: 4.5, distance: 1.9, locality: 'Treichville', class: 'Maître', experience: '20 ans', description: 'Restauration.', contact: 'nguessan.luc@artisco.ci', phone: '+22501234570', whatsapp: '+22501234570', projects: '200 projets', certifications: 'Maîtrise artisanale' },
  { id: '5', name: 'Kouamé David', job: 'Menuisier', rating: 4.3, distance: 3.2, locality: 'Abobo', class: 'Confirmé', experience: '12 ans', description: 'Escaliers.', contact: 'kouame.david@artisco.ci', phone: '+22501234571', whatsapp: '+22501234571', projects: '90 projets', certifications: 'CAP Menuiserie' },
  // Couture
  { id: '6', name: 'Marie Kouakou', job: 'Couture', rating: 5.0, distance: 1.8, locality: 'Adjamé', class: 'Experte', experience: '18 ans', description: 'Robes de cérémonie.', contact: 'marie.kouakou@artisco.ci', phone: '+22501234572', whatsapp: '+22501234572', projects: '150 projets', certifications: 'CAP Couture' },
  { id: '7', name: 'Fatou Diarra', job: 'Couture', rating: 4.7, distance: 2.5, locality: 'Plateau', class: 'Confirmée', experience: '9 ans', description: 'Vêtements traditionnels.', contact: 'fatou.diarra@artisco.ci', phone: '+22501234573', whatsapp: '+22501234573', projects: '70 projets', certifications: 'BEP Couture' },
  { id: '8', name: 'Aminata Sylla', job: 'Couture', rating: 4.4, distance: 3.1, locality: 'Koumassi', class: 'Artisane', experience: '6 ans', description: 'Retouches.', contact: 'aminata.sylla@artisco.ci', phone: '+22501234574', whatsapp: '+22501234574', projects: '40 projets', certifications: 'Formation pratique' },
  { id: '9', name: 'Rose Tano', job: 'Couture', rating: 4.9, distance: 2.0, locality: 'Cocody', class: 'Maîtresse', experience: '22 ans', description: 'Couture haute gamme.', contact: 'rose.tano@artisco.ci', phone: '+22501234575', whatsapp: '+22501234575', projects: '180 projets', certifications: 'Maîtrise couture' },
  { id: '10', name: 'Sophie Bohoussou', job: 'Couture', rating: 4.6, distance: 2.7, locality: 'Marcory', class: 'Confirmée', experience: '11 ans', description: 'Uniformes.', contact: 'sophie.bohoussou@artisco.ci', phone: '+22501234576', whatsapp: '+22501234576', projects: '90 projets', certifications: 'CAP Couture' },
  // Plomberie
  { id: '11', name: 'Digbeu Franck', job: 'Plomberie', rating: 4.5, distance: 2.3, locality: 'Yopougon', class: 'Expert', experience: '14 ans', description: 'Sanitaires.', contact: 'digbeu.franck@artisco.ci', phone: '+22501234577', whatsapp: '+22501234577', projects: '150 projets', certifications: 'CAP Plomberie' },
  { id: '12', name: 'Konan Pierre', job: 'Plomberie', rating: 4.3, distance: 3.0, locality: 'Treichville', class: 'Confirmé', experience: '8 ans', description: 'Fuites.', contact: 'konan.pierre@artisco.ci', phone: '+22501234578', whatsapp: '+22501234578', projects: '70 projets', certifications: 'BEP Plomberie' },
  { id: '13', name: 'Traoré Issa', job: 'Plomberie', rating: 4.1, distance: 2.6, locality: 'Abobo', class: 'Artisan', experience: '5 ans', description: 'Canalisations.', contact: 'traore.issa@artisco.ci', phone: '+22501234579', whatsapp: '+22501234579', projects: '40 projets', certifications: 'Formation pratique' },
  { id: '14', name: 'Bamba Moussa', job: 'Plomberie', rating: 4.8, distance: 1.7, locality: 'Adjamé', class: 'Maître', experience: '19 ans', description: 'Irrigation.', contact: 'bamba.moussa@artisco.ci', phone: '+22501234580', whatsapp: '+22501234580', projects: '180 projets', certifications: 'Maîtrise plomberie' },
  { id: '15', name: 'Ouattara Sidi', job: 'Plomberie', rating: 4.4, distance: 3.3, locality: 'Plateau', class: 'Confirmé', experience: '10 ans', description: 'Chauffe-eau.', contact: 'ouattara.sidi@artisco.ci', phone: '+22501234581', whatsapp: '+22501234581', projects: '100 projets', certifications: 'CAP Plomberie' },
  // Tisserands
  { id: '16', name: 'Awa Traoré', job: 'Tisserand', rating: 4.8, distance: 2.7, locality: 'Koumassi', class: 'Experte', experience: '16 ans', description: 'Tissus traditionnels.', contact: 'awa.traore@artisco.ci', phone: '+22501234582', whatsapp: '+22501234582', projects: '160 projets', certifications: 'Formation traditionnelle' },
  { id: '17', name: 'Fanta Keïta', job: 'Tisserand', rating: 4.5, distance: 2.2, locality: 'Cocody', class: 'Confirmée', experience: '10 ans', description: 'Pagnes tissés.', contact: 'fanta.keita@artisco.ci', phone: '+22501234583', whatsapp: '+22501234583', projects: '80 projets', certifications: 'CAP Tissage' },
  { id: '18', name: 'Maimouna Diallo', job: 'Tisserand', rating: 4.3, distance: 3.4, locality: 'Marcory', class: 'Artisane', experience: '7 ans', description: 'Tapis.', contact: 'maimouna.diallo@artisco.ci', phone: '+22501234584', whatsapp: '+22501234584', projects: '50 projets', certifications: 'Formation artisanale' },
  { id: '19', name: 'Kadiatou Bah', job: 'Tisserand', rating: 4.9, distance: 1.6, locality: 'Yopougon', class: 'Maîtresse', experience: '20 ans', description: 'Tissus de cérémonie.', contact: 'kadiatou.bah@artisco.ci', phone: '+22501234585', whatsapp: '+22501234585', projects: '200 projets', certifications: 'Maîtrise tissage' },
  { id: '20', name: 'Safiatou Koné', job: 'Tisserand', rating: 4.6, distance: 2.9, locality: 'Treichville', class: 'Confirmée', experience: '12 ans', description: 'Rideaux.', contact: 'safiatou.kone@artisco.ci', phone: '+22501234586', whatsapp: '+22501234586', projects: '90 projets', certifications: 'CAP Tissage' },
  // Maçons
  { id: '21', name: 'Yao Serge', job: 'Maçons', rating: 4.2, distance: 4.1, locality: 'Abobo', class: 'Expert', experience: '15 ans', description: 'Maisons.', contact: 'yao.serge@artisco.ci', phone: '+22501234587', whatsapp: '+22501234587', projects: '100 projets', certifications: 'CAP Maçonnerie' },
  { id: '22', name: 'Kouassi André', job: 'Maçons', rating: 4.0, distance: 3.2, locality: 'Adjamé', class: 'Confirmé', experience: '9 ans', description: 'Murs.', contact: 'kouassi.andre@artisco.ci', phone: '+22501234588', whatsapp: '+22501234588', projects: '60 projets', certifications: 'BEP Maçonnerie' },
  { id: '23', name: 'Tano Éric', job: 'Maçons', rating: 3.9, distance: 2.8, locality: 'Plateau', class: 'Artisan', experience: '6 ans', description: 'Façades.', contact: 'tano.eric@artisco.ci', phone: '+22501234589', whatsapp: '+22501234589', projects: '40 projets', certifications: 'Formation pratique' },
  { id: '24', name: 'N’Dri Paul', job: 'Maçons', rating: 4.7, distance: 1.9, locality: 'Koumassi', class: 'Maître', experience: '18 ans', description: 'Pavés.', contact: 'ndri.paul@artisco.ci', phone: '+22501234590', whatsapp: '+22501234590', projects: '150 projets', certifications: 'Maîtrise maçonnerie' },
  { id: '25', name: 'Brou Albert', job: 'Maçons', rating: 4.4, distance: 3.0, locality: 'Cocody', class: 'Confirmé', experience: '11 ans', description: 'Escaliers.', contact: 'brou.albert@artisco.ci', phone: '+22501234591', whatsapp: '+22501234591', projects: '80 projets', certifications: 'CAP Maçonnerie' },
  // Électriciens
  { id: '26', name: 'Adama Koné', job: 'Électros', rating: 4.7, distance: 1.5, locality: 'Marcory', class: 'Expert', experience: '13 ans', description: 'Installations.', contact: 'adama.kone@artisco.ci', phone: '+22501234592', whatsapp: '+22501234592', projects: '140 projets', certifications: 'CAP Électricité' },
  { id: '27', name: 'Soro Ibrahim', job: 'Électros', rating: 4.5, distance: 2.4, locality: 'Yopougon', class: 'Confirmé', experience: '8 ans', description: 'Circuits.', contact: 'soro.ibrahim@artisco.ci', phone: '+22501234593', whatsapp: '+22501234593', projects: '60 projets', certifications: 'BEP Électricité' },
  { id: '28', name: 'Coulibaly Karim', job: 'Électros', rating: 4.2, distance: 3.1, locality: 'Treichville', class: 'Artisan', experience: '5 ans', description: 'Éclairage.', contact: 'coulibaly.karim@artisco.ci', phone: '+22501234594', whatsapp: '+22501234594', projects: '45 projets', certifications: 'Formation pratique' },
  { id: '29', name: 'Diarra Modibo', job: 'Électros', rating: 4.9, distance: 1.8, locality: 'Abobo', class: 'Maître', experience: '20 ans', description: 'Solaire.', contact: 'diarra.modibo@artisco.ci', phone: '+22501234595', whatsapp: '+22501234595', projects: '220 projets', certifications: 'Maîtrise électricité' },
  { id: '30', name: 'Bah Ousmane', job: 'Électros', rating: '4.6', distance: 2.6, locality: 'Adjamé', class: 'Confirmé', experience: '10 ans', description: 'Domotique.', contact: 'bah.ousmane@artisco.ci', phone: '+22501234596', whatsapp: '+22501234596', projects: '90 projets', certifications: 'CAP Électricité' },
  // Peinture
  { id: '31', name: 'Kouadio Alain', job: 'Peinture', rating: 4.3, distance: 3.0, locality: 'Plateau', class: 'Expert', experience: '12 ans', description: 'Intérieur.', contact: 'kouadio.alain@artisco.ci', phone: '+22501234597', whatsapp: '+22501234597', projects: '90 projets', certifications: 'CAP Peinture' },
  { id: '32', name: 'N’Zué Félix', job: 'Peinture', rating: 4.1, distance: 2.5, locality: 'Koumassi', class: 'Confirmé', experience: '7 ans', description: 'Décorative.', contact: 'nzue.felix@artisco.ci', phone: '+22501234598', whatsapp: '+22501234598', projects: '50 projets', certifications: 'BEP Peinture' },
  { id: '33', name: 'Ahoua Marc', job: 'Peinture', rating: 3.9, distance: 3.3, locality: 'Cocody', class: 'Artisan', experience: '5 ans', description: 'Revêtements.', contact: 'ahoua.marc@artisco.ci', phone: '+22501234599', whatsapp: '+22501234599', projects: '30 projets', certifications: 'Formation pratique' },
  { id: '34', name: 'Konaté Samba', job: 'Peinture', rating: 4.6, distance: 2.0, locality: 'Marcory', class: 'Maître', experience: '16 ans', description: 'Extérieur.', contact: 'konate.samba@artisco.ci', phone: '+22501234600', whatsapp: '+22501234600', projects: '120 projets', certifications: 'Maîtrise peinture' },
  { id: '35', name: 'Yéo Drissa', job: 'Peinture', rating: 4.4, distance: 2.8, locality: 'Yopougon', class: 'Confirmé', experience: '9 ans', description: 'Effets spéciaux.', contact: 'yeo.drissa@artisco.ci', phone: '+22501234601', whatsapp: '+22501234601', projects: '70 projets', certifications: 'CAP Peinture' },
  // Bricolage
  { id: '36', name: 'Moussa Bah', job: 'Bricolage', rating: 4.1, distance: 2.9, locality: 'Treichville', class: 'Expert', experience: '11 ans', description: 'Montage.', contact: 'moussa.bah@artisco.ci', phone: '+22501234602', whatsapp: '+22501234602', projects: '110 projets', certifications: 'CAP Bricolage' },
  { id: '37', name: 'Kouamé Jules', job: 'Bricolage', rating: 3.8, distance: 3.4, locality: 'Abobo', class: 'Confirmé', experience: '6 ans', description: 'Réparations.', contact: 'kouame.jules@artisco.ci', phone: '+22501234603', whatsapp: '+22501234503', projects: '55 projets', certifications: 'Formation artisanale' },
  { id: '38', name: 'Traoré Amadou', job: 'Bricolage', rating: 4.0, distance: 2.7, locality: 'Adjamé', class: 'Artisan', experience: '4 ans', description: 'Rideaux.', contact: 'traore.amadou@artisco.ci', phone: '+22501234604', whatsapp: '+22501234604', projects: '30 projets', certifications: 'Formation pratique' },
  { id: '39', name: 'Soro Lacina', job: 'Bricolage', rating: 4.5, distance: 1.9, locality: 'Plateau', class: 'Maître', experience: '14 ans', description: 'Polyvalent.', contact: 'soro.lacina@artisco.ci', phone: '+22501234605', whatsapp: '+22501234605', projects: '130 projets', certifications: 'Maîtrise artisanale' },
  { id: '40', name: 'Ouédraogo Idrissa', job: 'Bricolage', rating: 4.3, distance: 3.1, locality: 'Koumassi', class: 'Confirmé', experience: '8 ans', description: 'Aménagement.', contact: 'ouedraogo.idrissa@artisco.ci', phone: '+22501234606', whatsapp: '+22501234606', projects: '75 projets', certifications: 'CAP Bricolage' },
  // Poterie
  { id: '41', name: 'Aminata Sylla', job: 'Poterie', rating: 4.6, distance: 3.8, locality: 'Cocody', class: 'Experte', experience: '17 ans', description: 'Vases.', contact: 'aminata.sylla2@artisco.ci', phone: '+22501234607', whatsapp: '+22501234607', projects: '140 projets', certifications: 'Formation traditionnelle' },
  { id: '42', name: 'Kouassi Grâce', job: 'Poterie', rating: 4.4, distance: 2.6, locality: 'Marcory', class: 'Confirmée', experience: '10 ans', description: 'Pots.', contact: 'kouassi.grace@artisco.ci', phone: '+22501234608', whatsapp: '+22501234608', projects: '80 projets', certifications: 'CAP Poterie' },
  { id: '43', name: 'N’Dri Marie', job: 'Poterie', rating: 4.2, distance: 3.0, locality: 'Yopougon', class: 'Artisane', experience: '6 ans', description: 'Utilitaires.', contact: 'ndri.marie@artisco.ci', phone: '+22501234609', whatsapp: '+22501234609', projects: '50 projets', certifications: 'Formation pratique' },
  { id: '44', name: 'Tano Véronique', job: 'Poterie', rating: 4.8, distance: 2.1, locality: 'Treichville', class: 'Maîtresse', experience: '19 ans', description: 'Sculptures.', contact: 'tano.veronique@artisco.ci', phone: '+22501234610', whatsapp: '+22501234610', projects: '160 projets', certifications: 'Maîtrise poterie' },
  { id: '45', name: 'Bohoussou Esther', job: 'Poterie', rating: 4.5, distance: 2.9, locality: 'Abobo', class: 'Confirmée', experience: '12 ans', description: 'Articles de table.', contact: 'bohoussou.esther@artisco.ci', phone: '+22501234611', whatsapp: '+22501234611', projects: '90 projets', certifications: 'CAP Poterie' },
  // Vannerie
  { id: '46', name: 'Sékou Camara', job: 'Vannerie', rating: 4.4, distance: 2.0, locality: 'Adjamé', class: 'Expert', experience: '15 ans', description: 'Paniers.', contact: 'sekou.camara@artisco.ci', phone: '+22501234612', whatsapp: '+22501234612', projects: '100 projets', certifications: 'Formation traditionnelle' },
  { id: '47', name: 'Koné Bakary', job: 'Vannerie', rating: 4.2, distance: 3.2, locality: 'Plateau', class: 'Confirmé', experience: '9 ans', description: 'Meubles.', contact: 'kone.bakary@artisco.ci', phone: '+22501234613', whatsapp: '+22501234613', projects: '60 projets', certifications: 'CAP Vannerie' },
  { id: '48', name: 'Diallo Ibrahima', job: 'Vannerie', rating: 4.0, distance: 2.8, locality: 'Koumassi', class: 'Artisan', experience: '5 ans', description: 'Sacs.', contact: 'diallo.ibrahima@artisco.ci', phone: '+22501234614', whatsapp: '+22501234614', projects: '40 projets', certifications: 'Formation pratique' },
  { id: '49', name: 'Traoré Yaya', job: 'Vannerie', rating: 4.7, distance: 1.7, locality: 'Cocody', class: 'Maître', experience: '18 ans', description: 'Rotin.', contact: 'traore.mamadou@artisco.ci', phone: '+22501234615', whatsapp: '+22501234615', projects: '150 projets', certifications: 'Maîtrise vannerie' },
  { id: '50', name: 'Keïta Souleymane', job: 'Vannerie', rating: 4.5, distance: 2.5, locality: 'Marcory', class: 'Confirmé', experience: '11 ans', description: 'Utilitaires.', contact: 'keita.souleymane@artisco.ci', phone: '+22501234616', whatsapp: '+22501234616', projects: '80 projets', certifications: 'CAP Vannerie' },
];

const popularServices = [
  'Menuisier', 'Couture', 'Plomberie', 'Tisserand', 'Maçons',
  'Électros', 'Peinture', 'Bricolage', 'Poterie', 'Vannerie',
];

const categoryColors = {
  Menuiserie: '#A0522D', // Sienne douce
  Couture: '#DB7093', // Rose pâle
  Plomberie: '#4682B4', // Bleu acier
  Tisserand: '#2E8B57', // Vert mer
  Maçons: '#708090', // Gris ardoise
  Électriciens: '#FFD700', // Doré
  Peinture: '#FF6347', // Corail
  Bricolage: '#483D8B', // Violet sombre
  Poterie: '#CD853F', // Terre cuite
  Vannerie: '#F4A460', // Sable
};

const categoryIcons = {
  Menuiserie: 'tools',
  Couture: 'needle',
  Plomberie: 'pipe-wrench',
  Tisserands: 'tools',
  Maçons: 'hammer',
  Électriciens: 'lightbulb-on',
  Peinture: 'brush',
  Bricolage: 'hammer',
  Poterie: 'pot',
  Vannerie: 'basket',
};

// Regroupement des artisans par catégorie
const getArtisansByJob = () => {
  const grouped = {};
  popularServices.forEach(service => {
    grouped[service] = mockArtisans.filter(a => a.job === service);
  });
  return grouped;
};

// Artisans en vedette (mieux notés)
const getFeaturedArtisans = () => {
  return [...mockArtisans].sort((a, b) => b.rating - a.rating).slice(0, 5);
};

// Artisans à proximité (plus proches)
const getNearbyArtisans = () => {
  return [...mockArtisans].sort((a, b) => a.distance - b.distance).slice(0, 5);
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState('');
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Parlez maintenant');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(50)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const waveAnim1 = useRef(new Animated.Value(0.5)).current;
  const waveAnim2 = useRef(new Animated.Value(0.5)).current;
  const waveAnim3 = useRef(new Animated.Value(0.5)).current;

  // Animation d’apparition
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(cardsAnim, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animation des ondes sonores
  const startWaveAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim1, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim1, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim2, {
          toValue: 1,
          duration: 500,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim2, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim3, {
          toValue: 1,
          duration: 500,
          delay: 400,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim3, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Liste de recherches vocales simulées
  const simulatedVoiceQueries = [
    'Menuisier',
    'Couture',
    'Plomberie',
    'Koffi Jean',
    'Marie Kouakou',
  ];

  // Simuler une recherche vocale
  const simulateVoiceSearch = () => {
    setIsVoiceModalVisible(true);
    setVoiceStatus('Parlez maintenant');
    startWaveAnimation();

    // Simuler l'écoute pendant 3 secondes
    setTimeout(() => {
      setVoiceStatus('Écoute terminée avec succès');
      const randomQuery = simulatedVoiceQueries[Math.floor(Math.random() * simulatedVoiceQueries.length)];
      setSearchQuery(randomQuery);
      handleSearch(randomQuery);

      // Fermer la modale après 1 seconde supplémentaire
      setTimeout(() => {
        setIsVoiceModalVisible(false);
      }, 1000);
    }, 3000);
  };

  // Gérer la recherche et les suggestions
  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearchActive(query.length > 0);
    
    if (query.length > 0) {
      const filteredSuggestions = popularServices.filter((service) =>
        service.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);

      const filtered = mockArtisans.filter((artisan) =>
        artisan.job.toLowerCase().includes(query.toLowerCase()) || 
        artisan.name.toLowerCase().includes(query.toLowerCase())
      );
      filtered.sort((a, b) => a.distance - b.distance);
      setFilteredArtisans(filtered);

      // Simuler un retour vocal (texte affiché)
      setVoiceFeedback(
        filtered.length > 0
          ? `J'ai trouvé ${filtered.length} artisans pour ${query}.`
          : `Aucun artisan trouvé pour ${query}.`
      );
    } else {
      setSuggestions([]);
      setFilteredArtisans([]);
      setIsSearchActive(false);
      setVoiceFeedback('');
    }
  };

  // Sélectionner une suggestion
  const selectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    setSelectedCategory(suggestion);
    setSuggestions([]);
    const filtered = mockArtisans.filter((artisan) => artisan.job === suggestion);
    filtered.sort((a, b) => a.distance - b.distance);
    setFilteredArtisans(filtered);
    setIsSearchActive(true);
    setVoiceFeedback(`J'ai trouvé ${filtered.length} artisans pour ${suggestion}.`);
  };

  // Sélectionner une catégorie
  const selectCategory = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setSuggestions([]);
    const filtered = mockArtisans.filter((artisan) => artisan.job === category);
    filtered.sort((a, b) => a.distance - b.distance);
    setFilteredArtisans(filtered);
    setIsSearchActive(true);
    setVoiceFeedback(`J'ai trouvé ${filtered.length} artisans pour ${category}.`);
  };

  // Ouvrir la modale
  const openModal = (artisan) => {
    setSelectedArtisan(artisan);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Fermer la modale
  const closeModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedArtisan(null));
  };

  // Lancer un appel téléphonique
  const callArtisan = (phone) => {
    const phoneNumber = `tel:${phone}`;
    Linking.openURL(phoneNumber).catch((err) => console.error('Erreur lors de l’appel:', err));
    closeModal();
  };

  // Contacter via WhatsApp
  const contactWhatsApp = (whatsapp) => {
    const whatsappUrl = `whatsapp://send?phone=${whatsapp}&text=Bonjour, je vous contacte via ArtisCo pour un service.`;
    Linking.openURL(whatsappUrl).catch((err) => console.error('Erreur WhatsApp:', err));
    closeModal();
  };

  // Réinitialiser la recherche
  const resetSearch = () => {
    setSearchQuery('');
    setIsSearchActive(false);
    setSuggestions([]);
    setSelectedCategory(null);
    setFilteredArtisans([]);
    setVoiceFeedback('');
  };

  // Rendu pour une section
  const renderSection = ({ title, data, horizontal = true, renderItem }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {horizontal ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {data.map((item, index) => (
            <View key={item.id || index}>{renderItem({ item })}</View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.gridContainer}>
          {data.map((item, index) => (
            <View key={item.id || index} style={styles.gridItem}>
              {renderItem({ item })}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  // Rendu des catégories
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => selectCategory(item)}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        }}
      >
        <View
          style={[
            styles.categoryIconCircle,
            { backgroundColor: categoryColors[item] || '#1A3C34' },
          ]}
        >
          <MaterialCommunityIcons
            name={categoryIcons[item] || 'tools'}
            size={24}
            color="#FFFFFF"
          />
        </View>
        <Text style={styles.categoryText}>{item}</Text>
      </Animated.View>
    </TouchableOpacity>
  );

  // Rendu des artisans en vedette
  const renderFeaturedArtisan = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredArtisanCard}
      onPress={() => openModal(item)}
    >
      <View
        style={[
          styles.featuredArtisanIconCircle,
          { backgroundColor: categoryColors[item.job] || '#1A3C34' },
        ]}
      >
        <FontAwesome5 name="user-tie" size={24} color="#fff" />
      </View>
      <Text style={styles.featuredArtisanName}>{item.name}</Text>
      <Text style={styles.featuredArtisanJob}>{item.job}</Text>
      <View style={styles.ratingContainer}>
        {[...Array(Math.floor(item.rating))].map((_, i) => (
          <Ionicons key={i} name="star" size={14} color="#FFD700" />
        ))}
        {item.rating % 1 !== 0 && (
          <Ionicons name="star-half" size={14} color="#FFD700" />
        )}
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  // Rendu des artisans à proximité
  const renderNearbyArtisan = ({ item }) => (
    <TouchableOpacity
      style={styles.nearbyArtisanCard}
      onPress={() => openModal(item)}
    >
      <View style={styles.artisanCardHeader}>
        <View
          style={[
            styles.artisanIconCircle,
            { backgroundColor: categoryColors[item.job] || '#1A3C34' },
          ]}
        >
          <FontAwesome5 name="user-tie" size={20} color="#fff" />
        </View>
        <View>
          <Text style={styles.artisanName}>{item.name}</Text>
          <Text style={styles.artisanJob}>{item.job}</Text>
        </View>
      </View>
      <View style={styles.artisanCardFooter}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.distanceText}>{item.distance} km</Text>
      </View>
    </TouchableOpacity>
  );

  // Rendu des artisans dans la recherche
  const renderSearchArtisan = ({ item }) => (
    <Animated.View
      style={[
        styles.searchArtisanCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: cardsAnim }],
          borderLeftColor: categoryColors[item.job] || '#1A3C34',
        },
      ]}
    >
      <TouchableOpacity style={styles.artisanTouchable} onPress={() => openModal(item)}>
        <View
          style={[
            styles.searchArtisanIconCircle,
            { backgroundColor: categoryColors[item.job] || '#1A3C34' },
          ]}
        >
          <FontAwesome5 name="user-tie" size={24} color="#fff" />
        </View>
        <View style={styles.searchArtisanInfo}>
          <Text style={styles.searchArtisanName}>{item.name}</Text>
          <Text style={styles.searchArtisanJob}>{item.job}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(Math.floor(item.rating))].map((_, i) => (
              <Ionicons key={i} name="star" size={14} color="#FFD700" />
            ))}
            {item.rating % 1 !== 0 && (
              <Ionicons name="star-half" size={14} color="#FFD700" />
            )}
            <Text style={styles.ratingText}>({item.rating})</Text>
          </View>
          <Text style={styles.distanceText}>
            {item.locality} • {item.distance} km
          </Text>
        </View>
        <TouchableOpacity
          style={styles.serviceButton}
          onPress={() => openModal(item)}
        >
          <Text style={styles.serviceButtonText}>Accéder aux services</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1A3C34" barStyle="light-content" />

      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.logoText}>ArtisCo</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Trouver un artisan..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={resetSearch}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={simulateVoiceSearch}>
              <Ionicons name="mic" size={24} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Modale de simulation vocale */}
      <Modal
        transparent={true}
        visible={isVoiceModalVisible}
        animationType="fade"
      >
        <View style={styles.voiceModalContainer}>
          <View style={styles.voiceModalContent}>
            <View style={styles.waveContainer}>
              <Animated.View
                style={[
                  styles.waveBar,
                  {
                    transform: [
                      {
                        scaleY: waveAnim1.interpolate({
                          inputRange: [0.5, 1],
                          outputRange: [0.5, 1.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveBar,
                  {
                    transform: [
                      {
                        scaleY: waveAnim2.interpolate({
                          inputRange: [0.5, 1],
                          outputRange: [0.5, 2],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveBar,
                  {
                    transform: [
                      {
                        scaleY: waveAnim3.interpolate({
                          inputRange: [0.5, 1],
                          outputRange: [0.5, 1.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
            <Text style={styles.voiceModalText}>{voiceStatus}</Text>
          </View>
        </View>
      </Modal>

      {/* Retour vocal simulé */}
      {voiceFeedback.length > 0 && (
        <View style={styles.voiceFeedbackContainer}>
          <Text style={styles.voiceFeedbackText}>{voiceFeedback}</Text>
        </View>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => selectSuggestion(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {isSearchActive ? (
        // Résultats de recherche
        <View style={styles.searchResultsContainer}>
          <View style={styles.searchResultsHeader}>
            <Text style={styles.searchResultsTitle}>
              {filteredArtisans.length} artisans trouvés
            </Text>
            <TouchableOpacity onPress={resetSearch}>
              <Text style={styles.resetSearchText}>Annuler</Text>
            </TouchableOpacity>
          </View>

          {filteredArtisans.length > 0 ? (
            <FlatList
              data={filteredArtisans}
              renderItem={renderSearchArtisan}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.searchResultsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noResultsText}>
              Aucun artisan pour "{searchQuery}"
            </Text>
          )}
        </View>
      ) : (
        // Écran d’accueil
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.homeContent}
        >
          {/* Bannière */}
          <View style={styles.promotionBanner}>
            <Text style={styles.promotionTitle}>Votre artisan idéal</Text>
            <Text style={styles.promotionSubtitle}>
              Qualité et proximité pour vos projets
            </Text>
          </View>

          {/* Catégories */}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Catégories</Text>
            <View style={styles.categoriesGrid}>
              {popularServices.map((category) => (
                <View key={category}>{renderCategory({ item: category })}</View>
              ))}
            </View>
          </View>

          {/* Artisans en vedette */}
          {renderSection({
            title: "Artisans en vedette",
            data: getFeaturedArtisans(),
            renderItem: renderFeaturedArtisan,
          })}

          {/* Artisans à proximité */}
          {renderSection({
            title: "Artisans près de chez vous",
            data: getNearbyArtisans(),
            horizontal: false,
            renderItem: renderNearbyArtisan,
          })}
        </ScrollView>
      )}

      {/* Modale artisan */}
      {selectedArtisan && (
        <Modal transparent={true} visible={!!selectedArtisan} animationType="none">
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: modalAnim,
                transform: [
                  {
                    scale: modalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedArtisan.name}</Text>
                <Pressable onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#1A3C34" />
                </Pressable>
              </View>

              <View style={styles.modalProfile}>
                <View
                  style={[
                    styles.modalProfileIcon,
                    { backgroundColor: categoryColors[selectedArtisan.job] || '#1A3C34' },
                  ]}
                >
                  <FontAwesome5 name="user-tie" size={40} color="#fff" />
                </View>
                <View style={styles.modalProfileInfo}>
                  <Text style={styles.modalProfileJob}>{selectedArtisan.job}</Text>
                  <View style={styles.modalRatingContainer}>
                    {[...Array(Math.floor(selectedArtisan.rating))].map((_, i) => (
                      <Ionicons key={i} name="star" size={16} color="#FFD700" />
                    ))}
                    {selectedArtisan.rating % 1 !== 0 && (
                      <Ionicons name="star-half" size={16} color="#FFD700" />
                    )}
                    <Text style={styles.modalRatingText}>
                      {selectedArtisan.rating}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.modalInfoItem}>
                  <Ionicons name="location" size={20} color="#6B7280" />
                  <Text style={styles.modalInfoText}>
                    {selectedArtisan.locality} ({selectedArtisan.distance} km)
                  </Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Ionicons name="medal" size={20} color="#6B7280" />
                  <Text style={styles.modalInfoText}>
                    {selectedArtisan.class} • {selectedArtisan.experience}
                  </Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Ionicons name="briefcase" size={20} color="#6B7280" />
                  <Text style={styles.modalInfoText}>
                    {selectedArtisan.description}
                  </Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Ionicons name="construct" size={20} color="#6B7280" />
                  <Text style={styles.modalInfoText}>
                    {selectedArtisan.projects}
                  </Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Ionicons name="school" size={20} color="#6B7280" />
                  <Text style={styles.modalInfoText}>
                    {selectedArtisan.certifications}
                  </Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Ionicons name="mail" size={20} color="#6B7280" />
                  <Text style={styles.modalInfoText}>
                    {selectedArtisan.contact}
                  </Text>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.whatsappButton]}
                  onPress={() => contactWhatsApp(selectedArtisan.whatsapp)}
                >
                  <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                  <Text style={styles.modalButtonText}>WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.callButton]}
                  onPress={() => callArtisan(selectedArtisan.phone)}
                >
                  <Ionicons name="call" size={20} color="#fff" />
                  <Text style={styles.modalButtonText}>Appeler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FA',
  },
  header: {
    backgroundColor: '#1A3C34',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notificationIcon: {
    padding: 5,
  },
  searchBarContainer: {
    backgroundColor: '#1A3C34',
    paddingHorizontal: 16,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A3C34',
    fontWeight: '500',
  },
  voiceModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  voiceModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  waveBar: {
    width: 10,
    height: 40,
    backgroundColor: '#1A3C34',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  voiceModalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A3C34',
  },
  voiceFeedbackContainer: {
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  voiceFeedbackText: {
    fontSize: 14,
    color: '#1A3C34',
    textAlign: 'center',
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  suggestionText: {
    fontSize: 16,
    color: '#1A3C34',
    fontWeight: '600',
  },
  homeContent: {
    paddingBottom: 0,
  },
  promotionBanner: {
    backgroundColor: '#FFD700',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A3C34',
    marginBottom: 6,
  },
  promotionSubtitle: {
    fontSize: 14,
    color: '#1A3C34',
    opacity: 0.8,
  },
  categoriesSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A3C34',
    marginLeft: 16,
    marginBottom: 10,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: '47%',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A3C34',
    textAlign: 'center',
  },
  section: {
    marginVertical: 10,
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
  },
  gridItem: {
    width: '48%',
    marginBottom: 10,
    marginHorizontal: '1%',
  },
  featuredArtisanCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 15,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredArtisanIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredArtisanName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A3C34',
    marginBottom: 4,
    textAlign: 'center',
  },
  featuredArtisanJob: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    color: '#6B7280',
    fontSize: 12,
  },
  nearbyArtisanCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  artisanCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  artisanIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  artisanName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A3C34',
  },
  artisanJob: {
    fontSize: 12,
    color: '#6B7280',
  },
  artisanCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: '#6B7280',
  },
  searchResultsContainer: {
    flex: 1,
    backgroundColor: '#F4F7FA',
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A3C34',
  },
  resetSearchText: {
    fontSize: 14,
    color: '#1A3C34',
    fontWeight: '600',
  },
  searchResultsList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 0,
  },
  searchArtisanCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  artisanTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchArtisanIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  searchArtisanInfo: {
    flex: 1,
  },
  searchArtisanName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A3C34',
    marginBottom: 4,
  },
  searchArtisanJob: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  serviceButton: {
    backgroundColor: '#1A3C34',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  serviceButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: '90%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A3C34',
  },
  modalProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalProfileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  modalProfileInfo: {
    flex: 1,
  },
  modalProfileJob: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A3C34',
    marginBottom: 4,
  },
  modalRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRatingText: {
    marginLeft: 4,
    color: '#6B7280',
    fontSize: 14,
  },
  modalBody: {
    padding: 15,
  },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalInfoText: {
    fontSize: 14,
    color: '#1A3C34',
    marginLeft: 10,
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  callButton: {
    backgroundColor: '#FFD700',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});