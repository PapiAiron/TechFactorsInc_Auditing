import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Settings } from "../types";

const COLLECTION_NAME = "settings";
const DOCUMENT_ID = "global";

export const settingsService = {
  async getSettings(): Promise<Settings | null> {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Settings;
    }
    return null;
  },

  async updateSettings(settings: Partial<Settings>) {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    return setDoc(docRef, settings, { merge: true });
  },

  async initializeSettings(settings: Settings) {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    return setDoc(docRef, settings);
  }
};
