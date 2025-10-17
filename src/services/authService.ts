// Fix: Update Firebase imports to v8 namespaced API.
import firebase from 'firebase/app';
import 'firebase/auth';
import type { User } from '../types';

// Fix: Use v8 namespaced API for authentication.
const auth = firebase.auth();

class AuthService {
  async signup(email: string, password: string): Promise<User> {
    try {
      // Fix: Use v8 method on auth object.
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      if (!firebaseUser) {
        throw new Error('User creation failed.');
      }
      return { uid: firebaseUser.uid, email: firebaseUser.email! };
    } catch (error: any) {
      // Provide more user-friendly error messages
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('An account with this email already exists.');
        case 'auth/invalid-email':
          throw new Error('Please enter a valid email address.');
        case 'auth/weak-password':
          throw new Error('Password should be at least 6 characters.');
        default:
          throw new Error('An unexpected error occurred during sign up.');
      }
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      // Fix: Use v8 method on auth object.
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
       if (!firebaseUser) {
        throw new Error('User not found.');
      }
      return { uid: firebaseUser.uid, email: firebaseUser.email! };
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          throw new Error('Invalid email or password.');
        default:
          throw new Error('An unexpected error occurred during login.');
      }
    }
  }

  async logout(): Promise<void> {
    // Fix: Use v8 method on auth object.
    await auth.signOut();
  }

  // The getCurrentUser method is now obsolete and has been removed.
  // The onAuthStateChanged listener in App.tsx is the correct way to manage auth state.
}

export const authService = new AuthService();
