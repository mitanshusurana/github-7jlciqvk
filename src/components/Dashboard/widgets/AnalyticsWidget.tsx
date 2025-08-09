import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnalyticsWidget: React.FC = () => {
  return (
    <div className="card p-6 flex items-center">
      <div className="rounded-full bg-success-100 p-3 mr-4">
        <BarChart3 className="h-6 w-6 text-success-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-500">Analytics</p>
        <p className="text-2xl font-semibold text-neutral-900">8</p>
        <Link to="/analytics" className="text-xs text-success-600 hover:text-success-700 transition-colors">
          View analytics →
        </Link>
      </div>
    </div>
  );
};

export default AnalyticsWidget;
