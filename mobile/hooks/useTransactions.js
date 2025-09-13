// react custom hook file
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

const API_URL = 'https://localhost:5001/api'

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });

  const [isLoading, setIsLoading] = useState(true);

//   call back is used for performance optimization, it will memoize the function
  const fetchTransactions = useCallback(async () => {
  try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
  } catch (error) {
      console.error("Error fetching transactions:", error);
  }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
  try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      setSummary(data);
  } catch (error) {
      console.error("Error fetching transactions:", error);
  }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try{
    // Fetch transactions and summary concurrently (parallel fetching)
        await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
        console.error("Error loading data:", error);
    } finally {
        setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);
  
  const deleteTransaction = async (transactionId) => {
    try {
        const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error("Failed to delete transaction");
        }
        // Optionally, refetch data or update state
        loadData();
        Alert.alert("Transaction deleted successfully");
    } catch (error) {
        console.error("Error deleting transaction:", error);
        Alert.alert("Error deleting transaction", error.message);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
