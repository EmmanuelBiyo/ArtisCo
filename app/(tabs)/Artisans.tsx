import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function Artisans() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="person" size={60} color={Colors.light.tint} style={styles.icon} />
        <Text style={styles.title}>Mon Profil</Text>
        <Text style={styles.subtitle}>
          Bienvenue sur votre espace personnel. Ici, vous pouvez gérer vos informations et vos préférences.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/Signup')}>
          <Text style={styles.buttonText}>Modifier le Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff7e5f' },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.95)', width: '90%', maxWidth: 400, borderRadius: 24, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 15, elevation: 10 },
  icon: { marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', color: Colors.light.tint, textAlign: 'center', marginBottom: 20 },
  subtitle: { fontSize: 18, lineHeight: 26, color: '#444', textAlign: 'center', marginBottom: 30 },
  button: { backgroundColor: Colors.light.tint, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 50, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});