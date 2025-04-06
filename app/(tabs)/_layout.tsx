import { useEffect } from 'react';
import { Stack, useRouter, Tabs } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext'; // Assurez-vous du chemin correct
import { MaterialIcons } from '@expo/vector-icons';


function RootLayout() {
  const { isSignedUp } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isSignedUp) {
      router.replace('./(tabs)/Home'); // Utilisez exactement le même nom que dans vos fichiers
    }
  }, [isSignedUp, router]);
  
  if (isSignedUp === undefined) return null; // Évite le rendu si l'état est encore inconnu
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isSignedUp ? (
        <>
          <Stack.Screen 
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="About" options={{ headerShown: false }} />
          <Stack.Screen name="Explore" options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="Signup" options={{ headerShown: false }} />
          <Stack.Screen name="Login" options={{ headerShown: false }} />
          <Stack.Screen name="About" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}

export function TabsLayout() {
  return (
    <Tabs
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#F9A826',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#344955',
          height: 60,
          paddingBottom: 5,
        },
        headerStyle: {
          backgroundColor: '#344955',
        },
        headerTintColor: '#fff',
        tabBarIcon: ({color, size}) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'search') {
            iconName = 'search';
          } else if (route.name === 'Artisans') {
            iconName = 'people';
          } else if (route.name === 'Explore') {
            iconName = 'person';
          }
          
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Accueil",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Recherche",
        }}
      />
      <Tabs.Screen
        name="Artisans"
        options={{
          title: "Artisans",
        }}
      />
      <Tabs.Screen
        name="Explore"
        options={{
          title: "Profil",
        }}
      />
    </Tabs>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}