import {
  collection,
  getDocs,
  query,
  orderBy,
  runTransaction,
  doc,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Sale, Product } from '../types';

const SALES_COLLECTION = 'sales';
const INGREDIENTS_COLLECTION = 'ingredients';

export const saleService = {
  async recordSale(product: Product) {
    try {
      await runTransaction(db, async (transaction) => {
        // 1. Get all necessary ingredients
        const ingredientRefs = product.ingredients.map(item =>
          doc(db, INGREDIENTS_COLLECTION, item.ingredientId)
        );

        const ingredientSnaps = await Promise.all(
          ingredientRefs.map(ref => transaction.get(ref))
        );

        // 2. Check stock
        for (let i = 0; i < product.ingredients.length; i++) {
          const item = product.ingredients[i];
          const snap = ingredientSnaps[i];

          if (!snap.exists()) {
            throw new Error(`Ingredient ${item.ingredientId} not found`);
          }

          const currentQty = snap.data().currentQuantity;
          if (currentQty < item.quantity) {
            throw new Error(`Estoque insuficiente: ${snap.data().name}`);
          }
        }

        // 3. Deduct stock
        product.ingredients.forEach((item, index) => {
          const snap = ingredientSnaps[index];
          const data = snap.data();
          if (data) {
            const newQty = data.currentQuantity - item.quantity;
            transaction.update(ingredientRefs[index], { currentQuantity: newQty });
          }
        });

        // 4. Record sale
        const saleData = {
          productId: product.id,
          productName: product.name,
          totalPrice: product.price,
          timestamp: Timestamp.now()
        };
        const saleRef = doc(collection(db, SALES_COLLECTION));
        transaction.set(saleRef, saleData);
      });
    } catch (error) {
      console.error("Sale transaction failed: ", error);
      throw error;
    }
  },

  async getTodaySales() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, SALES_COLLECTION),
      where('timestamp', '>=', Timestamp.fromDate(today)),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toDate()
      } as Sale;
    });
  }
};
