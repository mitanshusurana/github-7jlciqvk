import React from 'react';
import { Diamond } from 'lucide-react';
import useProducts from '../../../hooks/useProducts';

const TotalProductsWidget: React.FC = () => {
  const { products = { content: [] }, loading } = useProducts();

  return (
    <div className="card p-6 flex items-center">
      <div className="rounded-full bg-primary-100 p-3 mr-4">
        <Diamond className="h-6 w-6 text-primary-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-500">Total Products</p>
        <p className="text-2xl font-semibold text-neutral-900">{loading ? '...' : (products.content ?? []).length}</p>
      </div>
    </div>
  );
};

export default TotalProductsWidget;
