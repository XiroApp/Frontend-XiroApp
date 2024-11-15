import { Settings } from ".";
import { v4 } from "uuid";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

//------------------------------------------------------------------------------------------------------
// import { getFirestore } from 'firebase/firestore';//=====>NO SE CUAL VA
import { getFirestore } from "firebase/firestore/lite"; // ---otras opciones=> collection, getDocs
//------------------------------------------------------------------------------------------------------
import { getMessaging } from "firebase/messaging";
// import { getFunctions } from "firebase/functions";
import {
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
// import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = Settings.getDefaultConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Connect services
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

export const auth = getAuth(app);



export const signOutFunction = signOut;
// export const sendPasswordResetEmailFunction = sendPasswordResetEmail;
export const resetPassword = async (email, currentPassword, newPassword) => {
  const credential = await EmailAuthProvider.credential(email, currentPassword);
  try {
    await reauthenticateWithCredential(auth.currentUser, credential);

    const data = await updatePassword(auth.currentUser, newPassword);
    return data;
  } catch (error) {
    return error.message;
  }
};

export const messaging = getMessaging(app);

/* STORAGE SERVICE */
export const storage = getStorage(app);

export async function uploadFile(file) {
  let date = new Date();
  let dateString =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2) +
    "T" +
    ("0" + date.getHours()).slice(-2) +
    "-" +
    ("0" + date.getMinutes()).slice(-2) +
    "-" +
    ("0" + date.getSeconds()).slice(-2);

  let originalNameTrim = file.name.replace(/\s/g, "");

  const storageRef = ref(
    storage,
    `${dateString}-${originalNameTrim}`
  ); /* AGREGAR FECHA AL STRING PARA HACERLO ÚNICO */
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  const metadata = await getMetadata(storageRef);
  return `${dateString}-${originalNameTrim}`;
}
