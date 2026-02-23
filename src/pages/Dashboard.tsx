import React, { useState, useEffect } from 'react';
import { saleService } from '../services/saleService';
import type { Sale } from '../types';
import { TrendingUp, History } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const todaySales = await saleService.getTodaySales();
        setSales(todaySales);
      } catch (error) {
        console.error("Failed to fetch sales", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalPrice, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Painel de Vendas</h2>
        <TrendingUp className="text-orange-600" />
      </div>

      <div className="bg-orange-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center space-y-2">
        <span className="text-sm opacity-80 uppercase tracking-wider font-semibold">Vendas de Hoje</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">R$</span>
          <span className="text-4xl font-extrabold">{totalRevenue.toFixed(2)}</span>
        </div>
        <span className="text-sm bg-orange-700 px-3 py-1 rounded-full">
          {sales.length} pedido(s)
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
          <History size={18} />
          <h3>Histórico Recente</h3>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Carregando...</p>
        ) : (
          <div className="grid gap-3">
            {sales.map(sale => (
              <div key={sale.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{sale.productName}</h4>
                  <p className="text-xs text-gray-500">
                    {sale.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-800">R$ {sale.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}
            {sales.length === 0 && (
              <p className="text-center text-gray-500 py-10">Nenhuma venda realizada hoje.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
