import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Profil from './(tabs)/Profil'; // Import du composant Profil
import Artisans from './(tabs)/Artisans'; // Import du composant Artisans
import Search from './(tabs)/search'; // Import du composant Search/Recherche
import HomeScreen from './(tabs)/Home'; // Import de l'écran d'accueil

// Création du navigateur à onglets
const Tab = createBottomTabNavigator();

// Navigateur à onglets utilisant les composants importés
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Accueil') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Recherche') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Artisans') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F9A826',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#344955',
        },
        headerStyle: {
          backgroundColor: '#344955',
        },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Recherche" component={Search} />
      <Tab.Screen name="Artisans" component={Artisans} />
      <Tab.Screen name="Profil" component={Profil} />
    </Tab.Navigator>
  );
}