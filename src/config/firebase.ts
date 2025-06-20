import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAsUZ9uMcSdmNpEBiP-ZNVhy8dadwYUzJE",
  authDomain: "viveoffline.firebaseapp.com",
  projectId: "viveoffline",
  storageBucket: "viveoffline.firebasestorage.app",
  messagingSenderId: "1077224555403",
  appId: "1:1077224555403:web:f5fad61684211b8200258e",
  measurementId: "G-XFPZLFKGRX"
};

console.log('=== CONFIGURACIÓN DE FIREBASE ===');
console.log('Configuración completa:', JSON.stringify(firebaseConfig, null, 2));
console.log('API Key presente:', !!firebaseConfig.apiKey);
console.log('Project ID presente:', !!firebaseConfig.projectId);
console.log('App ID presente:', !!firebaseConfig.appId);

let app: any;
let auth: any;
let db: any;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app inicializada exitosamente:', app.name);
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  console.log('✅ Firebase Auth inicializado exitosamente');
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
  console.log('✅ Firestore inicializado exitosamente');
  
} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error);
  throw error;
}

export { auth, db };
export default app; 