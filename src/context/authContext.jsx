import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";

export const authContext = createContext();

export const useAuth = () => {
  const loggedUser = useContext(authContext);
  if (!loggedUser) throw new Error("there is not logged user provider");
  return loggedUser;
};

export function AuthProvider({ children }) {
  const [fUser, setFuser] = useState(null);
  const [loading, setLoading] = useState(true);

  // const user = { login: true };

  const signUp = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, { displayName: displayName });

      return userCredential;
    } catch (error) {
      console.log(error.code);
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/email-already-in-use"
      )
        return { error: { email: true } };
      if (
        error.code === "auth/weak-password" ||
        error.code === "auth/missing-password"
      )
        return { error: { password: true } };
    }
  };

  const login = async (email, password) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return userCredentials;
    } catch (error) {
      console.log(error.code);
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/user-not-found"
      )
        return { error: { email: true } };
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/missing-password"
      )
        return { error: { password: true } };
    }
  };

  const logout = async () => await signOut(auth);

  const loginWithGoogle = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      return await signInWithPopup(auth, googleProvider); /* testing function */
    } catch (error) {
      console.error(error);
    }
  };
  const loginWithFacebook = async () => {
    const facebookProvider = new FacebookAuthProvider();
    let loggedUser = await signInWithPopup(auth, facebookProvider);

  };
  const loginWithTwitter = async () => {
    const twitterProvider = new TwitterAuthProvider();
    signInWithPopup(auth, twitterProvider);
  };

  const sendPasswordResetEmailService = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (currentUser) => {
      setFuser(currentUser);
      setLoading(false);
    });
    return () => unsuscribe();
  }, []);

  return (
    <authContext.Provider
      value={{
        signUp,
        login,
        fUser,
        logout,
        loading,
        loginWithGoogle,
        sendPasswordResetEmailService,
        loginWithFacebook,
        loginWithTwitter,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
