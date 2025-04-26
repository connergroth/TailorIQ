import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signOut
} from 'firebase/auth';

// Firebase configuration object with direct values for integration
const firebaseConfig = {
  apiKey: "AIzaSyD1E0GMrlFP1-NVV2oXcdMLyAxJ-cYugXQ",
  authDomain: "tailoriq-7c054.firebaseapp.com",
  projectId: "tailoriq-7c054",
  storageBucket: "tailoriq-7c054.firebasestorage.app",
  messagingSenderId: "226015893902",
  appId: "1:226015893902:web:384fc18bdc555db635ecdf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
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
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

export { auth };