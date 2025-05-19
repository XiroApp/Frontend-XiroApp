import { decrypt, encrypt } from "../encrypt";
import { useState } from "react";

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? decrypt(item) : initialValue;
    } catch (err) {
      console.error(err.message);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, encrypt(valueToStore));
    } catch (err) {
      console.error(err.message);
    }
  };
  return [storedValue, setValue];
}
