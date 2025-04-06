// app/About.tsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function About() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>À propos d'ArtisCo</Text>
      <Text style={styles.description}>
        ArtisCo est une plateforme innovante qui vise à soutenir les artisans locaux en leur offrant une visibilité accrue et en facilitant l'accès aux services qu'ils proposent. Notre mission est de promouvoir le savoir-faire des artisans de votre région et de les aider à atteindre un plus grand public.
        {'\n\n'}
        En connectant directement les consommateurs aux artisans locaux, ArtisCo favorise une économie circulaire et durable. Que vous cherchiez un plombier, un ébéniste, un peintre ou tout autre artisan, ArtisCo est votre solution pour trouver rapidement un professionnel de confiance.
        {'\n\n'}
        Nous croyons qu'ensemble, nous pouvons rendre les services artisanaux plus accessibles et mieux valoriser l'artisanat local.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
