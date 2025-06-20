import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, realtimeDb } from '../config/firebase';

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

  const testFirestoreConnection = async (): Promise<boolean> => {
    try {
      console.log('Probando conexión con Realtime Database...');
      const testRef = ref(realtimeDb, 'test');
      await set(testRef, { test: true });
      console.log('✅ Conexión con Realtime Database exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error de conexión con Realtime Database:', error);
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

  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      console.log('Iniciando registro con email:', email, 'y nombre:', name);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Usuario creado exitosamente:', user.uid);
      
      // Preparar datos del usuario
      const userData = {
        name: name.trim(),
        email: email,
        createdAt: new Date().toISOString()
      };
      
      console.log('Datos del usuario a guardar:', userData);
      
      // Guardar en Realtime Database
      try {
        const userRef = ref(realtimeDb, `users/${user.uid}`);
        await set(userRef, userData);
        console.log('Datos guardados exitosamente en Realtime Database');
        console.log('Nombre guardado:', userData.name);
      } catch (realtimeError: any) {
        console.error('Error al guardar en Realtime Database:', realtimeError);
        throw new Error(`Error al guardar datos del usuario: ${realtimeError.message}`);
      }
      
      console.log('Registro completado exitosamente');
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw error;
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