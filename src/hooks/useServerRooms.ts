import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { ServerRoom } from "../types";

export const useServerRooms = () => {
  const [rooms, setRooms] = useState<ServerRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "serverRooms"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServerRoom));
      setRooms(data);
      setLoading(false);
    }, (err) => {
      console.error("Server rooms fetch failed:", err);
      setError(err.message);
      setLoading(false);
      setRooms([]);
    });

    return () => unsubscribe();
  }, []);

  return { rooms, loading, error };
};
