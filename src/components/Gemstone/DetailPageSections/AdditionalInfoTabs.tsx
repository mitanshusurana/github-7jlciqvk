import React, { useState } from 'react';
import { Gemstone } from '../../../types';

interface AdditionalInfoTabsProps {
  gemstone: Gemstone;
}

const AdditionalInfoTabs: React.FC<AdditionalInfoTabsProps> = ({ gemstone }) => {
  const [activeTab, setActiveTab] = useState('care');

  const tabs = [
    { id: 'care', label: 'Care Instructions', content: gemstone.careInstructions },
    { id: 'returns', label: 'Returns', content: gemstone.returnPolicy },
    { id: 'delivery', label: 'Delivery', content: gemstone.deliveryTimeEstimate },
    { id: 'inTheBox', label: 'In the Box', content: gemstone.inTheBox?.join(', ') },
    { id: 'zodiac', label: 'Zodiac Relevance', content: gemstone.zodiacRelevance },
  ].filter(tab => tab.content); // Only show tabs with content

  if (tabs.length === 0) {
    return null;
  }

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
        {tabs.map((tab) => (
          <div key={tab.id} className={activeTab === tab.id ? '' : 'hidden'}>
            <p className="text-neutral-700 whitespace-pre-wrap">{tab.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalInfoTabs;
