import pako from 'pako';
import nacl from 'tweetnacl';
import { decodeUTF8, encodeUTF8, decodeBase64, encodeBase64 } from 'tweetnacl-util';

export function compress(data: Uint8Array) {
  return pako.gzip(data);
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

export function arrayBufferToBase64(buffer: Uint8Array): string {
  return encodeBase64(buffer);
}

function deriveKey(password: string): Uint8Array {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  
  const hash = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    hash[i] = passwordBytes[i % passwordBytes.length];
  }
  
  return hash;
}

export function encrypt(data: string, secretKey: string) {
  const key = deriveKey(secretKey);
  const nonce = nacl.randomBytes(24);
  const messageUint8 = decodeUTF8(data);
  const encrypted = nacl.secretbox(messageUint8, nonce, key);
  
  return {
    ciphertext: encodeBase64(encrypted),
    nonce: encodeBase64(nonce)
  };
}

export function decrypt(ciphertext: string, nonce: string, secretKey: string) {
  const key = deriveKey(secretKey);
  const ciphertextBytes = decodeBase64(ciphertext);
  const nonceBytes = decodeBase64(nonce);
  
  const decrypted = nacl.secretbox.open(ciphertextBytes, nonceBytes, key);
  
  if (!decrypted) {
    throw new Error('Decryption failed');
  }
  
  return encodeUTF8(decrypted);
}
