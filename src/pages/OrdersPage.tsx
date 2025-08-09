import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';
import { format } from 'date-fns';

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#1001',
    customerName: 'John Doe',
    totalPrice: 1500,
    status: 'paid',
    date: new Date().toISOString(),
    items: [{ productId: '1', productName: 'Diamond Ring', quantity: 1, price: 1500 }],
  },
  {
    id: '2',
    orderNumber: '#1002',
    customerName: 'Jane Smith',
    totalPrice: 2500,
    status: 'shipped',
    date: new Date().toISOString(),
    items: [{ productId: '2', productName: 'Sapphire Necklace', quantity: 1, price: 2500 }],
  },
];

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // In a real app, you would fetch the orders from your backend, which would fetch them from Shopify
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Orders</h1>
      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Order</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b">
                <td className="p-4">
                  <Link to={`/orders/${order.id}`} className="text-primary-600 hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="p-4">{format(new Date(order.date), 'MMM d, yyyy')}</td>
                <td className="p-4">{order.customerName}</td>
                <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                <td className="p-4">{order.status}</td>
                <td className="text-right p-4">
                  <Link to={`/orders/${order.id}`} className="text-primary-600 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
