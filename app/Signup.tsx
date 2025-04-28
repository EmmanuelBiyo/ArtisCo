import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './(tabs)/context/AuthContext';

export default function Signup() {
  const { handleSignUp } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = () => {
    // Validation plus robuste des champs
    if (!firstName.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre prénom');
      return;
    }

    if (!lastName.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre nom');
      return;
    }

    // Validation de la date de naissance
    if (!birthDay || !birthMonth || !birthYear) {
      Alert.alert('Erreur', 'Veuillez compléter votre date de naissance');
      return;
    }

    // Validation simple du format de la date
    const day = parseInt(birthDay, 10);
    const month = parseInt(birthMonth, 10);
    const year = parseInt(birthYear, 10);
    
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
      Alert.alert('Erreur', 'Date de naissance invalide');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez saisir un email valide');
      return;
    }

    if (!password) {
      Alert.alert('Erreur', 'Veuillez saisir un mot de passe');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    // Mettre à jour l'état d'inscription avec les données du formulaire
    const userData = {
      firstName,
      lastName,
      dateOfBirth: `${birthDay}/${birthMonth}/${birthYear}`,
      workLocation,
      department,
      phone,
      email,
      password
    };
    
    // Appeler la fonction d'authentification avec les données utilisateur
    handleSignUp(userData);
    
    // Redirection vers la page d'accueil
    router.replace('./(tabs)/Home');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const renderInputField = (icon, placeholder, value, setValue, options = {}) => (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color="#6366f1" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        placeholderTextColor="#9ca3af"
        {...options}
      />
      {options.secureTextEntry && (
        <TouchableOpacity onPress={options.toggleVisible}>
          <Ionicons
            name={options.showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#6366f1"
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="person-add" size={60} color="#6366f1" />
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Complétez le formulaire pour vous inscrire</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          {renderInputField("person-outline", "Prénom", firstName, setFirstName, { autoCapitalize: "words" })}
          {renderInputField("person-outline", "Nom", lastName, setLastName, { autoCapitalize: "words" })}
          
          {/* Date de naissance avec saisie directe des chiffres */}
          <View style={styles.dateContainer}>
            <View style={[styles.dateInputContainer, { flex: 1, marginRight: 5 }]}>
              <Ionicons name="calendar-outline" size={20} color="#6366f1" style={styles.icon} />
              <TextInput
                style={styles.dateInput}
                placeholder="Jour"
                value={birthDay}
                onChangeText={setBirthDay}
                keyboardType="number-pad"
                maxLength={2}
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View style={[styles.dateInputContainer, { flex: 1, marginHorizontal: 5 }]}>
              <TextInput
                style={styles.dateInput}
                placeholder="Mois"
                value={birthMonth}
                onChangeText={setBirthMonth}
                keyboardType="number-pad"
                maxLength={2}
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View style={[styles.dateInputContainer, { flex: 1, marginLeft: 5 }]}>
              <TextInput
                style={styles.dateInput}
                placeholder="Année"
                value={birthYear}
                onChangeText={setBirthYear}
                keyboardType="number-pad"
                maxLength={4}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
          
          {renderInputField("call-outline", "Numéro de téléphone", phone, setPhone, { keyboardType: "phone-pad" })}
          {renderInputField("mail-outline", "Email", email, setEmail, { keyboardType: "email-address", autoCapitalize: "none" })}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informations professionnelles</Text>
          {renderInputField("location-outline", "Lieu de travail", workLocation, setWorkLocation)}
          {renderInputField("briefcase-outline", "Département", department, setDepartment)}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Sécurité</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6366f1" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity onPress={toggleShowPassword}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6366f1"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6366f1" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity onPress={toggleShowConfirmPassword}>
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6366f1"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => router.push('./Login')}>
          <Text style={styles.loginText}>
            Déjà un compte ? <Text style={styles.loginHighlight}>Se connecter</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 5,
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6366f1',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#64748b',
  },
  loginHighlight: {
    color: '#6366f1',
    fontWeight: '600',
  },
  footer: {
    height: 40,
  },
});