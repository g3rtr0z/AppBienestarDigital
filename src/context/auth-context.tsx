import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  testFirestoreConnection: () => Promise<boolean>;
  testFirebaseConfiguration: () => Promise<{ success: boolean; error?: string; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const testFirestoreConnection = async () => {
    try {
      console.log('Probando conexión con Firestore...');
      const testDoc = doc(db, 'test', 'connection-test');
      await setDoc(testDoc, { test: true, timestamp: new Date() });
      console.log('Firestore está funcionando correctamente');
      return true;
    } catch (error: any) {
      console.error('Error en Firestore:', error);
      return false;
    }
  };

  const testFirebaseConfiguration = async () => {
    try {
      console.log('=== VERIFICANDO CONFIGURACIÓN DE FIREBASE ===');
      
      // Verificar que auth esté disponible
      if (!auth) {
        console.error('❌ Auth no está disponible');
        return { success: false, error: 'Auth no está disponible' };
      }
      
      console.log('✅ Auth está disponible');
      
      // Verificar que la configuración esté cargada
      const config = auth.config;
      console.log('Configuración de Auth:', config);
      
      // Intentar una operación simple para verificar la conexión
      try {
        const currentUser = auth.currentUser;
        console.log('Usuario actual:', currentUser);
        console.log('✅ Configuración de Firebase válida');
        return { success: true, message: 'Configuración válida' };
      } catch (authError: any) {
        console.error('❌ Error al verificar Auth:', authError);
        return { success: false, error: authError.message };
      }
      
    } catch (error: any) {
      console.error('❌ Error general en verificación:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log('Intentando registrar usuario:', { email, name });
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Usuario creado exitosamente en Authentication:', user.uid);
      
      // Intentar guardar en Firestore solo si la creación en Auth fue exitosa
      try {
        const userData = {
          name,
          email,
          createdAt: new Date(),
          settings: {
            screenTimeLimit: 8,
            waterGoal: 8,
            breakInterval: 25,
            breakDuration: 5,
            notificationsEnabled: true,
            soundEnabled: true,
            accessibilityMode: false,
            theme: "system",
            screenTimeEnabled: true,
            activeBreaksEnabled: true,
            hydrationEnabled: true
          }
        };
        
        console.log('Intentando guardar en Firestore:', userData);
        await setDoc(doc(db, 'users', user.uid), userData);
        console.log('Datos guardados exitosamente en Firestore');
      } catch (firestoreError: any) {
        console.error('Error al guardar en Firestore:', firestoreError);
        // No lanzar error aquí, el usuario ya se creó en Auth
        console.warn('Usuario creado en Auth pero no se pudo guardar en Firestore');
      }
      
    } catch (error: any) {
      console.error('Error en register:', error);
      console.error('Código de error:', error.code);
      console.error('Mensaje de error:', error.message);
      
      // Re-lanzar el error con información más detallada
      throw new Error(error.message || 'Error desconocido al crear la cuenta');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    testFirestoreConnection,
    testFirebaseConfiguration
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 