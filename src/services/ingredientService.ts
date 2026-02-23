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
import type { Ingredient } from '../types';

const COLLECTION_NAME = 'ingredients';

export const ingredientService = {
  async addIngredient(ingredient: Omit<Ingredient, 'id'>) {
    return await addDoc(collection(db, COLLECTION_NAME), ingredient);
  },

  async updateIngredient(id: string, ingredient: Partial<Ingredient>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    return await updateDoc(docRef, ingredient);
  },

  async deleteIngredient(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    return await deleteDoc(docRef);
  },

  async getIngredients() {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ingredient));
  },

  subscribeIngredients(callback: (ingredients: Ingredient[]) => void) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    return onSnapshot(q, (snapshot) => {
      const ingredients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ingredient));
      callback(ingredients);
    });
  }
};
