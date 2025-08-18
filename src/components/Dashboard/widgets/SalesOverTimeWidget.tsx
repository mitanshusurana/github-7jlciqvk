import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnyProduct } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface SalesOverTimeWidgetProps {
  products: AnyProduct[];
}

const SalesOverTimeWidget: React.FC<SalesOverTimeWidgetProps> = ({ products }) => {
  const salesData = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSales = products
      .filter(p => new Date(p.acquisitionDate) > thirtyDaysAgo)
      .sort((a, b) => new Date(a.acquisitionDate).getTime() - new Date(b.acquisitionDate).getTime());

    const salesByDay: Record<string, number> = {};
    recentSales.forEach(p => {
      const day = formatDate(p.acquisitionDate);
      salesByDay[day] = (salesByDay[day] || 0) + (p.price || 0);
    });

    return Object.entries(salesByDay).map(([date, sales]) => ({ date, sales }));
  }, [products]);

  return (
    <div className="card h-full p-6">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Sales Over Time (Last 30 Days)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => [formatCurrency(value as number), 'Sales']} />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesOverTimeWidget;
