import dotenv from "dotenv";
import express from "express";
import bodyParser from 'body-parser';
import { Webhook } from 'svix';

import RateLimite from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import { initDB } from "./config/db.js";
import job from "./config/cron.js";
import { createWalletForUser } from './wallet-creator.js'; 
import userRoutes from './routes/userRoutes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Use one port for the entire server
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

// --- Middleware Setup ---
// The Clerk webhook needs the raw request body, so other parsers must come after it.
// We define the webhook route first.


app.post('/api/clerk-webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    if (!CLERK_WEBHOOK_SECRET) {
        return res.status(500).json({ success: false, message: 'Webhook secret not configured.' });
    }
    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    let evt;
    try {
        const payloadString = req.body.toString('utf8');
        const svixHeaders = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        };
        evt = wh.verify(payloadString, svixHeaders);
    } catch (err) {
        console.error('Error verifying webhook:', err.message);
        return res.status(400).json({ success: false, message: 'Verification Error' });
    }

    const eventType = evt.type;
    if (eventType === 'user.created') {
        console.log(`User created: ${evt.data.id}`);
        try {
            await createWalletForUser(evt.data.id);
            console.log(`Wallet for user ${evt.data.id} created successfully.`);
        } catch (walletError) {
            console.error(`Error creating wallet for user ${evt.data.id}:`, walletError);
        }
    }

    res.status(200).json({ success: true, message: 'Webhook received' });
});

// --- Other Middleware (must be after the webhook) ---
if (process.env.NODE_ENV === "production") job.start();
app.use(RateLimite);
app.use(express.json()); // This is a built-in version of bodyParser for JSON

// --- API Routes ---
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionsRoute);
app.use("/api", userRoutes); 


// --- Start Server ---
// Initialize the database and then start the server ONCE.
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is Up and Running on Port: ${PORT}`);
    });
});