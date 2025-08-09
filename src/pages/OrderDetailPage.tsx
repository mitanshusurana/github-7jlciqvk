import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // In a real app, you would fetch the order from your backend
    setTimeout(() => {
      const foundOrder = mockOrders.find(o => o.id === id);
      setOrder(foundOrder || null);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="container-page">
      <Link to="/orders" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6">
        Back to Orders
      </Link>
      <div className="card p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Order {order.orderNumber}</h1>
            <p className="text-neutral-500">
              {format(new Date(order.date), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">${order.totalPrice.toFixed(2)}</p>
            <p className={`capitalize px-2 py-1 rounded text-sm ${
              order.status === 'paid' ? 'bg-green-100 text-green-800' :
              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>{order.status}</p>
          </div>
        </div>
        <hr className="my-6" />
        <div>
          <h2 className="text-xl font-semibold mb-4">Customer</h2>
          <p>{order.customerName}</p>
        </div>
        <hr className="my-6" />
        <div>
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Product</th>
                <th className="text-right p-2">Quantity</th>
                <th className="text-right p-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.productId} className="border-b">
                  <td className="p-2">
                    <Link to={`/product/${item.productId}`} className="text-primary-600 hover:underline">
                      {item.productName}
                    </Link>
                  </td>
                  <td className="text-right p-2">{item.quantity}</td>
                  <td className="text-right p-2">${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
