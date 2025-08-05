import { useCallback, useState } from "react"
import { Alert } from "react-native";
import { API_URL } from "../constants/api";


export const useTransactions = (userid) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userid}`)
            const data = await response.json()
            setTransactions(data)
        } catch (error) {
            console.log("Error fetching transaction:", error)
        }
    }, [userid])
    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userid}`)
            const data = await response.json()
            setSummary (data)
        } catch (error) {
            console.log("Error fetching summary:", error)
        }
    }, [userid])


    const loadData = useCallback(async () => {
        if (!userid) return;
        setIsLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()])
        } catch (error) {
            console.log("Error loading Data", error)
        }finally{
            setIsLoading(false);
        }
    }, [fetchTransactions, fetchSummary, userid])


    const deleteTransaction = async (id) =>{
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {method: "DELETE"})
            if(!response.ok) throw new Error("Failed to delete Transaction")
                loadData();
            Alert.alert("Success", "Transaction deleted successfully")
        } catch (error) {
            console.error("Error deleting Transaction" , error)

            Alert.alert("Error", error.message);
            
        }
    } 
    return {transactions,summary, isLoading,loadData, deleteTransaction}
}