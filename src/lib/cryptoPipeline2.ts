import pako from 'pako';
import nacl from 'tweetnacl';
import { decodeUTF8, encodeUTF8, decodeBase64, encodeBase64 } from 'tweetnacl-util';

export function compress(data: Uint8Array): Uint8Array {
  return pako.gzip(data);
}

export function decompress(data: Uint8Array): Uint8Array {
  return pako.ungzip(data);
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

export function base64ToArrayBuffer(base64: string): Uint8Array {
  return decodeBase64(base64);
}

function hexStringToBytes(hex: string): Uint8Array {
  if (hex.length !== 64) {
    throw new Error('Secret key must be 64 hex characters (32 bytes)');
  }
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export function encrypt(data: string, secretKeyHex: string) {
  const key = hexStringToBytes(secretKeyHex);
  const nonce = nacl.randomBytes(24);
  const messageUint8 = decodeUTF8(data);
  const encrypted = nacl.secretbox(messageUint8, nonce, key);
  
  return {
    ciphertext: encodeBase64(encrypted),
    nonce: encodeBase64(nonce)
  };
}

export function decrypt(ciphertext: string, nonce: string, secretKeyHex: string): string {
  const key = hexStringToBytes(secretKeyHex);
  const ciphertextBytes = decodeBase64(ciphertext);
  const nonceBytes = decodeBase64(nonce);
  
  const decrypted = nacl.secretbox.open(ciphertextBytes, nonceBytes, key);
  
  if (!decrypted) {
    throw new Error('Decryption failed');
  }
  
  const decryptedString = encodeUTF8(decrypted);
  const compressedBytes = base64ToArrayBuffer(decryptedString);
  const decompressed = decompress(compressedBytes);
  
  return new TextDecoder().decode(decompressed);
}
