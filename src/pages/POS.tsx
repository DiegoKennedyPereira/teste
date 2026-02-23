import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { saleService } from '../services/saleService';
import type { Product } from '../types';
import { ShoppingCart, CheckCircle2, AlertCircle } from 'lucide-react';

export const POS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const unsubscribe = productService.subscribeProducts(setProducts);
    return () => unsubscribe();
  }, []);

  const handleSale = async (product: Product) => {
    if (loading) return;
    setLoading(true);
    setMessage(null);

    try {
      await saleService.recordSale(product);
      setMessage({ text: `Venda de ${product.name} realizada!`, type: 'success' });
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ text: error.message || 'Erro ao processar venda', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Ponto de Venda</h2>
        <ShoppingCart className="text-orange-600" />
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {products.map(product => (
          <button
            key={product.id}
            onClick={() => handleSale(product)}
            disabled={loading}
            className="bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent active:border-orange-500 active:bg-orange-50 flex flex-col items-center justify-center gap-2 transition-all h-32 text-center disabled:opacity-50"
          >
            <span className="text-lg font-bold text-gray-800">{product.name}</span>
            <span className="text-orange-600 font-bold">R$ {product.price.toFixed(2)}</span>
          </button>
        ))}
        {products.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            Cadastre produtos na aba "Produtos" para começar a vender.
          </p>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
            <span className="font-medium">Processando...</span>
          </div>
        </div>
      )}
    </div>
  );
};
