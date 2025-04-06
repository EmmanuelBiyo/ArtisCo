import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Bookmarks() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vos Favoris</Text>
      <Text style={styles.subtitle}>
        Retrouvez ici tous les artisans et services que vous avez enregistrés.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A6572',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});
