// src/test-decrypt.js

// Importiere NUR die decrypt-Funktion aus deinem encryption-Modul
import { decrypt } from './encryption.js';

// FÜGE HIER DEN KEY EIN, den du aus deinem Log kopiert hast
const encryptedKeyFromDB = "eaf30df6321643ad667d13839ebe29374e3bd7a74ff21660a0bfc46979db93eeab6cb98b520d11615d2b47b76ce9303506cf781b2152ad48750a581ed567f1f2c0b7c17c9840:31bbfb2c4860dab5d754eb22a75a5347";

console.log("Teste die Entschlüsselung...");
console.log("Verschlüsselter Key:", encryptedKeyFromDB);

// Rufe die decrypt-Funktion mit dem verschlüsselten Key auf
const decryptedKey = decrypt(encryptedKeyFromDB);

console.log("--- ERGEBNIS ---");
console.log("Entschlüsselter Private Key:", decryptedKey);

// Überprüfe, ob das Ergebnis wie ein echter Sui-Key aussieht
if (decryptedKey && decryptedKey.startsWith('suiprivkey1')) {
  console.log("✅ Test erfolgreich! Der Key sieht valide aus.");
  console.log("Privater Schlüssel:", decryptedKey);
} else {
  console.error("❌ Test fehlgeschlagen oder der Key ist null.");
}