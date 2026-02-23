import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { ingredientService } from '../services/ingredientService';
import type { Product, Ingredient, RecipeItem } from '../types';
import { Plus, Trash2, X, ChefHat } from 'lucide-react';

export const Recipes: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    ingredients: []
  });

  useEffect(() => {
    const unsubProducts = productService.subscribeProducts(setProducts);
    const unsubIngredients = ingredientService.subscribeIngredients(setIngredients);
    return () => {
      unsubProducts();
      unsubIngredients();
    };
  }, []);

  const handleAddIngredientToRecipe = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { ingredientId: '', quantity: 0 }]
    });
  };

  const handleRemoveIngredientFromRecipe = (index: number) => {
    const newIngredients = [...formData.ingredients];
    newIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleIngredientChange = (index: number, field: keyof RecipeItem, value: string | number) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.ingredients.length === 0) {
      alert('Adicione pelo menos um insumo à ficha técnica');
      return;
    }
    try {
      await productService.addProduct(formData);
      setFormData({ name: '', price: 0, ingredients: [] });
      setShowAddForm(false);
    } catch (error) {
      alert('Erro ao salvar produto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Deseja excluir este produto?')) {
      await productService.deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gerenciar Produtos</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-600 text-white p-2 rounded-full shadow-lg"
        >
          {showAddForm ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Produto (Lanche)</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: X-Bacon"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preço de Venda (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.price}
              onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Ficha Técnica (Insumos)</label>
              <button
                type="button"
                onClick={handleAddIngredientToRecipe}
                className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-300"
              >
                + Insumo
              </button>
            </div>
            {formData.ingredients.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <select
                  required
                  className="flex-1 border border-gray-300 rounded-md p-1 text-sm"
                  value={item.ingredientId}
                  onChange={e => handleIngredientChange(index, 'ingredientId', e.target.value)}
                >
                  <option value="">Selecionar...</option>
                  {ingredients.map(ing => (
                    <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Qtd"
                  className="w-20 border border-gray-300 rounded-md p-1 text-sm"
                  value={item.quantity}
                  onChange={e => handleIngredientChange(index, 'quantity', parseFloat(e.target.value))}
                />
                <button type="button" onClick={() => handleRemoveIngredientFromRecipe(index)} className="text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded-md font-semibold">
            Salvar Produto
          </button>
        </form>
      )}

      <div className="grid gap-3">
        {products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-orange-600 font-semibold">R$ {product.price.toFixed(2)}</p>
              </div>
              <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 p-1">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <p className="font-medium mb-1 flex items-center gap-1"><ChefHat size={12}/> Insumos:</p>
              <ul className="list-disc list-inside">
                {product.ingredients.map((item, idx) => {
                  const ing = ingredients.find(i => i.id === item.ingredientId);
                  return (
                    <li key={idx}>
                      {item.quantity} {ing?.unit} de {ing?.name || 'Insumo removido'}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
        {products.length === 0 && !showAddForm && (
          <p className="text-center text-gray-500 py-10">Nenhum produto cadastrado.</p>
        )}
      </div>
    </div>
  );
};
