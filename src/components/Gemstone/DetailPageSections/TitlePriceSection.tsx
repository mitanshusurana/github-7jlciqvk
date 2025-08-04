import React from 'react';
import { Gemstone } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

interface TitlePriceSectionProps {
  gemstone: Gemstone;
}

const TitlePriceSection: React.FC<TitlePriceSectionProps> = ({ gemstone }) => {
  const hasPrice = gemstone.mrp !== undefined || gemstone.sellingPrice !== undefined;
  const discount = gemstone.mrp && gemstone.sellingPrice && gemstone.mrp > gemstone.sellingPrice
    ? Math.round(((gemstone.mrp - gemstone.sellingPrice) / gemstone.mrp) * 100)
    : 0;

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-neutral-900">{gemstone.name}</h1>
      {gemstone.shortDescription && (
        <p className="text-lg text-neutral-600 mt-2">{gemstone.shortDescription}</p>
      )}

      {hasPrice && (
        <div className="mt-4 flex items-baseline gap-4">
          {gemstone.sellingPrice !== undefined && (
            <span className="text-3xl font-bold text-primary-600">
              {formatCurrency(gemstone.sellingPrice)}
            </span>
          )}
          {gemstone.mrp !== undefined && gemstone.sellingPrice !== gemstone.mrp && (
            <span className="text-xl text-neutral-500 line-through">
              {formatCurrency(gemstone.mrp)}
            </span>
          )}
          {gemstone.discountLabel && (
             <span className="text-sm font-semibold text-success-600 bg-success-100 px-2 py-1 rounded">
              {gemstone.discountLabel}
            </span>
          )}
          {!gemstone.discountLabel && discount > 0 && (
            <span className="text-sm font-semibold text-success-600 bg-success-100 px-2 py-1 rounded">
              {discount}% OFF
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TitlePriceSection;
