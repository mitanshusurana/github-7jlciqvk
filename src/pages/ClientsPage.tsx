import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { clientService } from '../services/clientService';
import { Client } from '../types';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      const data = await clientService.getClients();
      setClients(data);
      setLoading(false);
    };
    fetchClients();
  }, []);

  return (
    <div className="container-page">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Clients</h1>
          <p className="mt-1 text-neutral-500">Manage your client relationships.</p>
        </div>
        <Link to="/clients/new" className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="card">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Phone</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="border-b">
                  <td className="p-4">{client.name}</td>
                  <td className="p-4">{client.email}</td>
                  <td className="p-4">{client.phone}</td>
                  <td className="text-right p-4">
                    <Link to={`/clients/${client.id}/edit`} className="text-primary-600 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
