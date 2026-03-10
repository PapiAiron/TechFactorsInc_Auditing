import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Alert } from "../types";

const COLLECTION_NAME = "alerts";

export const alertService = {
  async addAlert(alert: Omit<Alert, "id" | "createdAt" | "resolved">) {
    try {
      return await addDoc(collection(db, COLLECTION_NAME), {
        ...alert,
        resolved: false,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to add alert:", err);
      throw err;
    }
  },

  async resolveAlert(id: string) {
    try {
      const alertRef = doc(db, COLLECTION_NAME, id);
      return await updateDoc(alertRef, {
        resolved: true,
      });
    } catch (err) {
      console.error("Failed to resolve alert:", err);
      throw err;
    }
  },

  async deleteAlert(id: string) {
    try {
      const alertRef = doc(db, COLLECTION_NAME, id);
      return await deleteDoc(alertRef);
    } catch (err) {
      console.error("Failed to delete alert:", err);
      throw err;
    }
  }
};
