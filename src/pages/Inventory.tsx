import React, { useState, useEffect } from 'react';
import { ingredientService } from '../services/ingredientService';
import type { Ingredient } from '../types';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

export const Inventory: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Ingredient, 'id'>>({
    name: '',
    unit: 'unit',
    currentQuantity: 0
  });

  useEffect(() => {
    const unsubscribe = ingredientService.subscribeIngredients(setIngredients);
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ingredientService.addIngredient(formData);
      setFormData({ name: '', unit: 'unit', currentQuantity: 0 });
      setShowAddForm(false);
    } catch (error) {
      alert('Erro ao adicionar insumo');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este insumo?')) {
      await ingredientService.deleteIngredient(id);
    }
  };

  const handleUpdate = async (id: string, updatedData: Partial<Ingredient>) => {
    await ingredientService.updateIngredient(id, updatedData);
    setIsEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Estoque de Insumos</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-600 text-white p-2 rounded-full shadow-lg"
        >
          {showAddForm ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Insumo</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Pão de Hamburguer"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Unidade</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value as any})}
              >
                <option value="unit">Unidade</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="package">Pacote</option>
                <option value="liter">Litro</option>
                <option value="ml">ml</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Qtd Atual</label>
              <input
                type="number"
                step="0.01"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={formData.currentQuantity}
                onChange={e => setFormData({...formData, currentQuantity: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded-md font-semibold">
            Salvar Insumo
          </button>
        </form>
      )}

      <div className="grid gap-3">
        {ingredients.map(ing => (
          <div key={ing.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
            {isEditing === ing.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  className="w-20 border border-gray-300 rounded-md p-1"
                  defaultValue={ing.currentQuantity}
                  onBlur={(e) => handleUpdate(ing.id, { currentQuantity: parseFloat(e.target.value) })}
                  autoFocus
                />
                <span className="self-center">{ing.unit}</span>
              </div>
            ) : (
              <div className="flex-1">
                <h3 className="font-semibold">{ing.name}</h3>
                <p className="text-sm text-gray-500">
                  {ing.currentQuantity} {ing.unit}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(isEditing === ing.id ? null : ing.id)}
                className="p-2 text-blue-600"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(ing.id)}
                className="p-2 text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {ingredients.length === 0 && !showAddForm && (
          <p className="text-center text-gray-500 py-10">Nenhum insumo cadastrado.</p>
        )}
      </div>
    </div>
  );
};
