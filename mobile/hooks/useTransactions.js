import { useCallback, useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'; // Importieren für den Kontostand

export const useTransactions = (userid) => {
    // === Bestehende States von dir ===
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    // === Neue States von mir ===
    const [walletAddress, setWalletAddress] = useState(null);
    const [balance, setBalance] = useState(null);

    // === Authentifizierung von Clerk ===


    // Hilfsfunktion zum Erstellen der Authentifizierungs-Header


    // Deine bestehende Logik, jetzt mit Authentifizierung
    const fetchTransactions = useCallback(async () => {
        try {

            const response = await fetch(`${API_URL}/transactions/${userid}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.log("Fehler beim Abrufen der Transaktionen:", error);
        }
    }, [userid]);

    const fetchSummary = useCallback(async () => {
        try {

            const response = await fetch(`${API_URL}/transactions/summary/${userid}`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.log("Fehler beim Abrufen der Zusammenfassung:", error);
        }
    }, [userid]);

    // === Neue Logik zum Abrufen des Wallets & Kontostands ===
    const fetchWalletData = useCallback(async () => {
        try {

            console.log(`${API_URL}/user_wallets/${userid}`);

            const response = await fetch(`${API_URL}/user_wallets/${userid}`);
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP ${response.status}: ${text}`);}

                const walletData = await response.json();
                const address = walletData.publicAddress;
                setWalletAddress(address);

                // Kontostand direkt danach abrufen
                const client = new SuiClient({ url: getFullnodeUrl('testnet') });
                const balanceResponse = await client.getBalance({ owner: address });
                const suiBalance = parseInt(balanceResponse.totalBalance) / 1_000_000_000;
                setBalance(suiBalance.toFixed(4));
            } catch (error) {
                console.log("Fehler beim Abrufen der Wallet-Daten:", error);
            }
        }, [userid]);

    // Deine loadData-Funktion, jetzt erweitert um fetchWalletData
    const loadData = useCallback(async () => {
        if (!userid) return;
        setIsLoading(true);
        try {
            // Führt alle Abfragen gleichzeitig aus für maximale Effizienz
            await Promise.all([
                fetchTransactions(),
                fetchSummary(),
                fetchWalletData()
            ]);
        } catch (error) {
            console.log("Fehler beim Laden der Daten", error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchTransactions, fetchSummary, fetchWalletData, userid]);

    // Initiales Laden der Daten
    useEffect(() => {
        loadData();
    }, [loadData]);


    // Deine deleteTransaction-Funktion, jetzt mit Authentifizierung
    const deleteTransaction = async (id) => {
        try {

            const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: "DELETE",

            });
            if (!response.ok) throw new Error("Löschen der Transaktion fehlgeschlagen");
            loadData(); // Lädt alle Daten neu, um die UI zu aktualisieren
            Alert.alert("Erfolg", "Transaktion erfolgreich gelöscht");
        } catch (error) {
            console.error("Fehler beim Löschen der Transaktion", error);
            Alert.alert("Fehler", error.message);
        }
    };

    // Gib alle Werte zurück, die deine UI benötigt
    return {
        transactions,
        summary,
        isLoading,
        loadData,
        deleteTransaction,
        walletAddress,
        balance
    };
};