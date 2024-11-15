import { signOutFunction } from "../../config/firebase";
import { auth } from "../../config/firebase";

export const startSession = ({
  email,
  displayName = null,
  accessToken,
  photoURL = null,
  uid,
}) => {
  localStorage.setItem(
    "loggedUser",
    JSON.stringify({ email, accessToken, displayName, photoURL, uid })
  );
};

export const getSession = () => {
  let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  return loggedUser;
};
export const endSession = () => {
  localStorage.removeItem("loggedUser");
  signOutFunction(auth);

  return console.log("Has cerrado sesión, vuelve pronto!");
};
