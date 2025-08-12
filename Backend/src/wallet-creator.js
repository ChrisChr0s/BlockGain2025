// src/wallet-creator.js

// Importiere 'sql' anstelle von 'pool' aus deiner neuen db.js
import { sql } from './config/db.js'; 
import { encrypt } from './encryption.js';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

// Die angepasste Funktion zum Speichern
const saveWalletToDatabase = async (clerkUserId, publicAddress, encryptedPrivateKey) => {
  try {
    // So schreibst du Queries mit dem Neon-Treiber.
    // Es ist sicherer, da es SQL-Injection automatisch verhindert.
    await sql`
      INSERT INTO user_wallets (clerk_user_id, sui_public_address, encrypted_private_key)
      VALUES (${clerkUserId}, ${publicAddress}, ${encryptedPrivateKey})
      ON CONFLICT (clerk_user_id) DO NOTHING;
    `;
    console.log(`Wallet für Benutzer ${clerkUserId} erfolgreich in der DB gespeichert.`);
  } catch (error) {
    console.error("Fehler beim Speichern des Wallets in der DB:", error);
    throw error;
  }
};

// Der Rest deiner createWalletForUser Funktion bleibt gleich...
export const createWalletForUser = async (clerkUserId) => {
  console.log("PrivateKey",privateKey)
    const keypair = new Ed25519Keypair();
    const publicAddress = keypair.getPublicKey().toSuiAddress();
    const privateKey = keypair.getSecretKey();

    //const encryptedPrivateKey = `encrypted_${privateKey}`; // ERSETZE DAS!
     const encryptedPrivateKey = encrypt(privateKey);

    await saveWalletToDatabase(clerkUserId, publicAddress, encryptedPrivateKey);

    console.log("Wallet-Erstellungsprozess für " + clerkUserId + " abgeschlossen.");
};