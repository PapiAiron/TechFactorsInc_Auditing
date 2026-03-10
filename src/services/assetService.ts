import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Asset } from "../types";

const COLLECTION_NAME = "assets";

export const assetService = {
  async addAsset(asset: Omit<Asset, "id" | "createdAt" | "updatedAt">) {
    try {
      return await addDoc(collection(db, COLLECTION_NAME), {
        ...asset,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to add asset:", err);
      throw err;
    }
  },

  async updateAsset(id: string, asset: Partial<Asset>) {
    try {
      const assetRef = doc(db, COLLECTION_NAME, id);
      return await updateDoc(assetRef, {
        ...asset,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to update asset:", err);
      throw err;
    }
  },

  async deleteAsset(id: string) {
    try {
      const assetRef = doc(db, COLLECTION_NAME, id);
      return await deleteDoc(assetRef);
    } catch (err) {
      console.error("Failed to delete asset:", err);
      throw err;
    }
  },

  async markAsAudited(id: string) {
    try {
      const assetRef = doc(db, COLLECTION_NAME, id);
      return await updateDoc(assetRef, {
        lastAuditDate: Timestamp.now(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to mark as audited:", err);
      throw err;
    }
  }
};
