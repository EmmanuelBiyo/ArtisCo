import React, { createContext, useState, useContext, ReactNode } from 'react';

// Définir l'interface pour les données utilisateur
interface UserData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  workLocation: string;
  department: string;
  phone: string;
  email: string;
  password: string;
  profileImage?: string;
  memberSince?: string;
}

// Définir les types du contexte
interface AuthContextType {
  isSignedUp: boolean;
  userData: UserData | null;
  handleSignUp: (data: UserData) => void;
  updateUserData: (data: Partial<UserData>) => void;
  logout: () => void;
}

// Définir le type pour les props du Provider
interface AuthProviderProps {
  children: ReactNode;
}

// Créer le contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  isSignedUp: false,
  userData: null,
  handleSignUp: () => {},
  updateUserData: () => {},
  logout: () => {}
});

// Provider pour gérer l'état d'inscription
export function AuthProvider({ children }: AuthProviderProps) {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Fonction pour l'inscription
  const handleSignUp = (data: UserData) => {
    // Ajout de la date d'inscription
    const currentDate = new Date();
    const month = currentDate.toLocaleString('fr-FR', { month: 'long' });
    const year = currentDate.getFullYear();
    
    // Créer l'objet utilisateur avec les données supplémentaires
    const enhancedUserData = {
      ...data,
      memberSince: `${month} ${year}`
    };
    
    setUserData(enhancedUserData);
    setIsSignedUp(true);
    
    console.log('Inscription réussie :', enhancedUserData);
  };
  
  // Fonction pour mettre à jour les données utilisateur
  const updateUserData = (data: Partial<UserData>) => {
    if (userData) {
      const updatedUserData = { ...userData, ...data };
      setUserData(updatedUserData);
      console.log('Données utilisateur mises à jour :', updatedUserData);
    }
  };
  
  // Fonction de déconnexion
  const logout = () => {
    setIsSignedUp(false);
    setUserData(null);
    console.log('Utilisateur déconnecté');
  };
  
  return (
    <AuthContext.Provider value={{ 
      isSignedUp, 
      userData, 
      handleSignUp, 
      updateUserData,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}