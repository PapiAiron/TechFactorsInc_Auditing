import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { ScanSession } from "../types";

export const useScanSession = () => {
  const writeScanSession = async (data: Omit<ScanSession, "id" | "scannedAt">) => {
    try {
      return await addDoc(collection(db, "scanSessions"), {
        ...data,
        scannedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to write scan session:", err);
      throw err;
    }
  };

  return { writeScanSession };
};
