import React from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const financialsData = [
  { name: 'Jan', revenue: 10000, cogs: 4000, profit: 6000 },
  { name: 'Feb', revenue: 12000, cogs: 5000, profit: 7000 },
  { name: 'Mar', revenue: 15000, cogs: 6000, profit: 9000 },
];

const FinancialsPage: React.FC = () => {
  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Financial Reporting</h1>
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Profit & Loss</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={financialsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
            <Bar dataKey="cogs" fill="#82ca9d" />
            <Bar dataKey="profit" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Inventory Valuation</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[{name: 'Loose Stones', value: 120000}, {name: 'Carved Idols', value: 80000}, {name: 'Jewelry', value: 250000}]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialsPage;
