"use client"
import { createClient } from '@/utils/supabase/client';
import { Box, Button, Card, Input, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Home, User, BarChart2, BadgeDollarSign, CircleUserIcon } from "lucide-react";
import SearchIcon from "@mui/icons-material/Search";
import { useFetchCategories } from '@/Hooks/React Query/useFetchCategory';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useFetchTransactions } from '@/Hooks/React Query/usefetchQuery';
import Loader from '@/UI/Loader';

interface User {
  id: string;
  email: string;
  [key: string]: any; 
}

interface Transact {
  id: string;
  type: string;
  category: string;
  amount: number;
  date: string;
  notes: string;
  name: string;
}

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | any>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const{data: transactions=[]} = useFetchTransactions(user?.id || "")    
  const{data: categories=[]} = useFetchCategories(user);
  const [transactions, setTransactions] = useState<any[]>([]);
  // const [categories, setCategories] = useState([]);

  const [filter, setFilter] = useState({ category:"", type: "", date: "" });
  const router = useRouter();

  if(loading) return <Loader />;

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();   
      console.log(data);
         
      if (error) {
        console.log('User not authenticated. Redirecting to login.');
        router.push('/login');      
      } else if (data?.user) {
        setUser({
          ...data.user,
          id: data.user.id,
          email: data.user.email || '',
        });
      }
      setLoading(false);
    }
    getUser(); 
  }, [router]);

  
  const fetchdata = async (id: any) => {
    if (!user?.id) return;
    const { data, error } = await supabase.from("transactions").select("*").eq("user_id", user.id);
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      console.log("Fetched data:", data);
      setTransactions(data || []); 
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchdata(user?.id);
    }
  }, [user]);
  

  const filteredTransactions = transactions.filter((transaction: Transact) => {
    const matchesSearch = searchTerm
      ? transaction.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory = filter.category ? transaction.category === filter.category : true;
    const matchesType = filter.type ? transaction.type === filter.type : true;
    const matchesDate = filter.date ? transaction.date === filter.date : true;
    return matchesSearch && matchesCategory && matchesType && matchesDate;
  });

  const totalIncome = transactions
    .filter((transaction: { type: string; }) => transaction.type === "income")
    .reduce((sum: any, transaction: { amount: any; }) => sum + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction: { type: string; }) => transaction.type === "expense")
    .reduce((sum: any, transaction: { amount: any; }) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;


  return (
    <div>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <div style={{ backgroundImage:"url('/images/dash.jpg')", backgroundSize:"cover", backgroundPosition:"left", color: "white", width: "16rem", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "1rem", fontSize: "2rem", fontWeight: "bold", borderBottom: "5px solidrgb(10, 70, 167)", backgroundImage:"url('/images/currencydash.jpg')", backgroundSize:"cover", backgroundPosition:"left"}}>Dashboard</div>
          <nav style={{ flex: 1 }}>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem", fontSize: "3rem" }}>
              <li>
                <Button
                  fullWidth
                  onClick={() => router.push("/products")}
                  style={{ justifyContent: "flex-start", color: "#D1D5DB" }}
                >
                  <Home style={{ marginRight: "0.5rem" }} /> Home
                </Button>
              </li>
              <li>
                <Button
                  fullWidth
                  onClick={() => router.push("/products/addexpense")}
                  style={{ justifyContent: "flex-start", color: "#D1D5DB" }}
                >
                  <BadgeDollarSign style={{ marginRight: "0.5rem" }} /> Add an Expense
                </Button>
              </li>
              <li>
                <Button
                  fullWidth
                  onClick={() => router.push("/products/analytics")}
                  style={{ justifyContent: "flex-start", color: "#D1D5DB" }}
                >
                  <BarChart2 style={{ marginRight: "0.5rem" }} /> Analytics
                </Button>
              </li>
            </ul>
          </nav>
        </div>

        <main style={{ flex: 1, padding: "1.5rem" }}>        
          <Box sx={{ padding: 3, textAlign: "center" }}>
            <Typography
                variant="h4"
                sx={{
                  color: "#FF8C00",
                  fontWeight: "bold",
                  fontSize: { xs: "2.5rem", sm: "4rem", md: "5rem" },
                  fontFamily: "'Times New Roman', serif",
                  marginBottom: 2,
                  textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                }}
              >
                Overview
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "20px auto",
                width: { xs: "100%", sm: "80%", md: "60%" },
                maxWidth: "600px",
                boxShadow: "0px 2px 5px rgba(48, 12, 229, 0.74)",
                borderRadius: 2,
                padding: "0 16px",
              }}>
              <SearchIcon sx={{color: "rgba(48, 12, 229, 0.74)",  marginRight: "8px",  fontSize: "1.8rem", }}/>
              <TextField
                variant="standard"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{
                  flex: 1,
                  "& .MuiInputBase-input": {
                    fontSize: "1.2rem",
                    padding: "8px",
                  },
                }}
              />
            </Box>

            <Card sx={{ display: "flex", justifyContent: "space-around", padding: 3, boxShadow: "0px 0px 3px blue", marginBottom: 3 }}>
              <Box textAlign="center">
                <Typography variant="h6">Income</Typography>
                <Typography variant="h5" color="success.main">${totalIncome.toFixed(2)}</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6">Expense</Typography>
                <Typography variant="h5" color="error.main">${totalExpenses.toFixed(2)}</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6">Total Balance</Typography>
                <Typography variant="h5" color="primary.main">${balance.toFixed(2)}</Typography>
              </Box>
            </Card>

            <Typography
              variant="h5"
              align="center"
              sx={{ color: "#3B82F6", fontWeight: "bold", marginBottom: 2, fontSize: "2rem", fontFamily: "Times New Roman" }}
            >
              Filter Transactions
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 3,
              }}
            >
              {/* Category Filter */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: "250px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="body1" fontWeight="500" sx={{ marginBottom: 1 }}>
                  Category
                </Typography>
                <Select
                  value={filter.category}
                  onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                  fullWidth
                  sx={{
                    borderRadius: 1,
                    padding: "8px",
                    "& .MuiSelect-select": { padding: "10px" },
                    boxShadow: "0px 2px 8px rgba(48, 12, 229, 0.74)",
                  }}>
                 <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: "250px",
                  display: "flex",
                  flexDirection: "column",
                }} >
                <Typography variant="body1" fontWeight="500" sx={{ marginBottom: 1 }}>
                  Type
                </Typography>
                <Select
                  value={filter.type}
                  onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                  fullWidth
                  sx={{
                    borderRadius: 1,
                    padding: "8px",
                    "& .MuiSelect-select": { padding: "10px" },
                    boxShadow: "0px 2px 8px rgba(48, 12, 229, 0.74)",
                  }} >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: "250px",
                  display: "flex",
                  flexDirection: "column",
                }}>
                <Typography variant="body1" fontWeight="500" sx={{ marginBottom: 1 }}>
                  Date
                </Typography>
                <Input
                  type="date"
                  value={filter.date}
                  onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                  fullWidth
                  sx={{
                    borderRadius: 1,
                    padding: "10px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0px 2px 8px rgba(48, 12, 229, 0.74)",
                  }}
                />
              </Box>
            </Box>

            <Typography variant="h5" sx={{ color: "#FACC15", fontWeight: "bold", marginBottom: 2, fontSize: "2rem", fontFamily: "Times New Roman" }}>
              Recent Transactions
            </Typography>

            <Box>
              {filteredTransactions.length === 0 ? (
                <Typography>No transactions found.</Typography>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {filteredTransactions.map((transaction: Transact) => (
                    <li
                      key={transaction.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 8px rgba(48, 12, 229, 0.74)",
                        borderLeft: `4px solid ${
                          transaction.type === "income" ? "#10B981" : "#EF4444"
                        }`,
                        marginBottom: "1rem",
                      }}>
                      <Box>
                        <Typography fontWeight="500">{transaction.category}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {transaction.date}
                        </Typography>
                        <Typography variant="body2">{transaction.notes}</Typography>
                      </Box>
                      <Typography fontWeight="bold"  color={transaction.type === "income" ? "success.main" : "error.main"} >
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </Typography>
                    </li>
                  ))}     
                </ul>
              )}
            </Box>
          </Box>
        </main>
      </div>
    </div>
  );
}
