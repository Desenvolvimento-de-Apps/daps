// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
// Adicione as importações necessárias para a persistência de autenticação
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5agaFHcm7YlnQsEaR4iaDSB_nLCJnKkY",
  authDomain: "desenvolvimento-de-apps-5d649.firebaseapp.com",
  projectId: "desenvolvimento-de-apps-5d649",
  storageBucket: "desenvolvimento-de-apps-5d649.firebasestorage.app",
  messagingSenderId: "303833510013",
  appId: "1:303833510013:web:c510866f01aa5dca6dc114",
  measurementId: "G-MK343Q8YPD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Inicialize o Firebase Auth com persistência para React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { db, auth };
