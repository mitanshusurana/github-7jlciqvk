import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Mail, Phone } from 'lucide-react';
import { clientService } from '../services/clientService';
import { productService } from '../services/productService';
import { Client, AnyProduct } from '../types';

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<AnyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (id) {
        setLoading(true);
        try {
          const clientData = await clientService.getClient(id);
          setClient(clientData);
          const historyData = await productService.getProductsByClientId(id);
          setPurchaseHistory(historyData);
        } catch (error) {
          console.error("Failed to fetch client details:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchClientDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!client) return <div>Client not found</div>;

  return (
    <div className="container-page">
      <Link to="/clients" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Clients
      </Link>

      <div className="card p-6 mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{client.name}</h1>
        <div className="flex items-center space-x-4 mt-2 text-neutral-500">
          {client.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <span>{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>{client.phone}</span>
            </div>
          )}
        </div>
        {client.address && (
          <address className="mt-4 not-italic text-neutral-500">
            {client.address.street}, {client.address.city}, {client.address.state} {client.address.zip}, {client.address.country}
          </address>
        )}
      </div>

      <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
        <ShoppingCart className="h-6 w-6 mr-2" />
        Purchase History
      </h2>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Product Name</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Date of Purchase</th>
            </tr>
          </thead>
          <tbody>
            {purchaseHistory.map(product => (
              <tr key={product.id} className="border-b">
                <td className="p-4">
                  <Link to={`/product/${product.id}`} className="text-primary-600 hover:underline">
                    {product.name}
                  </Link>
                </td>
                <td className="p-4">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.sellingPrice || 0)}
                </td>
                <td className="p-4">{new Date(product.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {purchaseHistory.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-neutral-500">
                  No purchase history found for this client.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientDetailPage;
