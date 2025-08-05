import React from 'react';
import { Gemstone } from '../../../types';
import { formatWeight } from '../../../utils/formatters';

interface ProductOverviewSectionProps {
  gemstone: Gemstone;
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

const ProductOverviewSection: React.FC<ProductOverviewSectionProps> = ({ gemstone }) => {
  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Product Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <DetailItem label="SKU" value={gemstone.sku} />
        <DetailItem label="Shape" value={gemstone.shape} />
        <DetailItem label="Weight" value={formatWeight(gemstone.weight)} />
        <DetailItem label="Stone Count" value={gemstone.stoneCount} />
        <DetailItem label="Color" value={gemstone.color} />
        <DetailItem label="Clarity" value={gemstone.clarity} />
        <DetailItem label="Cut" value={gemstone.cut} />
        <DetailItem label="Ring Size" value={gemstone.ringSize} />
      </div>
    </div>
  );
};

export default ProductOverviewSection;
