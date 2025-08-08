import { api } from '../config/api';
import { AnyProduct } from '../types';

export const productService = {
  // Get all products with pagination and filters
  async getProducts(params?: Record<string, any>) {
    // params can include page, size, sort, filters, etc.
    const response = await api.get('/products', { params });
    return response.data; // return the full paginated response
  },

  // Get a single product by ID
  async getProduct(id: string) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create a new product
  async createProduct(data: Omit<AnyProduct, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await api.post('/products', data);
    return response.data;
  },

  // Update an existing product
  async updateProduct(id: string, data: Partial<AnyProduct>) {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete a product
  async deleteProduct(id: string) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

};