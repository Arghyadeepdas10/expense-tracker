import { supabase } from "@/utils/supabase/supabaseClient";
import { useQuery } from "@tanstack/react-query";

interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: number;
  date: string;
  notes: string;
  name: string;
}

const fetchTransactions = async (userId: string): Promise<Transaction[]> => {
  if (!userId) {
    throw new Error("User ID is required to fetch transactions.");
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId); 

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const useFetchTransactions = (user: { id: string }) => {
  return useQuery({
    queryKey: ["transactions", user?.id], 
    queryFn: () => fetchTransactions(user.id),
  });
};
