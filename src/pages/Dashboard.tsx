import React from 'react';
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

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard: React.FC = () => {
  const layouts = {
    lg: [
      { i: 'total-products', x: 0, y: 0, w: 1, h: 1 },
      { i: 'categories', x: 1, y: 0, w: 1, h: 1 },
      { i: 'reports', x: 2, y: 0, w: 1, h: 1 },
      { i: 'analytics', x: 3, y: 0, w: 1, h: 1 },
      { i: 'sales-over-time', x: 0, y: 1, w: 2, h: 2 },
      { i: 'top-performing-categories', x: 2, y: 1, w: 2, h: 2 },
      { i: 'recent-products', x: 0, y: 3, w: 4, h: 2 },
    ],
    md: [
      { i: 'total-products', x: 0, y: 0, w: 1, h: 1 },
      { i: 'categories', x: 1, y: 0, w: 1, h: 1 },
      { i: 'reports', x: 2, y: 0, w: 1, h: 1 },
      { i: 'analytics', x: 0, y: 1, w: 1, h: 1 },
      { i: 'sales-over-time', x: 1, y: 1, w: 2, h: 2 },
      { i: 'top-performing-categories', x: 0, y: 3, w: 3, h: 2 },
      { i: 'recent-products', x: 0, y: 5, w: 3, h: 2 },
    ],
    sm: [
      { i: 'total-products', x: 0, y: 0, w: 1, h: 1 },
      { i: 'categories', x: 1, y: 0, w: 1, h: 1 },
      { i: 'reports', x: 0, y: 1, w: 1, h: 1 },
      { i: 'analytics', x: 1, y: 1, w: 1, h: 1 },
      { i: 'sales-over-time', x: 0, y: 2, w: 2, h: 2 },
      { i: 'top-performing-categories', x: 0, y: 4, w: 2, h: 2 },
      { i: 'recent-products', x: 0, y: 6, w: 2, h: 2 },
    ],
    xs: [
      { i: 'total-products', x: 0, y: 0, w: 1, h: 1 },
      { i: 'categories', x: 0, y: 1, w: 1, h: 1 },
      { i: 'reports', x: 0, y: 2, w: 1, h: 1 },
      { i: 'analytics', x: 0, y: 3, w: 1, h: 1 },
      { i: 'sales-over-time', x: 0, y: 4, w: 1, h: 2 },
      { i: 'top-performing-categories', x: 0, y: 6, w: 1, h: 2 },
      { i: 'recent-products', x: 0, y: 8, w: 1, h: 2 },
    ],
  };

  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Dashboard</h1>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={150}
        compactType={null}
      >
        <div key="total-products">
          <TotalProductsWidget />
        </div>
        <div key="categories">
          <CategoriesWidget />
        </div>
        <div key="reports">
          <ReportsWidget />
        </div>
        <div key="analytics">
          <AnalyticsWidget />
        </div>
        <div key="sales-over-time">
          <SalesOverTimeWidget />
        </div>
        <div key="top-performing-categories">
          <TopPerformingCategoriesWidget />
        </div>
        <div key="recent-products">
          <RecentProductsWidget />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;