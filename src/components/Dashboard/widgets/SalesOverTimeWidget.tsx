import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useProducts from '../../../hooks/useProducts';
import { formatCurrency, formatDate } from '../../../utils/formatters';

const SalesOverTimeWidget: React.FC = () => {
  const { products } = useProducts();
  const productList = products?.content ?? [];

  const salesData = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSales = productList
      .filter(p => new Date(p.createdAt) > thirtyDaysAgo)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const salesByDay: Record<string, number> = {};
    recentSales.forEach(p => {
      const day = formatDate(p.createdAt);
      salesByDay[day] = (salesByDay[day] || 0) + (p.sellingPrice || 0);
    });

    return Object.entries(salesByDay).map(([date, sales]) => ({ date, sales }));
  }, [productList]);

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
