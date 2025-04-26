import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object - values come from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Anonymous sign-in
function signInAnonymouslyUser() {
  return signInAnonymously(auth);
}

// Google Auth - Popup
function signInWithGooglePopup() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

// Google Auth - Redirect
function signInWithGoogleRedirect() {
  const provider = new GoogleAuthProvider();
  return signInWithRedirect(auth, provider);
}

export {
  app,
  auth,
  db,
  signInAnonymouslyUser as signInAnonymously,
  signInWithGooglePopup,
  signInWithGoogleRedirect
};

export default app;
