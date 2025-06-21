import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAsUZ9uMcSdmNpEBiP-ZNVhy8dadwYUzJE",
  authDomain: "viveoffline.firebaseapp.com",
  projectId: "viveoffline",
  storageBucket: "viveoffline.firebasestorage.app",
  messagingSenderId: "1077224555403",
  appId: "1:1077224555403:web:f5fad61684211b8200258e",
  measurementId: "G-XFPZLFKGRX",
  databaseURL: "https://viveoffline-default-rtdb.firebaseio.com"
};

let app: any;
let auth: any;
let db: any;
let realtimeDb: any;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
  
  // Initialize Realtime Database
  realtimeDb = getDatabase(app);
  
} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error);
  throw error;
}

export { auth, db, realtimeDb };
export default app; 