import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { User } from "../types";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(data);
      setLoading(false);
    }, (err) => {
      console.error("Users fetch failed:", err);
      setError(err.message);
      setLoading(false);
      // If permission denied, we might be an Auditor who can't see all users
      // We'll just show an empty list or handle it in the UI
      setUsers([]);
    });

    return () => unsubscribe();
  }, []);

  return { users, loading, error };
};
