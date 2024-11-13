import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

function getAuthErrorMessage(error: AuthError): string {
  switch (error.code) {
    // Sign in errors
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later or reset your password.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';

    // Sign up errors
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters with a mix of letters, numbers, and symbols.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    // Google sign in errors
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign in popup was blocked. Please allow popups for this site.';
    case 'auth/cancelled-popup-request':
      return 'The sign in process was cancelled. Please try again.';

    // Network errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/timeout':
      return 'Request timeout. Please try again.';

    // Default error
    default:
      console.error('Unhandled auth error:', error);
      return 'An unexpected error occurred. Please try again.';
  }
}

export async function signUp(email: string, password: string, name: string) {
  try {
    if (!email || !password || !name) {
      throw new Error('Please fill in all required fields.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    if (name.length < 2) {
      throw new Error('Name must be at least 2 characters long.');
    }

    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(user, { 
      displayName: name 
    });
    
    await createUserProfile(user, { name });
    
    return { user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { 
      user: null, 
      error: error instanceof Error ? getAuthErrorMessage(error as AuthError) : 'Failed to create account'
    };
  }
}

export async function signIn(email: string, password: string) {
  try {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const { user } = await signInWithEmailAndPassword(auth, email, password);
    await updateLastLogin(user.uid);
    return { user, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { 
      user: null, 
      error: error instanceof Error ? getAuthErrorMessage(error as AuthError) : 'Failed to sign in'
    };
  }
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const { user } = await signInWithPopup(auth, provider);
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await createUserProfile(user);
    } else {
      await updateLastLogin(user.uid);
    }
    
    return { user, error: null };
  } catch (error) {
    console.error('Google sign in error:', error);
    return { 
      user: null, 
      error: error instanceof Error ? getAuthErrorMessage(error as AuthError) : 'Failed to sign in with Google'
    };
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { 
      error: error instanceof Error ? getAuthErrorMessage(error as AuthError) : 'Failed to sign out'
    };
  }
}

async function createUserProfile(user: User, additionalData?: { name?: string }) {
  try {
    const userRef = doc(db, 'users', user.uid);
    
    const userData = {
      uid: user.uid,
      email: user.email,
      name: additionalData?.name || user.displayName || 'User',
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      emojis: [],
    };

    await setDoc(userRef, userData, { merge: true });
    return userRef;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

async function updateLastLogin(uid: string) {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { 
      lastLogin: serverTimestamp() 
    }, { merge: true });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}