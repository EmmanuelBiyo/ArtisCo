import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <View style={styles.container}>
      <Ionicons name="log-in-outline" size={80} color="#007BFF" style={styles.icon} />
      <Text style={styles.title}>Connexion</Text>

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/Signup')}>
        <Text style={styles.link}>Pas encore de compte ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA', padding: 20 },
  icon: { marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  input: { width: '90%', padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, backgroundColor: '#fff', marginBottom: 10 },
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 10, width: '90%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { color: '#007BFF', marginTop: 20, fontSize: 16 },
});
