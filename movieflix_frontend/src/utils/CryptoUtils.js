import CryptoJS from "crypto-js";

// Fetch your secret key and IV from environment variables
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
const SECRET_IV = process.env.REACT_APP_SECRET_IV;

// console.log("Secret Key : ",SECRET_KEY, "Secret IV : ",SECRET_KEY, SECRET_IV);

// Ensure both SECRET_KEY and SECRET_IV are defined
if (!SECRET_KEY || !SECRET_IV) {
  throw new Error("SECRET_KEY or SECRET_IV is not defined");
}

// Convert key and IV to WordArray format
const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
const iv = CryptoJS.enc.Utf8.parse(SECRET_IV);

// Encryption function
export const encrypt = (text) => {
  // Encrypt the text
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

// Decryption function
export const decrypt = (ciphertext) => {
  // Decrypt the ciphertext
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
