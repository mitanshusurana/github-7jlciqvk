import React from 'react';
import { AnyProduct } from '../../../types';

interface AuthenticitySectionProps {
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

const AuthenticitySection: React.FC<AuthenticitySectionProps> = ({ product }) => {
  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Certifications & Authenticity</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {product.productType === 'LooseStone' && (
          <>
            <DetailItem label="Origin" value={product.origin} />
            <DetailItem label="Certification ID" value={product.certificationId} />
          </>
        )}
        {product.productType === 'CarvedIdol' && (
          <DetailItem label="Origin" value={product.origin} />
        )}
        <DetailItem label="Appraisal Date" value={product.appraisalDate} />
        <DetailItem label="Insurance Value" value={product.insuranceValue} />
      </div>
    </div>
  );
};

export default AuthenticitySection;
