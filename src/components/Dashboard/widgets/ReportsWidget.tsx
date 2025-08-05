import React from 'react';
import { ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReportsWidget: React.FC = () => {
  return (
    <Link to="/reports" className="card p-6 hover:bg-accent-50 transition-colors">
      <div className="flex items-center">
        <div className="rounded-full bg-accent-100 p-3 mr-4">
          <ClipboardList className="h-6 w-6 text-accent-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Reports</h3>
          <p className="text-sm text-neutral-500">Generate inventory reports and exports</p>
        </div>
      </div>
    </Link>
  );
};

export default ReportsWidget;
