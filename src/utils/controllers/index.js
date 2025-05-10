import { signOutFunction } from "../../config/firebase";
import { auth } from "../../config/firebase";
import { decrypt, encrypt } from "../encrypt";

function startSession({
  email,
  displayName = null,
  accessToken,
  photoURL = null,
  uid,
}) {
  const data = { email, accessToken, displayName, photoURL, uid };
  localStorage.setItem("logged-user", encrypt(data));
}

function getSession() {
  try {
    const data = decrypt(localStorage.getItem("logged-user"));
    // if (!data || !data.uid) throw new Error("Datos inválidos");
    return data;
  } catch (err) {
    console.error("Error al obtener la sesión:", err.message);
    localStorage.removeItem("logged-user");
    return null;
  }
}

function endSession() {
  localStorage.removeItem("logged-user");
  signOutFunction(auth);
}

export { startSession, getSession, endSession };
