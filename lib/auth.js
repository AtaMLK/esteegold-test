import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Google Sign-In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

// Sign Out
export const logout = async () => {
  await signOut(auth);
};

// Listen to Auth State Changes
export const listenAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};
