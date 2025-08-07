import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

const salesData = [
  { date: '2023-01-15', sales: 4000 },
  { date: '2023-01-22', sales: 3000 },
  { date: '2023-02-05', sales: 5000 },
  { date: '2023-02-12', sales: 4500 },
  { date: '2023-03-05', sales: 6000 },
  { date: '2023-03-12', sales: 5500 },
];

import { Order } from '../types';

const mockOrders: Order[] = [
  { id: '1', orderNumber: '#1001', customerName: 'John Doe', totalPrice: 1500, status: 'paid', date: new Date().toISOString(), items: [] },
  { id: '2', orderNumber: '#1002', customerName: 'Jane Smith', totalPrice: 2500, status: 'shipped', date: new Date().toISOString(), items: [] },
  { id: '3', orderNumber: '#1003', customerName: 'John Doe', totalPrice: 500, status: 'paid', date: new Date().toISOString(), items: [] },
  { id: '4', orderNumber: '#1004', customerName: 'Bob Johnson', totalPrice: 5000, status: 'paid', date: new Date().toISOString(), items: [] },
];

const customerSegments = mockOrders.reduce((acc, order) => {
  const customer = acc[order.customerName] || { name: order.customerName, totalSpent: 0, orderCount: 0 };
  customer.totalSpent += order.totalPrice;
  customer.orderCount += 1;
  acc[order.customerName] = customer;
  return acc;
}, {} as Record<string, { name: string, totalSpent: number, orderCount: number }>);

const customerSegmentsData = Object.values(customerSegments);

const AnalyticsDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = React.useState('monthly');

  const getFilteredData = () => {
    const now = new Date();
    switch (timeframe) {
      case 'daily':
        return eachDayOfInterval({ start: startOfWeek(now), end: endOfWeek(now) }).map(day => ({
          name: format(day, 'EEE'),
          sales: salesData.find(d => format(new Date(d.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))?.sales || 0,
        }));
      case 'weekly':
        return eachWeekOfInterval({ start: startOfMonth(now), end: endOfMonth(now) }).map(week => ({
          name: `Week of ${format(week, 'MMM d')}`,
          sales: salesData.filter(d => startOfWeek(new Date(d.date)) === week).reduce((acc, cur) => acc + cur.sales, 0),
        }));
      case 'monthly':
        return eachMonthOfInterval({ start: startOfYear(now), end: endOfYear(now) }).map(month => ({
          name: format(month, 'MMM'),
          sales: salesData.filter(d => format(new Date(d.date), 'yyyy-MM') === format(month, 'yyyy-MM')).reduce((acc, cur) => acc + cur.sales, 0),
        }));
      default:
        return [];
    }
  };

  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Advanced Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Sales Trends</h2>
            <div className="flex space-x-2">
              <button onClick={() => setTimeframe('daily')} className={`btn-sm ${timeframe === 'daily' ? 'btn-primary' : 'btn-outline'}`}>Daily</button>
              <button onClick={() => setTimeframe('weekly')} className={`btn-sm ${timeframe === 'weekly' ? 'btn-primary' : 'btn-outline'}`}>Weekly</button>
              <button onClick={() => setTimeframe('monthly')} className={`btn-sm ${timeframe === 'monthly' ? 'btn-primary' : 'btn-outline'}`}>Monthly</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getFilteredData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Segmentation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerSegmentsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSpent" fill="#8884d8" name="Total Spent" />
              <Bar dataKey="orderCount" fill="#82ca9d" name="Order Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Sales Forecast</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[...salesData, {name: 'Jul', sales: 6500}, {name: 'Aug', sales: 7000}]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              <Line type="monotone" dataKey="sales" stroke="#82ca9d" strokeDasharray="5 5" name="Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
