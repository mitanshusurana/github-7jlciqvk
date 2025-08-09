import React from 'react';
import { ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReportsWidget: React.FC = () => {
  return (
    <div className="card p-6 flex items-center">
      <div className="rounded-full bg-accent-100 p-3 mr-4">
        <ClipboardList className="h-6 w-6 text-accent-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-500">Reports</p>
        <p className="text-2xl font-semibold text-neutral-900">12</p>
        <Link to="/reports" className="text-xs text-accent-600 hover:text-accent-700 transition-colors">
          View reports →
        </Link>
      </div>
    </div>
  );
};

export default ReportsWidget;
