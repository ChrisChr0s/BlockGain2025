// src/encryption.js
import crypto from 'crypto';
import "dotenv/config";

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const IV = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

if (!process.env.ENCRYPTION_KEY || !process.env.ENCRYPTION_IV) {
  throw new Error('ENCRYPTION_KEY and ENCRYPTION_IV must be defined in environment variables.');
}

// Funktion zum Verschlüsseln
export function encrypt(text) {
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  // Wir speichern den Auth-Tag zusammen mit den verschlüsselten Daten
  return `${encrypted}:${authTag}`;
}

// Funktion zum Entschlüsseln
export function decrypt(hash) {
  try {
    const [encryptedText, authTag] = hash.split(':');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, IV);
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error("Entschlüsselung fehlgeschlagen:", error);
    // Gib null oder einen Fehler zurück, um auf das Problem hinzuweisen
    return null; 
  }
}