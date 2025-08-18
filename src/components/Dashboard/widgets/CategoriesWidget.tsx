import React from 'react';
import { Package } from 'lucide-react';

interface CategoriesWidgetProps {
  categories: string[];
}

const CategoriesWidget: React.FC<CategoriesWidgetProps> = ({ categories }) => {
  return (
    <div className="card p-6 flex items-center">
      <div className="rounded-full bg-secondary-100 p-3 mr-4">
        <Package className="h-6 w-6 text-secondary-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-500">Categories</p>
        <p className="text-2xl font-semibold text-neutral-900">{categories.length}</p>
      </div>
    </div>
  );
};

export default CategoriesWidget;
