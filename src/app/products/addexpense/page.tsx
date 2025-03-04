"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Box, Button, Card, CardContent, Input, MenuItem, Select, TextField, Typography } from "@mui/material";
import { BadgeDollarSign, BarChart2, Home, } from "lucide-react";
import { useTransactions } from "@/Context/TransactionContext";
import { supabase } from "@/utils/supabase/supabaseClient";
import { createClient } from "@/utils/supabase/client";

const AddTransaction = () => {
    const { addTransaction, categories, addCategory } = useTransactions();
    const router = useRouter();
    const [type, setType] = useState<"income" | "expense">("expense");
    const [amount, setAmount] = useState(0);
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [user, setUser] = useState<any>(null);

    const handleAddCategory = () => {
      if (newCategory.trim() !== "") {
        addCategory(newCategory.trim());
        setNewCategory("");
        alert("Category added successfully!");
      }
    };
    
    useEffect(() => {
      const fetchUser = async () => {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();        
        setUser(data.user);
      };
      fetchUser();
    }, []);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!amount || !category || !date) {
        alert("Please fill all required fields");
        return;
      }

      const id = Date.now(); 
      const transactionData = {
        id,
        type,
        amount,
        category,
        date,
        notes,
        user_id: user.id, 
      };
    
      const { data, error } = await supabase.from("transactions").insert([transactionData]);
    
      if (error) {
        console.error("Error adding transaction:", error.message);
        alert("Failed to add transaction.");
        return;
      }
      setAmount(0);
      setCategory("");
      setDate("");
      setNotes("");
    
      alert("Transaction added successfully!");
      router.push("/products");
    };
  
  return (
    
  <Card>
    <div style={{ display: "flex", minHeight: "50vh" }}>
      <div style={{ backgroundImage:"url('/images/dash.jpg')", backgroundSize:"cover", backgroundPosition:"left", color: "white", width: "16rem", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "1rem", fontSize: "2rem", fontWeight: "bold", borderBottom: "1px solid #374151", backgroundImage:"url('/images/currencydash.jpg')", backgroundSize:"cover", backgroundPosition:"left" }}>Dashboard</div>
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem", fontSize: "3rem" }}>
            <li>
              <Button style={{ justifyContent: "flex-start", color: "#D1D5DB", width: "100%" }} onClick={() => router.push('/products')}>
                <Home style={{ marginRight: "0.5rem" }} />Home
              </Button>
            </li>
            <li>
              <Button style={{ justifyContent: "flex-start", color: "#D1D5DB", width: "100%" }} onClick={() => router.push('/products/addexpense')}>
              <BadgeDollarSign style={{ marginRight: "0.5rem" }} /> Add an Expense
              </Button>
            </li>
            <li>
              <Button style={{ justifyContent: "flex-start", color: "#D1D5DB", width: "100%" }} onClick={()=> router.push('/products/analytics')}>
                <BarChart2 style={{ marginRight: "0.5rem" }} /> Analytics
              </Button>
            </li>
          </ul>
        </nav>
      </div>

        <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1,
          backgroundImage: 'url(/images/currency.jpg)', backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center", height: "100vh" }}>
            <Card sx={{ maxWidth: 400, width: '100%', boxShadow: 3, borderRadius: 2, margin: "auto" }}>
              <CardContent>
                <Typography
                  variant="h5"
                  align="center"
                  color="error"
                  sx={{ marginBottom: 2, fontWeight: "bold", fontSize: "2.5rem", fontFamily: "Times New Roman" }}
                >
                  Add a Transaction
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" fontWeight="bold">
                      Type
                    </Typography>
                    <Select
                      value={type}
                      onChange={(e:any) => setType(e.target.value)}
                      fullWidth
                      sx={{ marginTop: 1 }}
                    >
                      <MenuItem value="income">Income</MenuItem>
                      <MenuItem value="expense">Expense</MenuItem>
                    </Select>
                  </Box>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" fontWeight="bold">
                      Amount
                    </Typography>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      fullWidth
                      required
                      sx={{ marginTop: 1 }}
                    />
                  </Box>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" fontWeight="bold">
                      Category
                    </Typography>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      fullWidth
                      required
                      sx={{ marginTop: 1 }}
                    >
                      <MenuItem value="">Select a category</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box sx={{ display: "flex", marginTop: 1, marginBottom: 2 }}>
                    <TextField
                      placeholder="New category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      fullWidth
                      sx={{ marginRight: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddCategory}
                    >
                      Add
                    </Button>
                  </Box>

                  <Box sx={{ marginBottom: 3 }}>
                    <Typography variant="body1" fontWeight="bold">
                      Date
                    </Typography>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      fullWidth
                      required
                      sx={{ marginTop: 1 }}
                    />
                  </Box>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" fontWeight="bold">
                      Notes
                    </Typography>
                    <TextField
                      fullWidth
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      multiline
                      rows={3}
                      sx={{ marginTop: 1 }}
                    />
                  </Box>
                  <Button type="submit" variant="outlined" color="success" fullWidth> Add Transaction </Button>
                </form>
              </CardContent>
          </Card>
        </main>
    </div>
    </Card>
  );
};

export default AddTransaction;
