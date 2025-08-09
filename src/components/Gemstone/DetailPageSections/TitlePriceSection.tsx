import React from 'react';
import { AnyProduct } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

interface TitlePriceSectionProps {
  product: AnyProduct;
}

const TitlePriceSection: React.FC<TitlePriceSectionProps> = ({ product }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>
      <p className="text-lg text-neutral-600 mt-2">{product.description}</p>

      <div className="mt-4 flex items-baseline gap-4">
        <span className="text-3xl font-bold text-primary-600">
          {formatCurrency(product.price)}
        </span>
        <span className="text-sm font-semibold text-neutral-500">
          (Markup: {product.markup}x)
        </span>
      </div>
    </div>
  );
};

export default TitlePriceSection;
