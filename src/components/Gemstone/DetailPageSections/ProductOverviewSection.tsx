import React from 'react';
import { AnyProduct } from '../../../types';

interface ProductOverviewSectionProps {
  product: AnyProduct;
}

const DetailItem: React.FC<{ label: string; value?: string | number | boolean }> = ({ label, value }) => {
  if (value === undefined || value === null || value === '') return null;

  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;

  return (
    <div>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="text-base font-medium text-neutral-900">{displayValue}</p>
    </div>
  );
};

const ProductOverviewSection: React.FC<ProductOverviewSectionProps> = ({ product }) => {
  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Product Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <DetailItem label="SKU" value={product.id} />
        <DetailItem label="Condition" value={product.condition} />
        <DetailItem label="Reservation Status" value={product.reservationStatus} />

        {product.productType === 'LooseStone' && (
          <>
            <DetailItem label="Gemstone Type" value={product.gemstoneType} />
            <DetailItem label="Variety" value={product.variety} />
            <DetailItem label="Origin" value={product.origin} />
            <DetailItem label="Creation Method" value={product.creationMethod} />
            <DetailItem label="Carat Weight" value={product.caratWeight} />
            <DetailItem label="Shape" value={product.shape} />
          </>
        )}

        {product.productType === 'CarvedIdol' && (
          <>
            <DetailItem label="Material" value={product.material} />
            <DetailItem label="Deity/Figure" value={product.deityFigure} />
            <DetailItem label="Origin" value={product.origin} />
            <DetailItem label="Weight" value={product.weight} />
          </>
        )}

        {product.productType === 'Jewelry' && (
          <>
            <DetailItem label="Category" value={product.category} />
            <DetailItem label="Style" value={product.style} />
            <DetailItem label="Metal" value={product.metal} />
            <DetailItem label="Metal Weight" value={product.metalWeight} />
            <DetailItem label="Ring Size" value={product.ringSize} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductOverviewSection;
