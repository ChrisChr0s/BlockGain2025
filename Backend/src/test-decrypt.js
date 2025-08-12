// src/test-decrypt.js

// Importiere NUR die decrypt-Funktion aus deinem encryption-Modul
import { decrypt } from './encryption.js';

// FÜGE HIER DEN KEY EIN, den du aus deinem Log kopiert hast
const encryptedKeyFromDB = "eaf30df6321643ad667d13839dee782f4a6992f319be1170a4e8d62061c9deefae26e39a5b0c026d5d230ca66df2353202d233006916af09750c1a09dc37e0ffc1a89e77dd40:a910abd3502fa0cefa140b587be73080";

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