import React from 'react';
import { Gemstone } from '../../../types';

interface CraftsmanshipMetalSectionProps {
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

const CraftsmanshipMetalSection: React.FC<CraftsmanshipMetalSectionProps> = ({ gemstone }) => {
  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Craftsmanship & Metal</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <DetailItem label="Material" value={gemstone.materialComposition} />
        <DetailItem label="Design Type" value={gemstone.designType} />
        <DetailItem label="Lustre" value={gemstone.lustre} />
        <DetailItem label="Transparency" value={gemstone.transparency} />
        <DetailItem label="Craftsmanship" value={gemstone.craftsmanshipDetail} />
        <DetailItem label="Artisan/Workshop" value={gemstone.artisanOrWorkshop} />
      </div>
    </div>
  );
};

export default CraftsmanshipMetalSection;
