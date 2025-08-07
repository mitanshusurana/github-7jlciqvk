import React, { useState } from 'react';
import { AnyProduct } from '../../../types';

interface AdditionalInfoTabsProps {
  product: AnyProduct;
}

const AdditionalInfoTabs: React.FC<AdditionalInfoTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState('ecommerce');

  const tabs = [
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'integration', label: 'System Integration' },
    { id: 'compliance', label: 'Audit & Compliance' },
  ];

  return (
    <div className="card mt-8">
      <div className="border-b border-neutral-200">
        <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">
        {activeTab === 'ecommerce' && (
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-semibold">SEO Title:</span> {product.seoTitle}</div>
            <div><span className="font-semibold">SEO Description:</span> {product.seoDescription}</div>
            <div><span className="font-semibold">Tags:</span> {product.tags.join(', ')}</div>
            <div><span className="font-semibold">Category Hierarchy:</span> {product.categoryHierarchy}</div>
          </div>
        )}
        {activeTab === 'integration' && (
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-semibold">Shopify ID:</span> {product.platformIds.shopifyId}</div>
            <div><span className="font-semibold">Etsy ID:</span> {product.platformIds.etsyId}</div>
            <div><span className="font-semibold">eBay ID:</span> {product.platformIds.ebayId}</div>
            <div><span className="font-semibold">Amazon ID:</span> {product.platformIds.amazonId}</div>
            <div><span className="font-semibold">Google Shopping ID:</span> {product.platformIds.googleShoppingId}</div>
          </div>
        )}
        {activeTab === 'compliance' && (
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-semibold">Insurance Value:</span> {product.insuranceValue}</div>
            <div><span className="font-semibold">Appraisal Date:</span> {product.appraisalDate}</div>
            <div><span className="font-semibold">Tax Category:</span> {product.taxCategory}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalInfoTabs;
