import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import TotalProductsWidget from '../components/Dashboard/widgets/TotalProductsWidget';
import CategoriesWidget from '../components/Dashboard/widgets/CategoriesWidget';
import ReportsWidget from '../components/Dashboard/widgets/ReportsWidget';
import AnalyticsWidget from '../components/Dashboard/widgets/AnalyticsWidget';
import RecentProductsWidget from '../components/Dashboard/widgets/RecentProductsWidget';
import SalesOverTimeWidget from '../components/Dashboard/widgets/SalesOverTimeWidget';
import TopPerformingCategoriesWidget from '../components/Dashboard/widgets/TopPerformingCategoriesWidget';
import { Settings, Plus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard: React.FC = () => {
  const [isDraggable, setIsDraggable] = useState(false);
  const [isResizable, setIsResizable] = useState(false);

  const layouts = {
    lg: [
      { i: 'total-products', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
      { i: 'categories', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
      { i: 'reports', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
      { i: 'analytics', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
      { i: 'sales-over-time', x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
      { i: 'top-performing-categories', x: 6, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
      { i: 'recent-products', x: 0, y: 6, w: 12, h: 4, minW: 6, minH: 3 },
    ],
    md: [
      { i: 'total-products', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'categories', x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'reports', x: 4, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'analytics', x: 6, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'sales-over-time', x: 0, y: 2, w: 4, h: 4, minW: 3, minH: 3 },
      { i: 'top-performing-categories', x: 4, y: 2, w: 4, h: 4, minW: 3, minH: 3 },
      { i: 'recent-products', x: 0, y: 6, w: 8, h: 4, minW: 4, minH: 3 },
    ],
    sm: [
      { i: 'total-products', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'categories', x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'reports', x: 0, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'analytics', x: 2, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'sales-over-time', x: 0, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
      { i: 'top-performing-categories', x: 0, y: 8, w: 4, h: 4, minW: 3, minH: 3 },
      { i: 'recent-products', x: 0, y: 12, w: 4, h: 4, minW: 3, minH: 3 },
    ],
    xs: [
      { i: 'total-products', x: 0, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
      { i: 'categories', x: 0, y: 2, w: 1, h: 2, minW: 1, minH: 2 },
      { i: 'reports', x: 0, y: 4, w: 1, h: 2, minW: 1, minH: 2 },
      { i: 'analytics', x: 0, y: 6, w: 1, h: 2, minW: 1, minH: 2 },
      { i: 'sales-over-time', x: 0, y: 8, w: 1, h: 4, minW: 1, minH: 3 },
      { i: 'top-performing-categories', x: 0, y: 12, w: 1, h: 4, minW: 1, minH: 3 },
      { i: 'recent-products', x: 0, y: 16, w: 1, h: 4, minW: 1, minH: 3 },
    ],
  };

  const toggleEditMode = () => {
    setIsDraggable(!isDraggable);
    setIsResizable(!isResizable);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-600 mt-1">Monitor your jewelry and gemstone inventory</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/product/new" 
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
            <button 
              onClick={toggleEditMode}
              className={`inline-flex items-center px-4 py-2 border rounded-lg transition-colors ${
                isDraggable 
                ? 'bg-primary-100 border-primary-300 text-primary-700' 
                : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isDraggable ? 'Exit Edit' : 'Customize'}
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">
        {isDraggable && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm font-medium">
              📝 Edit Mode: Drag and resize widgets to customize your dashboard layout
            </p>
          </div>
        )}

        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 8, sm: 4, xs: 1, xxs: 1 }}
          rowHeight={120}
          margin={[24, 24]}
          containerPadding={[0, 0]}
          isDraggable={isDraggable}
          isResizable={isResizable}
          compactType={null}
          preventCollision={true}
          autoSize={true}
        >
          <div key="total-products" className="widget-container">
            <TotalProductsWidget />
          </div>
          <div key="categories" className="widget-container">
            <CategoriesWidget />
          </div>
          <div key="reports" className="widget-container">
            <ReportsWidget />
          </div>
          <div key="analytics" className="widget-container">
            <AnalyticsWidget />
          </div>
          <div key="sales-over-time" className="widget-container">
            <SalesOverTimeWidget />
          </div>
          <div key="top-performing-categories" className="widget-container">
            <TopPerformingCategoriesWidget />
          </div>
          <div key="recent-products" className="widget-container">
            <RecentProductsWidget />
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default Dashboard;
