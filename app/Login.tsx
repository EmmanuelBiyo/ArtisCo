import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Modal, 
  Animated, 
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanPhase, setScanPhase] = useState(0);
  const [scanStatusMessage, setScanStatusMessage] = useState('Positionnez votre document');
  const [documentFound, setDocumentFound] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  
  // Animations
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scannerOpacity = useRef(new Animated.Value(0)).current;
  const cardFoundScale = useRef(new Animated.Value(1)).current;
  const successPulse = useRef(new Animated.Value(0.8)).current;
  const scanBrightnessAnim = useRef(new Animated.Value(0)).current;
  
  // Simule la détection du document en fonction du temps écoulé
  useEffect(() => {
    if (showScanner && !documentFound) {
      // Détection simulée du document après 2 secondes
      const detectionTimeout = setTimeout(() => {
        setDocumentFound(true);
        Animated.sequence([
          Animated.timing(cardFoundScale, {
            toValue: 1.02,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(cardFoundScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
        
        // Brève animation de lumière verte
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start(() => {
          Animated.timing(glowAnim, {
            toValue: 0.2,
            duration: 500,
            useNativeDriver: false,
          }).start();
        });
        
        // Message et son de détection
        setScanStatusMessage('Document détecté ! Ne bougez pas...');
      }, 2000);
      
      return () => clearTimeout(detectionTimeout);
    }
  }, [showScanner, documentFound]);

  // Animation de la ligne de scan
  useEffect(() => {
    if (showScanner && !scanComplete) {
      // Animation plus rapide lorsque le document est détecté
      const duration = documentFound ? 1500 : 2000;
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Animation de luminosité pendant le scan
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanBrightnessAnim, {
            toValue: 0.15,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(scanBrightnessAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
    return () => {
      scanLineAnim.setValue(0);
      scanBrightnessAnim.setValue(0);
    };
  }, [showScanner, scanComplete, documentFound]);

  // Animation de pulsation du cadre
  useEffect(() => {
    if (showScanner && !scanComplete) {
      // Pulsation plus subtile quand le document est détecté
      const minScale = documentFound ? 0.99 : 0.95;
      const maxScale = documentFound ? 1.01 : 1.05;
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: maxScale,
            duration: documentFound ? 800 : 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: minScale,
            duration: documentFound ? 800 : 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    return () => pulseAnim.setValue(1);
  }, [showScanner, scanComplete, documentFound]);
  
  // Animation d'apparition du scanner
  useEffect(() => {
    if (showScanner) {
      Animated.timing(scannerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      scannerOpacity.setValue(0);
    }
  }, [showScanner]);
  
  // Animation de succès à la fin du scan
  useEffect(() => {
    if (scanSuccess) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(successPulse, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(successPulse, {
            toValue: 0.95,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [scanSuccess]);

  // Simulation de la progression avec étapes avancées et plus réalistes
  useEffect(() => {
    if (showScanner && documentFound && !scanComplete) {
      progressAnim.setValue(0);
      setScanPhase(1);

      // Étape 1 : Détection des bordures (0 à 20%)
      setScanStatusMessage('Détection des bordures...');
      Animated.timing(progressAnim, {
        toValue: 20,
        duration: 1200,
        useNativeDriver: false,
      }).start(() => {
        setScanPhase(2);
        
        // Étape 2 : Analyse du type de document (20 à 35%)
        setScanStatusMessage('Identification du type de document...');
        Animated.timing(progressAnim, {
          toValue: 35,
          duration: 1000,
          useNativeDriver: false,
        }).start(() => {
          setScanPhase(3);
          
          // Étape 3 : Calibration de l'image (35 à 45%)
          setScanStatusMessage('Calibration de l\'image...');
          Animated.timing(progressAnim, {
            toValue: 45,
            duration: 800,
            useNativeDriver: false,
          }).start(() => {
            setScanPhase(4);
            
            // Étape 4 : Lecture des informations textuelles (45 à 65%)
            setScanStatusMessage('Lecture des informations...');
            Animated.timing(progressAnim, {
              toValue: 65,
              duration: 1800,
              useNativeDriver: false,
            }).start(() => {
              setScanPhase(5);
              
              // Étape 5 : Vérification des éléments de sécurité (65 à 85%)
              setScanStatusMessage('Vérification des éléments de sécurité...');
              Animated.timing(progressAnim, {
                toValue: 85,
                duration: 1500,
                useNativeDriver: false,
              }).start(() => {
                setScanPhase(6);
                
                // Étape 6 : Traitement final et validation (85 à 100%)
                setScanStatusMessage('Traitement et validation des données...');
                Animated.timing(progressAnim, {
                  toValue: 100,
                  duration: 1200,
                  useNativeDriver: false,
                }).start(({ finished }) => {
                  if (finished) {
                    setScanComplete(true);
                    setScanProgress(100);
                    setScanStatusMessage('Scan terminé avec succès !');
                    setScanSuccess(true);
                  }
                });
              });
            });
          });
        });
      });
    }
    return () => progressAnim.setValue(0);
  }, [showScanner, documentFound, scanComplete]);

  // Met à jour scanProgress
  useEffect(() => {
    const listener = progressAnim.addListener(({ value }) => {
      setScanProgress(value);
    });
    return () => progressAnim.removeListener(listener);
  }, [progressAnim]);

  // Fonction pour naviguer vers l'écran Home
  const navigateToHome = () => {
    setShowScanner(false);
    router.push('./(tabs)/Home');
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Tous les champs sont requis');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      Alert.alert('Erreur', 'Email invalide');
      return;
    }

    Alert.alert('Succès', 'Connexion réussie !', [
      { text: 'OK', onPress: () => router.push('./(tabs)/Home') },
    ]);
  };

  const startDocumentScan = () => {
    // Réinitialiser l'état
    setShowScanner(true);
    setScanComplete(false);
    setScanProgress(0);
    setScanStatusMessage('Positionnez votre document dans le cadre');
    setDocumentFound(false);
    setScanSuccess(false);
    setScanPhase(0);
    glowAnim.setValue(0);
    successPulse.setValue(0.8);
  };
  
  const [frameColor, setFrameColor] = useState('#ffffff');

  // Animation de détection du document
  useEffect(() => {
    if (showScanner && !documentFound) {
      const detectionTimeout = setTimeout(() => {
        setDocumentFound(true);
        Animated.sequence([
          Animated.timing(cardFoundScale, {
            toValue: 1.02,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(cardFoundScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
        
        // Gérer la couleur via un état
        setFrameColor('#ffb300');
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start(() => {
          setFrameColor('#2ecc71');
          Animated.timing(glowAnim, {
            toValue: 0.2,
            duration: 500,
            useNativeDriver: false,
          }).start(() => setFrameColor('#ffb300'));
        });
        
        setScanStatusMessage('Document détecté ! Ne bougez pas...');
      }, 2000);
      
      return () => clearTimeout(detectionTimeout);
    }
  }, [showScanner, documentFound]);

  // Mise à jour de getFrameColor
  const getFrameColor = () => {
    if (scanSuccess) return '#2ecc71';
    if (documentFound) return frameColor;
    return '#ffffff';
  };

  // Toggle password visibility
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Rendu de l'interface utilisateur
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.iconBackground}
          >
            <Ionicons name="log-in-outline" size={40} color="#ffffff" />
          </LinearGradient>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Bienvenue, connectez-vous pour continuer</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#6366f1" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
              accessible
              accessibilityLabel="Champ de saisie de l'email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6366f1" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#9ca3af"
              accessible
              accessibilityLabel="Champ de saisie du mot de passe"
            />
            <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#6366f1" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={startDocumentScan}
            activeOpacity={0.8}
          >
            <Ionicons name="scan-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Scanner un document d'identité</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerLink} 
            onPress={() => router.push('/Signup')}
          >
            <Text style={styles.registerText}>
              Pas encore de compte ? <Text style={styles.registerHighlight}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal pour le scan de document avec animations avancées */}
        <Modal visible={showScanner} transparent={false} animationType="fade">
          <Animated.View style={[styles.modalContainer, { opacity: scannerOpacity }]}>
            {/* Vue simulant la caméra avec effets visuels */}
            <View style={styles.cameraView}>
              {/* Overlay de brillance pour simuler le flash */}
              <Animated.View 
                style={[
                  styles.brightnessOverlay, 
                  { opacity: scanBrightnessAnim }
                ]} 
              />
              
              {/* Affichage des guides de cadrage */}
              <View style={styles.guideLines}>
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
              </View>
              
              {/* Overlay du scanner avec effet matrix/digital */}
              <View style={styles.scannerOverlay}>
                {/* Cadre de détection */}
                <Animated.View
                  style={[
                    styles.scanFrame,
                    {
                      transform: [
                        { scale: pulseAnim },
                        { scale: documentFound ? cardFoundScale : 1 }
                      ],
                      borderColor: getFrameColor(),
                      shadowOpacity: documentFound ? 0.8 : 0.2,
                      shadowColor: documentFound ? '#2ecc71' : '#ffffff',
                    },
                  ]}
                >
                  {/* Affichage d'une silhouette de carte lorsque détectée */}
                  {documentFound && (
                    <Animated.View 
                      style={[
                        styles.detectedDocumentOverlay,
                        { opacity: documentFound ? 0.4 : 0 }
                      ]}
                    >
                      <View style={styles.documentContentSimulation}>
                        <View style={styles.documentPhoto} />
                        <View style={styles.documentLines}>
                          <View style={styles.documentLine} />
                          <View style={styles.documentLine} />
                          <View style={styles.documentLine} />
                          <View style={[styles.documentLine, {width: '60%'}]} />
                        </View>
                      </View>
                    </Animated.View>
                  )}
                  
                  {/* Ligne de scan animée */}
                  <Animated.View
                    style={{
                      height: 3, 
                      width: '100%', 
                      backgroundColor: 'rgba(0,255,0,0.6)',
                      position: 'absolute',
                      opacity: documentFound ? 0.9 : 0.5,
                      transform: [
                        {
                          translateY: scanLineAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-100, 100],
                          }),
                        },
                      ],
                    }}
                  />
                </Animated.View>
                
                {/* Message d'instruction flottant */}
                {!documentFound && (
                  <Animated.View style={[
                    styles.instructionBubble,
                    { opacity: documentFound ? 0 : 1 }
                  ]}>
                    <Text style={styles.instructionText}>
                      Alignez votre document dans le cadre
                    </Text>
                  </Animated.View>
                )}
              </View>
              
              {/* Grille de scan pour effet visuel */}
              <View style={styles.scanGrid} />
            </View>

            {/* Panneau des contrôles et état du scan */}
            <View style={styles.scannerControls}>
              {/* Icône d'état et message */}
              <View style={styles.statusContainer}>
                {scanPhase > 0 && (
                  <Ionicons 
                    name={scanComplete ? "checkmark-circle" : "sync"} 
                    size={24} 
                    color={scanComplete ? "#2ecc71" : "#ffb300"} 
                    style={[
                      styles.statusIcon,
                      scanComplete ? {} : styles.rotating
                    ]} 
                  />
                )}
                <Text style={[
                  styles.scanStatus, 
                  scanComplete ? styles.scanStatusSuccess : {}
                ]}>
                  {scanStatusMessage}
                </Text>
              </View>

              {/* Barre de progression avec détails des étapes */}
              <View style={styles.progressSection}>
                <View style={styles.progressContainer}>
                  <Animated.View style={[
                    styles.progressBar, 
                    { width: `${scanProgress}%` },
                    scanComplete ? styles.progressBarComplete : {}
                  ]} />
                </View>
                
                {/* Indicateurs d'étapes */}
                <View style={styles.stepsIndicator}>
                  {/* 6 phases du scan */}
                  {[1, 2, 3, 4, 5, 6].map(step => (
                    <View 
                      key={`step-${step}`}
                      style={[
                        styles.stepDot, 
                        scanPhase >= step ? styles.stepActive : {}
                      ]} 
                    />
                  ))}
                </View>
              </View>

              {/* Texte informatif sur le type de document */}
              {scanPhase >= 2 && (
                <Text style={styles.documentTypeInfo}>
                  {scanPhase >= 2 && scanPhase < 6 ? "Document: Carte Nationale d'Identité" : 
                  scanPhase >= 6 ? "Document validé: ✓ Authentique" : ""}
                </Text>
              )}

              {/* Bouton pour accéder à l'écran Home après un scan réussi */}
              {scanComplete && (
                <TouchableOpacity 
                  style={styles.homeButton}
                  onPress={navigateToHome}
                  activeOpacity={0.8}
                >
                  <Ionicons name="home" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Accéder à l'accueil</Text>
                </TouchableOpacity>
              )}

              {/* Bouton d'annulation ou de fermeture */}
              <TouchableOpacity
                style={[styles.cancelButton, scanComplete ? styles.closeButton : {}]}
                onPress={() => setShowScanner(false)}
              >
                <Text style={[
                  styles.cancelText,
                  scanComplete ? styles.closeText : {}
                ]}>
                  {scanComplete ? 'Fermer' : 'Annuler'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Informations techniques simulées en bas d'écran */}
            <View style={styles.techInfoBar}>
              <Text style={styles.techInfoText}>
                Scanner v2.5 • {scanPhase >= 2 ? "Résolution: HD" : "Initialisation..."}
              </Text>
              <Text style={styles.techInfoText}>
                {scanPhase >= 3 ? `Sécurité: Niveau ${scanPhase + 2}` : ""}
              </Text>
            </View>
          </Animated.View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 15,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#94a3b8',
    fontSize: 14,
  },
  scanButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 10,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 10,
  },
  registerText: {
    fontSize: 16,
    color: '#64748b',
  },
  registerHighlight: {
    color: '#6366f1',
    fontWeight: '600',
  },
  
  // Scanner Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraView: {
    width: '100%',
    height: '70%',
    backgroundColor: '#0a0a0a',
    position: 'relative',
    overflow: 'hidden',
  },
  brightnessOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    zIndex: 1,
  },
  scanGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    zIndex: 0,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0f0',
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  guideLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  cornerTL: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  cornerTR: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  scanFrame: {
    width: 320,
    height: 200,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 15,
  },
  instructionBubble: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
  },
    detectedDocumentOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 10,
    },
    documentContentSimulation: {
      flex: 1,
      flexDirection: 'row',
      padding: 10,
    },
    documentPhoto: {
      width: 60,
      height: 80,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 5,
      marginRight: 10,
    },
    documentLines: {
      flex: 1,
      justifyContent: 'space-around',
    },
    documentLine: {
      height: 8,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 4,
      width: '100%',
    },
    scannerControls: {
      padding: 20,
      backgroundColor: '#fff',
      alignItems: 'center',
      flex: 1,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    statusIcon: {
      marginRight: 8,
    },
    rotating: {
      // Note: In a real app, you'd use Animated.loop for rotation
    },
    progressSection: {
      width: '100%',
      marginBottom: 15,
    },
    progressContainer: {
      width: '100%',
      height: 6,
      backgroundColor: '#ecf0f1',
      borderRadius: 3,
      marginBottom: 8,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#ffb300',
      borderRadius: 3,
    },
    progressBarComplete: {
      backgroundColor: '#2ecc71',
    },
    stepsIndicator: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    stepDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#ecf0f1',
    },
    stepActive: {
      backgroundColor: '#2ecc71',
    },
    scanStatus: {
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      color: '#333',
    },
    scanStatusSuccess: {
      color: '#2ecc71',
      fontWeight: 'bold',
    },
    documentTypeInfo: {
      marginTop: 15,
      fontSize: 14,
      color: '#666',
      fontStyle: 'italic',
    },
    homeButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginTop: 20,
      width: '90%',
      backgroundColor: '#2ecc71',
      shadowColor: '#2ecc71',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 8,
    },
    cancelButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginTop: 15,
      borderWidth: 1,
      borderColor: '#e74c3c',
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelText: {
      color: '#e74c3c',
      fontSize: 16,
      fontWeight: '600',
    },
    closeButton: {
      marginTop: 8,
      borderColor: '#95a5a6',
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    closeText: {
      color: '#95a5a6',
      fontSize: 16,
      fontWeight: '600',
    },
    techInfoBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: 8,
    },
    techInfoText: {
      color: 'rgba(0,255,0,0.8)',
      fontSize: 10,
      fontFamily: 'monospace',
    },
  });
  