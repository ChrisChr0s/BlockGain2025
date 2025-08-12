// // src/routes/userRoutes.js
// import express from 'express';
// import{getPublicAdress } from "../controllers/transactionsController.js";
// //import { sql } from '../config/db.js'; // Deine Neon-DB-Verbindung

// const router = express.Router();

// // Diese Route ist jetzt geschützt. Clerks Middleware wird zuerst ausgeführt.
// // Wenn der Benutzer nicht authentifiziert ist, wird automatisch ein 401-Fehler gesendet.
// // router.get("/:userId", getPublicAdress);
// // router.get("/:userId", (req, res) => {
// //     res.json({ test: true, userId: req.params.userId });
// // });
// router.get("/api/user_wallets", (req, res) => {
//     res.json({ ok: true, userId: req.params.userId });
// });

// router.get("/:userId", getPublicAdress);

//     //async (req, res) =>
    
// //     {
// //     console.log("--- GET /api/user_wallets ENDPUNKT GETROFFEN ---");
// //     try {
// //         // Durch die Middleware haben wir jetzt Zugriff auf 'req.auth'.
        

       
// //         console.log(`Schritt 1: Suche in der Datenbank nach Wallet für User: ${clerkUserId}`);
// //         // Das Wallet des Benutzers aus der Datenbank holen
// //         const result = await sql`
// //             SELECT sui_public_address FROM user_wallets WHERE clerk_user_id = ${clerkUserId}
// //         `;
// //         console.log("Schritt 3: Datenbankabfrage abgeschlossen. Ergebnis:", result);

// //         if (result.length === 0) {
// //             console.warn("Schritt 4: KEIN Wallet für diese User ID in der Datenbank gefunden. Sende 404.");
// //             return res.status(404).json({ error: 'Wallet für diesen Benutzer nicht gefunden.' });
// //         }

// //         // Die öffentliche Adresse an das Frontend zurücksenden
// //         const publicAddress = result[0].sui_public_address;
// //         console.log("Schritt 4: Wallet gefunden! Sende öffentliche Adresse:", publicAddress);
// //         res.status(200).json({ publicAddress: result[0].sui_public_address });

// //     } catch (error) {
// //         console.error("FATALER FEHLER im try-Block:", error);
        
// //         console.error("Fehler beim Abrufen des Wallets:", error);
// //         res.status(500).json({ error: 'Interner Serverfehler' });
// //     }
// // });

// export default router;

import express from "express";
const router = express.Router();

router.get("/:userId", (req, res) => {
    res.json({ hello: "world", id: req.params.userId });
});

export default router;
