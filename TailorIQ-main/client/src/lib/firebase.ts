// client/src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase with proper error handling
let app;
let auth: ReturnType<typeof getAuth> | typeof mockAuth;
let googleProvider: GoogleAuthProvider | null = null;

// Create mock auth for when Firebase is not properly configured
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    // Create a mock user for development purposes
    setTimeout(() => {
      const mockUser = createMockUser(true);
      callback(mockUser as any);
    }, 500);
    return () => {}; // Return unsubscribe function
  }
};

try {
  // Check if Firebase config is properly set
  const isFirebaseConfigured = firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== 'undefined' && 
    firebaseConfig.authDomain && 
    firebaseConfig.projectId;

  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase not properly configured - using mock implementation");
    auth = mockAuth;
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  auth = mockAuth;
}

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    if (!auth || auth === mockAuth || !googleProvider) {
      console.warn("Firebase auth not properly initialized - using mock login");
      return createMockUser();
    }
    
    // Type assertion to ensure auth is recognized as Firebase Auth type
    const firebaseAuth = auth as ReturnType<typeof getAuth>;
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    // For development/demo purposes, return a mock user
    return createMockUser();
  }
};

// Sign in as guest (anonymously)
export const signInAsGuest = async () => {
  try {
    if (!auth || auth === mockAuth) {
      console.warn("Firebase auth not properly initialized - using mock login");
      return createMockUser(true);
    }
    
    // Type assertion to ensure auth is recognized as Firebase Auth type
    const firebaseAuth = auth as ReturnType<typeof getAuth>;
    const result = await signInAnonymously(firebaseAuth);
    return result.user;
  } catch (error) {
    console.error("Error signing in anonymously: ", error);
    return createMockUser(true);
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    if (!auth || auth === mockAuth) {
      console.warn("Firebase auth not properly initialized - using mock logout");
      return true;
    }
    
    // Type assertion to ensure auth is recognized as Firebase Auth type
    const firebaseAuth = auth as ReturnType<typeof getAuth>;
    await signOut(firebaseAuth);
    return true;
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

// Create a mock user for development/demo purposes
function createMockUser(isAnonymous = false) {
  return {
    uid: "mock-user-" + Math.random().toString(36).substring(2, 9),
    email: isAnonymous ? null : "mock@example.com",
    displayName: isAnonymous ? null : "Mock User",
    isAnonymous,
    emailVerified: !isAnonymous,
    photoURL: null,
    providerId: 'firebase',
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString()
    },
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({
      token: 'mock-token',
      claims: {},
      expirationTime: new Date(Date.now() + 3600000).toISOString(),
      issuedAtTime: new Date().toISOString(),
      authTime: new Date().toISOString(),
      signInProvider: isAnonymous ? 'anonymous' : 'google.com',
      signInSecondFactor: null
    }),
    reload: async () => {},
    toJSON: () => ({})
  } as unknown as User;
}

export { auth };