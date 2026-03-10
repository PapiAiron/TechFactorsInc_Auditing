import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { db } from "../firebase/config";
import { ServerRoom } from "../types";

const COLLECTION_NAME = "serverRooms";

export const serverRoomService = {
  async addServerRoom(room: Omit<ServerRoom, "id">) {
    return addDoc(collection(db, COLLECTION_NAME), room);
  },

  async updateServerRoom(id: string, room: Partial<ServerRoom>) {
    const roomRef = doc(db, COLLECTION_NAME, id);
    return updateDoc(roomRef, room);
  },

  async deleteServerRoom(id: string) {
    const roomRef = doc(db, COLLECTION_NAME, id);
    return deleteDoc(roomRef);
  }
};
