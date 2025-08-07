import React, { useState } from 'react';
import { AnyProduct, Movement } from '../../../types';
import MovementHistory from '../../Movement/MovementHistory';
import MovementForm from '../../Movement/MovementForm';
import { useAuth } from '../../../hooks/useAuth';

interface AdditionalInfoTabsProps {
  product: AnyProduct;
}

const mockMovements: Movement[] = [
  { id: '1', productId: '1', fromLocation: 'Vault A', toLocation: 'Showcase 1', date: new Date().toISOString(), userId: '1' },
  { id: '2', productId: '1', fromLocation: 'Showcase 1', toLocation: 'Vault B', date: new Date().toISOString(), userId: '2' },
];

const AdditionalInfoTabs: React.FC<AdditionalInfoTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState('ecommerce');
  const { user } = useAuth();
  const [movements, setMovements] = useState<Movement[]>(mockMovements);

  const tabs = [
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'integration', label: 'System Integration' },
    { id: 'compliance', label: 'Audit & Compliance' },
    { id: 'movement', label: 'Movement History' },
  ];

  const handleMovementSubmit = (values: Omit<Movement, 'id' | 'userId'>) => {
    if (user) {
      const newMovement: Movement = {
        ...values,
        id: (movements.length + 1).toString(),
        userId: user.id,
      };
      setMovements([...movements, newMovement]);
    }
  };

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
        {activeTab === 'movement' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">Record New Movement</h4>
            <MovementForm productId={product.id} onSubmit={handleMovementSubmit} />
            <hr className="my-6" />
            <h4 className="text-lg font-semibold mb-4">Movement History</h4>
            <MovementHistory movements={movements} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalInfoTabs;
