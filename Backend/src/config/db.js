// src/db.js
import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// Stellt die SQL-Verbindung über den Neon-Serverless-Treiber her
export const sql = neon(process.env.DATABASE_URL);

// Initialisiert alle notwendigen Tabellen in deiner Datenbank
export async function initDB() {
  try {
    // Deine Tabelle für Transaktionen (Tippfehler "traccnsactions" korrigiert)
    await sql`CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;

    // Deine Tabelle für die Sui-Wallets
    await sql`CREATE TABLE IF NOT EXISTS user_wallets (
        clerk_user_id VARCHAR(255) PRIMARY KEY,
        sui_public_address VARCHAR(255) NOT NULL UNIQUE,
        encrypted_private_key TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`;

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing DB:", error);
    process.exit(1);
  }
}