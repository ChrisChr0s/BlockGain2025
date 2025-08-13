// src/test-decrypt.js

// Importiere NUR die decrypt-Funktion aus deinem encryption-Modul
import { decrypt } from './encryption.js';

// FÜGE HIER DEN KEY EIN, den du aus deinem Log kopiert hast
const encryptedKeyFromDB = "eaf30df6321643ad667d13839eb82b2a55349cac1bf3556ba5a2c67730d892f1ef6aab810f02196609204aa463b66a3552c83c436450f84a6d0349499468a0ef93a59e3a9844:94f30c6394faa407209cb6d7a7607ed6";

console.log("Teste die Entschlüsselung...");
console.log("Verschlüsselter Key:", encryptedKeyFromDB);

// Rufe die decrypt-Funktion mit dem verschlüsselten Key auf
const decryptedKey = decrypt(encryptedKeyFromDB);

console.log("--- ERGEBNIS ---");
console.log("Entschlüsselter Private Key:", decryptedKey);

// Überprüfe, ob das Ergebnis wie ein echter Sui-Key aussieht
if (decryptedKey && decryptedKey.startsWith('suiprivkey1')) {
  console.log("✅ Test erfolgreich! Der Key sieht valide aus.");
} else {
  console.error("❌ Test fehlgeschlagen oder der Key ist null.");
}