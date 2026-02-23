import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Package, Utensils, LayoutDashboard } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export const Layout: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'PDV' },
    { to: '/inventory', icon: Package, label: 'Estoque' },
    { to: '/recipes', icon: Utensils, label: 'Produtos' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Painel' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-orange-600 text-white p-4 shadow-md sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center">Food Truck Manager</h1>
      </header>

      <main className="max-w-md mx-auto p-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-10">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-orange-600" : "text-gray-500"
              )
            }
          >
            <item.icon size={24} />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
