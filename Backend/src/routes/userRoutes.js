import express from "express";
import { sql } from "../config/db.js"; // Falls deine DB-Verbindung hier liegt

const router = express.Router();

// Wallet-Adresse nach userId abrufen
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        // DB-Abfrage – Spaltennamen anpassen falls nötig
        const result = await sql`
            SELECT sui_public_address 
            FROM user_wallets 
            WHERE clerk_user_id = ${userId}
        `;

        if (result.length === 0) {
            return res.status(404).json({ error: "Wallet nicht gefunden" });
        }

        res.json({ publicAddress: result[0].sui_public_address });
    } catch (error) {
        console.error("Fehler beim Abrufen der Wallet:", error);
        res.status(500).json({ error: "Serverfehler" });
    }
});

export default router;
//   export async function getPublicAdress(req,res){
    
//         try {
//             const { userId } = req.params;
//             console.log(userId);
//             const transactions = await sql`
//             SELECT sui_public_address FROM user_wallets WHERE clerk_user_id = ${userId} 
//             `
    
//             res.status(200).json(transactions);
//         } catch (error) {
//             console.log("Error getting the transaction", error)
//             res.status(500).json({ message: "Internal Server error" })
//         }
//     }