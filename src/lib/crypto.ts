
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  throw new Error('Invalid ENCRYPTION_KEY: must be at least 32 characters.');
}

export function encrypt(data: string): string {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(data, ENCRYPTION_KEY, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.toString();
}

export function decrypt(data: string): string {
  const [ivHex, encrypted] = data.split(':');
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  
  const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return decrypted.toString(CryptoJS.enc.Utf8);
}
