import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { Asset, AssetCategory, AssetStatus } from "../types";

export const useAssets = (filters?: { category?: AssetCategory | "All", status?: AssetStatus | "All", searchQuery?: string }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "assets"), orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Asset));
      
      if (filters) {
        if (filters.category && filters.category !== "All") {
          data = data.filter(a => a.category === filters.category);
        }
        if (filters.status && filters.status !== "All") {
          data = data.filter(a => a.status === filters.status);
        }
        if (filters.searchQuery) {
          const search = filters.searchQuery.toLowerCase();
          data = data.filter(a => 
            a.name.toLowerCase().includes(search) || 
            a.tag.toLowerCase().includes(search) ||
            a.category.toLowerCase().includes(search)
          );
        }
      }

      setAssets(data);
      setLoading(false);
    }, (err) => {
      console.error("Assets fetch failed:", err);
      setError(err.message);
      setLoading(false);
      setAssets([]);
    });

    return () => unsubscribe();
  }, [filters?.category, filters?.status, filters?.searchQuery]);

  return { assets, loading, error };
};
