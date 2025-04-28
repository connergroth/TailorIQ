import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signOut
} from 'firebase/auth';

// Firebase configuration
// Note: For production, you MUST set these environment variables in your Render dashboard
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID
};

// Initialize Firebase with proper error handling
let app;
let auth: import('firebase/auth').Auth;
let googleProvider: GoogleAuthProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    if (!auth || !googleProvider) {
      throw new Error("Firebase auth not initialized");
    }
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

// Sign in as guest (anonymously)
export const signInAsGuest = async () => {
  try {
    if (!auth) {
      throw new Error("Firebase auth not initialized");
    }
    // For development/demo purposes, create a mock user if Firebase is not configured
    if (firebaseConfig.apiKey === undefined || firebaseConfig.apiKey === "") {
      console.warn("Using mock authentication because Firebase is not configured");
      return {
        uid: "mock-user-" + Math.random().toString(36).substring(2, 9),
        isAnonymous: true,
        email: null
      };
    }
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error("Error signing in anonymously: ", error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    if (!auth) {
      throw new Error("Firebase auth not initialized");
    }
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

export { auth };