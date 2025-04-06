// AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Définir les types
interface AuthContextType {
  isSignedUp: boolean;
  handleSignUp: () => void;
}

// Définir le type pour les props du Provider
interface AuthProviderProps {
  children: ReactNode;
}

// Créer le contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  isSignedUp: false,
  handleSignUp: () => {},
});

// Provider pour gérer l'état d'inscription
export function AuthProvider({ children }: AuthProviderProps) {
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSignUp = () => {
    setIsSignedUp(true);
  };

  return (
    <AuthContext.Provider value={{ isSignedUp, handleSignUp }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}