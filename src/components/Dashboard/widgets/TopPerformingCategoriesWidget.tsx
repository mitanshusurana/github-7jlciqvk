import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useProducts from '../../../hooks/useProducts';

const TopPerformingCategoriesWidget: React.FC = () => {
  const { products } = useProducts();
  const productList = products?.content ?? [];

  const categoryData = useMemo(() => {
    const categoryValue: Record<string, number> = {};
    productList.forEach(p => {
      if (typeof p.estimatedValue === 'number') {
        categoryValue[p.category] = (categoryValue[p.category] || 0) + p.estimatedValue;
      }
    });

    return Object.entries(categoryValue)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [productList]);

  const pieColors = ['#1A4B8C', '#2E8B57', '#E0115F', '#F59E0B', '#8B5CF6'];

  return (
    <div className="card h-full p-6">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Top Performing Categories</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {categoryData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} in sales`, 'Value']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopPerformingCategoriesWidget;
