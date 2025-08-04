import React from 'react';
import { Gemstone } from '../../../types';

interface AuthenticitySectionProps {
  gemstone: Gemstone;
}

const DetailItem: React.FC<{ label: string; value?: string | number | React.ReactNode }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="text-base font-medium text-neutral-900">{value}</p>
    </div>
  );
};

const AuthenticitySection: React.FC<AuthenticitySectionProps> = ({ gemstone }) => {
  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Certifications & Authenticity</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <DetailItem label="Origin" value={gemstone.origin} />
        <DetailItem label="Treatment" value={gemstone.treatment} />
        <DetailItem label="Treatment Details" value={gemstone.treatmentDetails} />
        <DetailItem label="Certification No." value={gemstone.certification} />
        <DetailItem
          label="Lab Certificate"
          value={
            gemstone.certificationUpload ? (
              <a href={gemstone.certificationUpload} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                View Certificate
              </a>
            ) : 'Not available'
          }
        />
        <DetailItem label="Warranty" value={gemstone.warrantyInfo} />
      </div>
    </div>
  );
};

export default AuthenticitySection;
