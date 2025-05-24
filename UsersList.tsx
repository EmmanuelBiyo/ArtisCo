import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

// Définition du type d'utilisateur selon ce que ton API retourne
type User = {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  work_location: string;
  department: string;
  phone_number: string;
  created_at: string;
};

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('http://192.168.1.117:3000/users'); // Remplace cette IP par celle de ton PC
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des utilisateurs</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.field}>Nom complet : {item.first_name} {item.last_name}</Text>
            <Text style={styles.field}>Email : {item.email}</Text>
            <Text style={styles.field}>Téléphone : {item.phone_number}</Text>
            <Text style={styles.field}>Date de naissance : {new Date(item.date_of_birth).toLocaleDateString()}</Text>
            <Text style={styles.field}>Département : {item.department}</Text>
            <Text style={styles.field}>Lieu de travail : {item.work_location}</Text>
            <Text style={styles.field}>Créé le : {new Date(item.created_at).toLocaleString()}</Text>
            {/* Ne jamais afficher le mot de passe en production */}
          </View>
        )}
      />
    </View>
  );
};

export default UsersList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 3,
  },
  field: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
});