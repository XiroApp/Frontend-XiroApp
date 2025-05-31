import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore/lite";
import { db } from "../../config/firebase";

const TABLE = collection(db, "products");

export class LibraryService {
  static async getProducts() {
    try {
      const query = await getDocs(TABLE);
      const data = query.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return data;
    } catch (err) {
      console.error(`catch 'getProducts' ${err.message}`);
      return [];
    }
  }

  static async deleteProduct(prodId) {
    await deleteDoc(doc(TABLE, prodId));
  }

  static async manageProduct(product) {
    await setDoc(doc(TABLE, product.id), product);
  }
}
