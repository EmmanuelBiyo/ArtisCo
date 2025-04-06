import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function Search() {
  return (
    <View style={styles.otherScreens}>
      <Text style={styles.screenTitle}>Recherche</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Services à domicile</Text>
          <Text style={styles.cardDescription}>Trouver des services à domicile tels que le ménage, la plomberie, etc.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Réparations</Text>
          <Text style={styles.cardDescription}>Artisans qualifiés pour vos réparations électroménagers et autres travaux.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Artisanat local</Text>
          <Text style={styles.cardDescription}>Découvrez des artisans locaux pour des produits faits main et personnalisés.</Text>
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