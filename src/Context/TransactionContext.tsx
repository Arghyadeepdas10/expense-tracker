"use client"
import React, { createContext, useContext, useState } from "react";

interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  notes: string;
}

interface TransactionContextProps {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  categories: string[];
  addCategory: (category: string) => void;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Food",
    "Travel",
    "Utilities",
    "Shopping",
  ]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, { ...transaction, id: transactions.length + 1 }]);
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, categories, addCategory }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};
