import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Product } from '../types';

const COLLECTION_NAME = 'products';

export const productService = {
  async addProduct(product: Omit<Product, 'id'>) {
    return await addDoc(collection(db, COLLECTION_NAME), product);
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    return await updateDoc(docRef, product);
  },

  async deleteProduct(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    return await deleteDoc(docRef);
  },

  async getProducts() {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },

  subscribeProducts(callback: (products: Product[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      callback(products);
    });
  }
};
