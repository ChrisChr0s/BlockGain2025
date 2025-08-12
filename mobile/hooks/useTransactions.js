import { useCallback, useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";
import { useAuth } from "@clerk/clerk-expo"; // Importieren für die Authentifizierung
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'; // Importieren für den Kontostand

export const useTransactions = (userId) => {
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
    const { getToken } = useAuth();

    // Hilfsfunktion zum Erstellen der Authentifizierungs-Header
    const createAuthHeaders = async () => {
        const token = await getToken();
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
    };

    // Deine bestehende Logik, jetzt mit Authentifizierung
    const fetchTransactions = useCallback(async () => {
        try {
            const headers = await createAuthHeaders();
            const response = await fetch(`${API_URL}/transactions/${userId}`, { headers });
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.log("Fehler beim Abrufen der Transaktionen:", error);
        }
    }, [userId, getToken]);

    const fetchSummary = useCallback(async () => {
        try {
            const headers = await createAuthHeaders();
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`, { headers });
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.log("Fehler beim Abrufen der Zusammenfassung:", error);
        }
    }, [userId, getToken]);
    
    // === Neue Logik zum Abrufen des Wallets & Kontostands ===
    const fetchWalletData = useCallback(async () => {
        try {
            const headers = await createAuthHeaders();
            const walletResponse = await fetch(`${API_URL}/api/user_wallets`, { headers });
            if (!walletResponse.ok) throw new Error("Wallet nicht gefunden.");
            
            const walletData = await walletResponse.json();
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
    }, [userId, getToken]);

    // Deine loadData-Funktion, jetzt erweitert um fetchWalletData
    const loadData = useCallback(async () => {
        if (!userId) return;
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
    }, [fetchTransactions, fetchSummary, fetchWalletData, userId]);
    
    // Initiales Laden der Daten
    useEffect(() => {
        loadData();
    }, [loadData]);


    // Deine deleteTransaction-Funktion, jetzt mit Authentifizierung
    const deleteTransaction = async (id) => {
        try {
            const headers = await createAuthHeaders();
            const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: "DELETE",
                headers,
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