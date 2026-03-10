import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase/config";
import { User } from "../types";

const COLLECTION_NAME = "users";

export const userService = {
  async createUser(user: Omit<User, "createdAt">) {
    const userRef = doc(db, COLLECTION_NAME, user.id);
    return setDoc(userRef, {
      ...user,
      createdAt: serverTimestamp(),
    });
  },

  async updateUser(id: string, user: Partial<User>) {
    const userRef = doc(db, COLLECTION_NAME, id);
    return updateDoc(userRef, user);
  },

  async deleteUser(id: string) {
    const userRef = doc(db, COLLECTION_NAME, id);
    return deleteDoc(userRef);
  },

  async updateStatus(id: string, status: User["onlineStatus"]) {
    const userRef = doc(db, COLLECTION_NAME, id);
    return updateDoc(userRef, { onlineStatus: status });
  }
};
