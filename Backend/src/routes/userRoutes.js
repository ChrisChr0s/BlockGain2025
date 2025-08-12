// src/routes/userRoutes.js
import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { sql } from '../config/db.js'; // Deine Neon-DB-Verbindung

const router = express.Router();

// Diese Route ist jetzt geschützt. Clerks Middleware wird zuerst ausgeführt.
// Wenn der Benutzer nicht authentifiziert ist, wird automatisch ein 401-Fehler gesendet.
router.get('/user_wallets', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        // Durch die Middleware haben wir jetzt Zugriff auf 'req.auth'.
        const clerkUserId = req.auth.userId;

        // Das Wallet des Benutzers aus der Datenbank holen
        const result = await sql`
            SELECT sui_public_address FROM user_wallets WHERE clerk_user_id = ${clerkUserId}
        `;

        if (result.length === 0) {
            return res.status(404).json({ error: 'Wallet für diesen Benutzer nicht gefunden.' });
        }

        // Die öffentliche Adresse an das Frontend zurücksenden
        res.status(200).json({ publicAddress: result[0].sui_public_address });

    } catch (error) {
        console.error("Fehler beim Abrufen des Wallets:", error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

export default router;