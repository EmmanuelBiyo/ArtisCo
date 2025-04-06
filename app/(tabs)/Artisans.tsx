import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function Artisans() {
  return (
    <View style={styles.otherScreens}>
      <Text style={styles.screenTitle}>Artisans Disponibles</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Esdras Bakayoko</Text>
          <Text style={styles.cardDescription}>Plombier certifié avec 10 ans d'expérience, disponible pour tous vos travaux.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Orthense Kouassi</Text>
          <Text style={styles.cardDescription}>Couturière professionnelle, spécialisée dans les vêtements sur mesure.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Franck Seka</Text>
          <Text style={styles.cardDescription}>Menuisier passionné, créant des meubles uniques en bois recyclé.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  otherScreens: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A6572',
  },
  screenTitle: {
    fontSize: 28,
    color: 'white',
    marginBottom: 20,
  },
  scrollView: {
    width: '90%',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 16,
    marginTop: 10,
    color: '#555',
  }
});