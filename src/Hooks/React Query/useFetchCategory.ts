import { supabase } from "@/utils/supabase/supabaseClient";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
}

const fetchCategories = async (userId: string): Promise<Category[]> => {
  if (!userId) {
    throw new Error("User ID is required to fetch categories.");
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("category")
    .eq("user_id", userId); 

  if (error) {
    throw new Error(error.message);
  }

  const uniqueCategories = data ? Array.from(new Set(data.map((item: any) => item.category))).map((category) => ({ id: category, name: category })): [];
  console.log("Unique categories:", uniqueCategories);

  return uniqueCategories;
};

export const useFetchCategories = (user: { id: string }) => {
  return useQuery<Category[]>({
    queryKey: ["categories", user?.id],
    queryFn: () => fetchCategories(user.id),
  });
  
};
