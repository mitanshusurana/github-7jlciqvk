import { Client } from '../types';

const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'USA',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    address: {
      street: '456 Oak Ave',
      city: 'Someplace',
      state: 'NY',
      zip: '54321',
      country: 'USA',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class ClientService {
  async getClients(): Promise<Client[]> {
    return Promise.resolve(mockClients);
  }

  async getClient(id: string): Promise<Client | undefined> {
    return Promise.resolve(mockClients.find(c => c.id === id));
  }

  async addClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const newClient: Client = {
      ...client,
      id: (mockClients.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockClients.push(newClient);
    return Promise.resolve(newClient);
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client | undefined> {
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    mockClients[index] = { ...mockClients[index], ...client, updatedAt: new Date().toISOString() };
    return Promise.resolve(mockClients[index]);
  }

  async deleteClient(id: string): Promise<boolean> {
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) return false;
    mockClients.splice(index, 1);
    return Promise.resolve(true);
  }
}

export const clientService = new ClientService();
