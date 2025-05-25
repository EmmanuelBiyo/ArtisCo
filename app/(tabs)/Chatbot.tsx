import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  Vibration
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Messages prédéfinis pour la simulation
const PREDEFINED_RESPONSES = {
  greetings: [
    "Bonjour ! Je suis ArtiBot, votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?",
    "Salut ! Prêt à trouver l'artisan parfait ? Que recherchez-vous ?",
    "Hello ! Je suis là pour vous aider à trouver les meilleurs artisans de votre région."
  ],
  services: {
    "plomberie": {
      text: "J'ai trouvé 5 plombiers excellents près de chez vous ! Digbeu Franck (4.5⭐) est disponible aujourd'hui. Voulez-vous voir son profil ?",
      actions: ["Voir le profil", "Appeler maintenant", "Demander un devis"]
    },
    "menuiserie": {
      text: "Super choix ! J'ai 3 menuisiers expérimentés dans votre zone. Jean Kouassi (4.8⭐) fait du travail exceptionnel. Intéressé ?",
      actions: ["Voir ses réalisations", "Contacter", "Comparer les prix"]
    },
    "couture": {
      text: "Marie Kouakou (5.0⭐) est notre couturière la mieux notée ! Elle est spécialisée dans les créations sur mesure. Dois-je la contacter ?",
      actions: ["Voir le portfolio", "Prendre RDV", "Obtenir un devis"]
    },
    "électricité": {
      text: "Paul Yao (4.7⭐) est un électricien certifié disponible cette semaine. Il peut intervenir en urgence si besoin !",
      actions: ["Intervention urgente", "Planifier visite", "Voir les tarifs"]
    },
    "maçonnerie": {
      text: "J'ai trouvé Koné André (4.6⭐), maçon avec 15 ans d'expérience. Il excelle dans les gros œuvres. Voulez-vous son devis ?",
      actions: ["Demander devis", "Voir ses projets", "Planifier visite"]
    }
  },
  help: [
    "Je peux vous aider à : \n• Trouver des artisans qualifiés\n• Comparer les prix et avis\n• Prendre rendez-vous\n• Obtenir des devis gratuits",
    "Mes services incluent :\n• Recherche d'artisans par métier\n• Consultation des avis clients\n• Prise de rendez-vous instantanée\n• Support technique"
  ],
  default: [
    "Hmm, je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre demande ?",
    "Désolé, pouvez-vous être plus précis ? Je peux vous aider avec la recherche d'artisans.",
    "Je n'ai pas bien saisi. Tapez 'aide' pour voir ce que je peux faire pour vous !"
  ]
};

const QUICK_SUGGESTIONS = [
  "Trouver un plombier",
  "Menuisier près de moi",
  "Couturière experte",
  "Électricien d'urgence",
  "Devis gratuit",
  "Comment ça marche ?"
];

export default function ChatbotScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis ArtiBot 🤖\n\nJe suis là pour vous aider à trouver les meilleurs artisans de votre région. Que puis-je faire pour vous ?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollViewRef = useRef(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const typingAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de typing
    const typingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(typingAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    if (isTyping) {
      typingAnimation.start();
    } else {
      typingAnimation.stop();
    }

    return () => typingAnimation.stop();
  }, [isTyping]);

  // Animation de pulse pour le bouton d'envoi
  useEffect(() => {
    if (inputText.trim()) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [inputText]);

  // Fonction pour générer une réponse du bot
  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Salutations
    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
      return {
        text: PREDEFINED_RESPONSES.greetings[Math.floor(Math.random() * PREDEFINED_RESPONSES.greetings.length)],
        actions: ["Explorer les services", "Voir les artisans populaires", "Aide"]
      };
    }
    
    // Services spécifiques
    for (const [service, response] of Object.entries(PREDEFINED_RESPONSES.services)) {
      if (message.includes(service)) {
        return response;
      }
    }
    
    // Aide
    if (message.includes('aide') || message.includes('help') || message.includes('comment')) {
      return {
        text: PREDEFINED_RESPONSES.help[Math.floor(Math.random() * PREDEFINED_RESPONSES.help.length)],
        actions: ["Commencer une recherche", "Voir les catégories", "Support technique"]
      };
    }
    
    // Prix/devis
    if (message.includes('prix') || message.includes('devis') || message.includes('coût')) {
      return {
        text: "Les devis sont gratuits et personnalisés ! La plupart de nos artisans proposent :\n• Déplacement gratuit\n• Devis sous 24h\n• Tarifs transparents\n\nVoulez-vous que je vous mette en contact avec un artisan ?",
        actions: ["Demander un devis", "Comparer les prix", "Voir les tarifs moyens"]
      };
    }
    
    // Urgence
    if (message.includes('urgent') || message.includes('rapidement') || message.includes('vite')) {
      return {
        text: "Pour les urgences, j'ai des artisans disponibles 24h/24 ! 🚨\n\nDigbeu Franck (plomberie) et Paul Yao (électricité) interviennent en moins de 2h. Dois-je les contacter ?",
        actions: ["Appeler maintenant", "Voir disponibilités", "Service d'urgence"]
      };
    }
    
    // Réponse par défaut
    return {
      text: PREDEFINED_RESPONSES.default[Math.floor(Math.random() * PREDEFINED_RESPONSES.default.length)],
      actions: ["Recommencer", "Voir l'aide", "Parler à un humain"]
    };
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    // Vibration légère au tap
    Vibration.vibrate(50);

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setShowSuggestions(false);

    // Simuler le temps de réponse du bot
    setTimeout(() => {
      const response = generateBotResponse(inputText);
      const botResponse = {
        id: messages.length + 2,
        text: response.text,
        actions: response.actions,
        isBot: true,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleQuickSuggestion = (suggestion) => {
    setInputText(suggestion);
    Vibration.vibrate(30);
  };

  const handleActionPress = (action) => {
    Vibration.vibrate(50);
    
    const actionMessage = {
      id: messages.length + 1,
      text: action,
      isBot: false,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isAction: true
    };

    setMessages(prev => [...prev, actionMessage]);
    setIsTyping(true);

    // Réponse contextuelle selon l'action
    setTimeout(() => {
      let responseText = "";
      
      if (action.includes('profil') || action.includes('portfolio')) {
        responseText = "Voici le profil détaillé ! ⭐ Note: 4.8/5 | 📍 Abidjan | ✅ Certifié | 💼 +50 projets réalisés\n\nVoulez-vous le contacter directement ?";
      } else if (action.includes('Appeler') || action.includes('Contacter')) {
        responseText = "Perfect ! Je vais vous connecter avec l'artisan. 📞\n\nTéléphone: +225 07 XX XX XX XX\nDisponible: Maintenant\n\nVoulez-vous que je l'appelle pour vous ?";
      } else if (action.includes('devis')) {
        responseText = "Devis gratuit en cours de préparation ! 📋\n\nInformations nécessaires :\n• Type de travaux\n• Localisation\n• Budget approximatif\n\nVous recevrez le devis sous 2h par SMS/Email.";
      } else if (action.includes('tarifs') || action.includes('prix')) {
        responseText = "Voici les tarifs moyens dans votre région :\n\n💰 Intervention standard: 25,000 - 50,000 FCFA\n💰 Urgence: +30% de majoration\n💰 Déplacement: Souvent gratuit\n\nTarifs exacts dans le devis personnalisé !";
      } else {
        responseText = "Action prise en compte ! Je traite votre demande... Un conseiller va vous contacter sous peu. 👍";
      }

      const botResponse = {
        id: messages.length + 2,
        text: responseText,
        isBot: true,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const renderMessage = (message) => (
    <Animated.View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isBot ? styles.botMessageContainer : styles.userMessageContainer,
        { opacity: fadeAnim }
      ]}
    >
      {message.isBot && (
        <View style={styles.botAvatar}>
          <MaterialCommunityIcons name="robot" size={20} color="#fff" />
          <View style={styles.onlineIndicator} />
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        message.isBot ? styles.botBubble : styles.userBubble,
        message.isAction ? styles.actionBubble : null
      ]}>
        <Text style={[
          styles.messageText,
          message.isBot ? styles.botText : styles.userText,
          message.isAction ? styles.actionText : null
        ]}>
          {message.text}
        </Text>
        
        {/* Actions interactives */}
        {message.actions && (
          <View style={styles.actionsContainer}>
            {message.actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={() => handleActionPress(action)}
              >
                <Text style={styles.actionButtonText}>{action}</Text>
                <Ionicons name="chevron-forward" size={16} color="#1A3C34" />
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <Text style={[
          styles.timestamp,
          message.isBot ? styles.botTimestamp : styles.userTimestamp
        ]}>
          {message.timestamp}
        </Text>
      </View>
    </Animated.View>
  );

  const renderTypingIndicator = () => (
    <Animated.View style={[styles.messageContainer, styles.botMessageContainer, { opacity: typingAnim }]}>
      <View style={styles.botAvatar}>
        <MaterialCommunityIcons name="robot" size={20} color="#fff" />
        <View style={styles.onlineIndicator} />
      </View>
      <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
        <View style={styles.typingDots}>
          <Animated.View style={[styles.dot, { opacity: typingAnim }]} />
          <Animated.View style={[styles.dot, { opacity: typingAnim }]} />
          <Animated.View style={[styles.dot, { opacity: typingAnim }]} />
        </View>
        <Text style={styles.typingText}>ArtiBot écrit...</Text>
      </View>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.headerAvatar}>
            <MaterialCommunityIcons name="robot" size={24} color="#fff" />
            <View style={styles.onlineIndicator} />
          </View>
          <View>
            <Text style={styles.headerTitle}>ArtiBot</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.headerSubtitle}>En ligne • Répond instantanément</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        {isTyping && renderTypingIndicator()}
      </ScrollView>

      {/* Suggestions rapides */}
      {showSuggestions && (
        <Animated.View 
          style={[
            styles.suggestionsContainer,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.suggestionsTitle}>Suggestions rapides :</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContent}
          >
            {QUICK_SUGGESTIONS.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleQuickSuggestion(suggestion)}
              >
                <Ionicons name="flash" size={14} color="#1A3C34" />
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Input */}
      <Animated.View 
        style={[
          styles.inputContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Tapez votre message..."
            placeholderTextColor="#7F8C8D"
            multiline
            maxLength={500}
          />
          <Text style={styles.characterCount}>{inputText.length}/500</Text>
          <Animated.View
            style={[
              styles.sendButton,
              inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <TouchableOpacity 
              style={styles.sendButtonInner}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={inputText.trim() ? "#fff" : "#BDC3C7"} 
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FA',
  },
  header: {
    backgroundColor: '#1A3C34',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  headerAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  botAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#1A3C34',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
    position: 'relative',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userBubble: {
    backgroundColor: '#1A3C34',
    borderBottomRightRadius: 5,
    marginLeft: 10,
  },
  actionBubble: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: '#1A3C34',
  },
  userText: {
    color: '#fff',
  },
  actionText: {
    color: '#2E7D32',
    fontStyle: 'italic',
  },
  actionsContainer: {
    marginTop: 10,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0F2FE',
    justifyContent: 'space-between',
  },
  actionButtonText: {
    color: '#1A3C34',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 5,
    opacity: 0.7,
  },
  botTimestamp: {
    color: '#7F8C8D',
  },
  userTimestamp: {
    color: '#E5E7EB',
  },
  typingBubble: {
    paddingVertical: 15,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7F8C8D',
    marginHorizontal: 2,
  },
  typingText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A3C34',
    marginLeft: 15,
    marginBottom: 10,
  },
  suggestionsContent: {
    paddingHorizontal: 15,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  suggestionText: {
    color: '#1A3C34',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  inputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F0F2F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    position: 'relative',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A3C34',
    maxHeight: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    position: 'absolute',
    top: 5,
    right: 55,
    fontSize: 10,
    color: '#7F8C8D',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  sendButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#1A3C34',
  },
  sendButtonInactive: {
    backgroundColor: '#E5E7EB',
  },
});