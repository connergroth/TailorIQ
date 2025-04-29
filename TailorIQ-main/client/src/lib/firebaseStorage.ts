import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
  DocumentReference
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Resume, ResumeTemplate } from '@shared/schema';

// Re-use the existing Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase resume interface
interface FirebaseResume {
  id: string;
  userId: string;
  title: string;
  template: ResumeTemplate;
  content: Resume;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Initialize Firebase
let app;
let db;
let auth;

try {
  // Check if Firebase config is properly set
  const isFirebaseConfigured = firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== 'undefined' && 
    firebaseConfig.authDomain && 
    firebaseConfig.projectId;

  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase Storage initialized successfully");
  } else {
    console.warn("Firebase not properly configured for storage - using fallback");
  }
} catch (error) {
  console.error("Error initializing Firebase Storage:", error);
}

/**
 * Save a resume to Firebase
 * 
 * @param resumeData The resume content to save
 * @param template The template used for the resume
 * @param title Optional title for the resume (defaults to "My Resume")
 * @param existingId Optional ID for updating an existing resume
 * @returns The saved resume ID
 */
export async function saveResumeToFirebase(
  resumeData: Resume, 
  template: ResumeTemplate, 
  title: string = "My Resume",
  existingId?: string | null
): Promise<string> {
  try {
    // Check if Firebase is initialized
    if (!db || !auth) {
      console.warn("Firebase not initialized, using localStorage");
      return saveResumeToLocalStorage(resumeData, template, title, existingId || undefined);
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.warn("User not signed in, using localStorage");
      return saveResumeToLocalStorage(resumeData, template, title, existingId || undefined);
    }

    // Generate a clean ID if none provided
    const resumeId = existingId || 
      doc(collection(db, "resumes")).id;

    // Create document reference
    const resumeRef = doc(db, "resumes", resumeId);

    // Prepare resume data
    const resumeDoc = {
      id: resumeId,
      userId: userId,
      title: title,
      template: template,
      content: resumeData,
      createdAt: existingId ? (await getDoc(resumeRef)).data()?.createdAt || serverTimestamp() : serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Save to Firestore
    await setDoc(resumeRef, resumeDoc);
    
    console.log("Resume saved to Firebase:", resumeId);
    return resumeId;
  } catch (error) {
    console.error("Error saving resume to Firebase:", error);
    return saveResumeToLocalStorage(resumeData, template, title, existingId || undefined);
  }
}

/**
 * Get a resume from Firebase by ID
 * 
 * @param resumeId The ID of the resume to get
 * @returns The resume data or null if not found
 */
export async function getResumeFromFirebase(resumeId: string): Promise<{
  id: string;
  title: string;
  template: ResumeTemplate;
  content: Resume;
  createdAt: Date;
  updatedAt: Date;
} | null> {
  try {
    // Check if Firebase is initialized
    if (!db) {
      console.warn("Firebase not initialized, using localStorage");
      return getResumeFromLocalStorage(resumeId);
    }

    const resumeRef = doc(db, "resumes", resumeId);
    const resumeSnap = await getDoc(resumeRef);

    if (resumeSnap.exists()) {
      const data = resumeSnap.data() as FirebaseResume;
      return {
        id: data.id,
        title: data.title,
        template: data.template,
        content: data.content,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting resume from Firebase:", error);
    return getResumeFromLocalStorage(resumeId);
  }
}

/**
 * Get all resumes for the current user
 * 
 * @returns Array of resume summaries
 */
export async function getUserResumesFromFirebase(): Promise<{
  id: string;
  title: string;
  template: ResumeTemplate;
  updatedAt: Date;
}[]> {
  try {
    // Check if Firebase is initialized
    if (!db || !auth) {
      console.warn("Firebase not initialized or user not signed in, using localStorage");
      return getUserResumesFromLocalStorage();
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.warn("User not signed in, using localStorage");
      return getUserResumesFromLocalStorage();
    }

    // Query resumes for current user
    const resumesRef = collection(db, "resumes");
    const q = query(resumesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const resumes = querySnapshot.docs.map(doc => {
      const data = doc.data() as FirebaseResume;
      return {
        id: doc.id,
        title: data.title,
        template: data.template,
        updatedAt: data.updatedAt.toDate()
      };
    });

    return resumes;
  } catch (error) {
    console.error("Error getting user resumes from Firebase:", error);
    return getUserResumesFromLocalStorage();
  }
}

// LocalStorage fallback functions
function saveResumeToLocalStorage(
  resumeData: Resume, 
  template: ResumeTemplate, 
  title: string = "My Resume",
  existingId?: string | null
): string {
  try {
    // Get existing resumes
    const savedResumes = localStorage.getItem('savedResumes');
    const resumes = savedResumes ? JSON.parse(savedResumes) : {};
    
    // Generate a new ID if needed
    const resumeId = existingId || `local-${Date.now()}`;
    
    // Get created date from existing record or create new one
    const createdAt = resumes[resumeId]?.createdAt || new Date().toISOString();
    
    // Create resume object
    resumes[resumeId] = {
      id: resumeId,
      title,
      template,
      content: resumeData,
      createdAt,
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('savedResumes', JSON.stringify(resumes));
    console.log("Resume saved to localStorage:", resumeId);
    
    return resumeId;
  } catch (error) {
    console.error("Error saving resume to localStorage:", error);
    return 'error';
  }
}

function getResumeFromLocalStorage(resumeId: string) {
  try {
    const savedResumes = localStorage.getItem('savedResumes');
    if (!savedResumes) return null;
    
    const resumes = JSON.parse(savedResumes);
    const resume = resumes[resumeId];
    
    if (!resume) return null;
    
    return {
      id: resume.id,
      title: resume.title,
      template: resume.template,
      content: resume.content,
      createdAt: new Date(resume.createdAt),
      updatedAt: new Date(resume.updatedAt)
    };
  } catch (error) {
    console.error("Error getting resume from localStorage:", error);
    return null;
  }
}

function getUserResumesFromLocalStorage() {
  try {
    const savedResumes = localStorage.getItem('savedResumes');
    if (!savedResumes) return [];
    
    const resumes = JSON.parse(savedResumes);
    
    return Object.values(resumes).map((resume: any) => ({
      id: resume.id,
      title: resume.title,
      template: resume.template,
      updatedAt: new Date(resume.updatedAt)
    }));
  } catch (error) {
    console.error("Error getting user resumes from localStorage:", error);
    return [];
  }
} 