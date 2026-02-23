export type Ingredient = {
  id: string;
  name: string;
  unit: 'kg' | 'g' | 'unit' | 'package' | 'liter' | 'ml';
  currentQuantity: number;
};

export type RecipeItem = {
  ingredientId: string;
  quantity: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  ingredients: RecipeItem[];
};

export type Sale = {
  id: string;
  productId: string;
  productName: string;
  totalPrice: number;
  timestamp: Date;
};
