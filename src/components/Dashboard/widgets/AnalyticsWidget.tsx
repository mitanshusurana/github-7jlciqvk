import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnalyticsWidget: React.FC = () => {
  return (
    <Link to="/analytics" className="card p-6 hover:bg-success-50 transition-colors">
      <div className="flex items-center">
        <div className="rounded-full bg-success-100 p-3 mr-4">
          <BarChart3 className="h-6 w-6 text-success-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Analytics</h3>
          <p className="text-sm text-neutral-500">View your collection's statistics</p>
        </div>
      </div>
    </Link>
  );
};

export default AnalyticsWidget;
