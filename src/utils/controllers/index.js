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
    return data;
  } catch (err) {
    localStorage.removeItem("loggedUser"); //* Remover datos antiguos no encriptados.
    localStorage.removeItem("logged-user");
    return null;
  }
}

function endSession() {
  localStorage.removeItem("logged-user");
  signOutFunction(auth);
}

export { startSession, getSession, endSession };
