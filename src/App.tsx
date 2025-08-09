import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import RequireAuth from './components/RequireAuth';
import withRole from './components/withRole';

// Lazy load all the page components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const GemstoneFormPage = lazy(() => import('./pages/GemstoneFormPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const NewReportsPage = lazy(() => import('./pages/NewReportsPage'));
const ClientsPage = lazy(() => import('./pages/ClientsPage'));
const ClientFormPage = lazy(() => import('./pages/ClientFormPage'));
const ClientDetailPage = lazy(() => import('./pages/ClientDetailPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const QrCodePage = lazy(() => import('./pages/QrCodePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage'));
const ReportingDashboard = lazy(() => import('./pages/ReportingDashboard'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const WorkflowsPage = lazy(() => import('./pages/WorkflowsPage'));
const FinancialsPage = lazy(() => import('./pages/FinancialsPage'));

// HOC for role-based access control
const AdminUserManagementPage = withRole(UserManagementPage, ['admin']);

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-xl font-semibold">Loading...</div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="product/new" element={<GemstoneFormPage />} />
          <Route path="product/:id/edit" element={<GemstoneFormPage />} />
          <Route path="product/:id/qr" element={<QrCodePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/dashboard" element={<ReportingDashboard />} />
          <Route path="reports/new" element={<NewReportsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/new" element={<ClientFormPage />} />
          <Route path="clients/:id" element={<ClientDetailPage />} />
          <Route path="clients/:id/edit" element={<ClientFormPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="analytics/dashboard" element={<AnalyticsDashboard />} />
          <Route path="workflows" element={<WorkflowsPage />} />
          <Route path="financials" element={<FinancialsPage />} />
          <Route path="user-management" element={<AdminUserManagementPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;