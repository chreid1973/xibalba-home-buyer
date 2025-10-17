import { auth } from '../firebaseConfig';
import type { User } from '../types';

const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  return auth.onAuthStateChanged(user => {
    if (user && user.email) {
      callback({ uid: user.uid, email: user.email });
    } else {
      callback(null);
    }
  });
};

const login = async (email: string, password: string): Promise<User> => {
  const userCredential = await auth.signInWithEmailAndPassword(email, password);
  if (userCredential.user && userCredential.user.email) {
    return { uid: userCredential.user.uid, email: userCredential.user.email };
  }
  throw new Error('Login failed: No user returned from Firebase.');
};

const signup = async (email: string, password: string): Promise<User> => {
  const userCredential = await auth.createUserWithEmailAndPassword(email, password);
  if (userCredential.user && userCredential.user.email) {
    return { uid: userCredential.user.uid, email: userCredential.user.email };
  }
  throw new Error('Signup failed: No user returned from Firebase.');
};

const logout = async (): Promise<void> => {
  await auth.signOut();
};

export const authService = {
  onAuthStateChanged,
  login,
  signup,
  logout,
};
