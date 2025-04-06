import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function Profil() {
  const params = useLocalSearchParams();
  const { 
    firstName = "Non défini", 
    lastName = "Non défini", 
    workNumber = "Non défini", 
    workLocation = "Non défini", 
    phone = "Non défini", 
    email = "Non définie" 
  } = params || {};
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.header}>
            <MaterialIcons name="person" size={80} color="#344955" />
            <Text style={styles.title}>Votre Profil</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <MaterialIcons name="person" size={24} color="#344955" />
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Prénom</Text>
                <Text style={styles.infoValue}>{firstName}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="person" size={24} color="#344955" />
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Nom</Text>
                <Text style={styles.infoValue}>{lastName}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="work" size={24} color="#344955" />
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Numéro de travail</Text>
                <Text style={styles.infoValue}>{workNumber}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={24} color="#344955" />
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Lieu de travail</Text>
                <Text style={styles.infoValue}>{workLocation}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="phone" size={24} color="#344955" />
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Numéro de téléphone</Text>
                <Text style={styles.infoValue}>{phone}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="email" size={24} color="#344955" />
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{email}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 30
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#344955',
    marginTop: 10
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoContainer: {
    marginLeft: 15,
    flex: 1
  },
  infoLabel: {
    fontSize: 14,
    color: '#777',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginTop: 2
  }
});