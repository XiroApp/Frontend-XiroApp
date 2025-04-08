import { Rabbit, enc } from "crypto-js";

const key = import.meta.env.VITE_DECRYPT_KEY;

function decrypt(data) {
  if (data == null) return null;
  const bytes = Rabbit.decrypt(data, key);
  const decryptedData = bytes.toString(enc.Utf8);
  const parseData = JSON.parse(decryptedData);
  return parseData;
}

function encrypt(data) {
  const stringData = JSON.stringify(data);
  const encryptedData = Rabbit.encrypt(stringData, key).toString();
  return encryptedData;
}

export { decrypt, encrypt };
