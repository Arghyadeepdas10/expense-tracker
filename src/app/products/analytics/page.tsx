"use client";
import { Button, Box, Typography, Divider, TextField } from "@mui/material";
import { BadgeDollarSign, BarChart2, Download, Home, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { AllCommunityModule, ColDef, ModuleRegistry, GridApi } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import { AgGridReact } from "ag-grid-react";
import { useTransactions } from "@/Context/TransactionContext";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { useFetchCategories } from "@/Hooks/React Query/useFetchCategory";
import { supabase } from "@/utils/supabase/supabaseClient";
import { createClient } from "@/utils/supabase/client";


interface User {
  id: string;
  email: string;
  [key: string]: any; 
}


export default function Analytics() {
  const router = useRouter();
  // const { transactions, categories } = useTransactions();
  const [user, setUser] = useState<User | any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const{data: categories=[]} = useFetchCategories(user);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
  }, []);

   useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else if (error) {
        console.error("Error fetching user:", error.message);
      }
    };
    fetchUser();
  }, []);


  const fetchTransactions = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase.from("transactions").select("*").eq("user_id", user.id);

    if (error) {
      console.error("Error fetching transactions:", error.message);
    } else {
      setTransactions(data || []);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    }
  }, [user]);

  

  const columnDefs: ColDef<any>[] = [
    { headerName: "ID", field: "id", sortable: true, filter: true },
    { headerName: "Type", field: "type", sortable: true, filter: true },
    { headerName: "Amount", field: "amount", sortable: true, filter: true },
    { headerName: "Category", field: "category", sortable: true, filter: true },
    { headerName: "Date", field: "date", sortable: true, filter: true },
    { headerName: "Notes", field: "notes", sortable: true, filter: true },
  ];

  const pieData = useMemo(() =>
    categories.map((category) => ({
      name: category.name, 
      value: transactions
        .filter((transaction) => transaction.category === category.name)
        .reduce((acc, curr) => acc + curr.amount, 0),
    })),
    [categories, transactions]
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

  const handleExport = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv();
    }
  };

  return (
    <Box display="flex" minHeight="200vh">
      <Box
        sx={{
          backgroundImage:"url('/images/dash.jpg')", backgroundSize:"cover", backgroundPosition:"left",
          color: "white",
          width: "16rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            padding: "1rem",
            fontSize: "2rem",
            fontWeight: "bold",
            borderBottom: "1px solid #374151",
            backgroundImage:"url('/images/currencydash.jpg')", backgroundSize:"cover", backgroundPosition:"left"
          }}
        >
          Dashboard
        </Box>
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
      </Box>

      {/* Main Content */}
      <Box flex={1} padding="1.5rem">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <Typography variant="h4" sx={{fontFamily: "Times new Roman", fontSize:"2 rem"}}>Table View</Typography>
          <Box display="flex" gap="0.5rem">
            
            <Button variant="contained" color="primary" startIcon={<Download />} onClick={handleExport}> Export as CSV </Button>
          </Box>
        </Box>
        <Divider sx={{ marginBottom: "1rem" }} />
        {isClient && (
          <div style={{ height: "20%", width: "94%" }}>
            <AgGridReact
              rowData={transactions}
              columnDefs={columnDefs}
              defaultColDef={{ sortable: true, filter: true, resizable: true }}
              onGridReady={(params) => setGridApi(params.api)}
            />
          </div>
        )}
        <br />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <Typography variant="h4" sx={{fontFamily: "Times new Roman", fontSize: "2 rem" }}>Pie Chart</Typography>
        </Box>
        <Divider sx={{ marginBottom: "1rem" }} />
        {isClient && (
          <PieChart width={300} height={300}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </Box>
    </Box>
  );
}
