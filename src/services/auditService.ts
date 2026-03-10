import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase/config";
import { AuditLog } from "../types";

const COLLECTION_NAME = "auditLogs";

export const auditService = {
  async addAuditLog(log: Omit<AuditLog, "id" | "startedAt">) {
    try {
      return await addDoc(collection(db, COLLECTION_NAME), {
        ...log,
        startedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to add audit log:", err);
      throw err;
    }
  },

  async updateAuditLog(id: string, log: Partial<AuditLog>) {
    try {
      const logRef = doc(db, COLLECTION_NAME, id);
      return await updateDoc(logRef, log);
    } catch (err) {
      console.error("Failed to update audit log:", err);
      throw err;
    }
  },

  async deleteAuditLog(id: string) {
    try {
      const logRef = doc(db, COLLECTION_NAME, id);
      return await deleteDoc(logRef);
    } catch (err) {
      console.error("Failed to delete audit log:", err);
      throw err;
    }
  },

  async completeAudit(id: string, duration: string, itemsScanned: number) {
    try {
      const logRef = doc(db, COLLECTION_NAME, id);
      return await updateDoc(logRef, {
        status: "completed",
        duration,
        itemsScanned
      });
    } catch (err) {
      console.error("Failed to complete audit:", err);
      throw err;
    }
  }
};
