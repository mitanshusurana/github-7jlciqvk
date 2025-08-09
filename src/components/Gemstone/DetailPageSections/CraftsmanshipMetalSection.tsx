import React from 'react';
import { AnyProduct } from '../../../types';

interface CraftsmanshipMetalSectionProps {
  product: AnyProduct;
}

const DetailItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="text-base font-medium text-neutral-900">{value}</p>
    </div>
  );
};

const CraftsmanshipMetalSection: React.FC<CraftsmanshipMetalSectionProps> = ({ product }) => {
  if (product.productType !== 'Jewelry') {
    return null;
  }

  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Craftsmanship & Metal</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <DetailItem label="Metal" value={product.metal} />
        <DetailItem label="Metal Purity" value={product.metalPurity} />
        <DetailItem label="Metal Weight" value={product.metalWeight} />
        <DetailItem label="Metal Color" value={product.metalColor} />
        <DetailItem label="Hallmark" value={product.hallmark} />
        <DetailItem label="Plating" value={product.plating} />
        <DetailItem label="Warranty" value={product.warranty} />
        <DetailItem label="Labor Cost" value={product.laborCost} />
      </div>
    </div>
  );
};

export default CraftsmanshipMetalSection;
