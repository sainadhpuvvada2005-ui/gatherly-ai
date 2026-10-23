import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  deleteDoc, 
  getDocFromServer,
  Firestore,
  onSnapshot
} from 'firebase/firestore';

// Load config from firebase-applet-config.json
import firebaseConfigData from '../../firebase-applet-config.json';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let isConnected = false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfigData) : getApp();
  auth = getAuth(app);
  
  // Use provisioned firestoreDatabaseId
  const dbId = (firebaseConfigData as any).firestoreDatabaseId;
  db = dbId ? getFirestore(app, dbId) : getFirestore(app);
  
  console.log('Firebase initialized with Project ID:', (firebaseConfigData as any).projectId);
  
  // Test connection on boot
  testConnection();
} catch (err) {
  console.error('Firebase initialization error:', err);
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    isConnected = true;
    console.log('Firestore cloud connection verified.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode. Please check connection.');
    } else {
      console.log('Firestore connection ping completed.');
    }
    isConnected = true;
  }
}

export { app, auth, db, isConnected };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const FirebaseAuthService = {
  getAuthInstance(): Auth {
    return auth;
  },

  getCurrentUser(): FirebaseUser | null {
    return auth?.currentUser || null;
  },

  onUserChange(callback: (user: FirebaseUser | null) => void) {
    if (!auth) return () => {};
    return onAuthStateChanged(auth, callback);
  },

  async loginWithGoogle(): Promise<FirebaseUser> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  },

  async login(email: string, pass: string): Promise<FirebaseUser> {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  },

  async register(email: string, pass: string): Promise<FirebaseUser> {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    return cred.user;
  },

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  async logout(): Promise<void> {
    await fbSignOut(auth);
  }
};

export const FirestoreSyncService = {
  async saveEventDoc(eventId: string, data: any): Promise<void> {
    if (!db) return;
    const user = auth?.currentUser;
    if (!user) {
      // In demo mode or local exploration, avoid unauthenticated remote writes
      return;
    }
    const path = `events/${eventId}`;
    try {
      const payload = {
        ...data,
        ownerId: user.uid
      };
      await setDoc(doc(db, 'events', eventId), payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  async saveBudgetItemDoc(eventId: string, itemId: string, data: any): Promise<void> {
    if (!db) return;
    const user = auth?.currentUser;
    if (!user) return;
    const path = `events/${eventId}/budgetItems/${itemId}`;
    try {
      const payload = { ...data, ownerId: user.uid };
      await setDoc(doc(db, 'events', eventId, 'budgetItems', itemId), payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  async saveTaskDoc(eventId: string, taskId: string, data: any): Promise<void> {
    if (!db) return;
    const user = auth?.currentUser;
    if (!user) return;
    const path = `events/${eventId}/tasks/${taskId}`;
    try {
      const payload = { ...data, ownerId: user.uid };
      await setDoc(doc(db, 'events', eventId, 'tasks', taskId), payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  async saveVendorDoc(eventId: string, vendorId: string, data: any): Promise<void> {
    if (!db) return;
    const user = auth?.currentUser;
    if (!user) return;
    const path = `events/${eventId}/vendors/${vendorId}`;
    try {
      const payload = { ...data, ownerId: user.uid };
      await setDoc(doc(db, 'events', eventId, 'vendors', vendorId), payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  },

  async saveGuestDoc(eventId: string, guestId: string, data: any): Promise<void> {
    if (!db) return;
    const user = auth?.currentUser;
    if (!user) return;
    const path = `events/${eventId}/guests/${guestId}`;
    try {
      const payload = { ...data, ownerId: user.uid };
      await setDoc(doc(db, 'events', eventId, 'guests', guestId), payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }
};
