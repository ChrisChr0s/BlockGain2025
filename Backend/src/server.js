import dotenv from "dotenv";
import express, { response } from "express";
import RateLimite from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import { initDB } from "./config/db.js";
import job from "./config/cron.js"


dotenv.config();

const app = express()
//middleware
if (process.env.NODE_ENV === "production") job.start();
app.use(RateLimite);
app.use(express.json())

const PORT = process.env.PORT || 5001;

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

app.use("/api/transactions", transactionsRoute)

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is Up and Running on Port:", PORT)
    });
});
