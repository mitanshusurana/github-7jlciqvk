import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import GemstoneFormPage from './pages/GemstoneFormPage';
import ReportsPage from './pages/ReportsPage';
import NewReportsPage from './pages/NewReportsPage';
import ClientsPage from './pages/ClientsPage';
import ClientFormPage from './pages/ClientFormPage';
import ClientDetailPage from './pages/ClientDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';
import QrCodePage from './pages/QrCodePage';
import LoginPage from './pages/LoginPage';
import RequireAuth from './components/RequireAuth';
import withRole from './components/withRole';
import UserManagementPage from './pages/UserManagementPage';
import ReportingDashboard from './pages/ReportingDashboard';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';

const AdminUserManagementPage = withRole(UserManagementPage, ['admin']);

function App() {
  return (
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
        <Route path="user-management" element={<AdminUserManagementPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;