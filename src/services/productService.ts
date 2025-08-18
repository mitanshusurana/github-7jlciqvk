import { api } from '../config/api';
import { AnyProduct } from '../types';

export const productService = {
  // Get all products with pagination and filters
  async getProducts(params?: Record<string, any>) {
    try {
      const response = await api.get('', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products. Please check if the API server is running.');
    }
  },

  // Get a single product by ID
  async getProduct(id: string) {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error(`Failed to fetch product with ID: ${id}`);
    }
  },

  // Create a new product
  async createProduct(data: Omit<AnyProduct, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Generate a unique ID for the new product
      const newProduct = {
        ...data,
        id: data.id || Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const response = await api.post('', newProduct);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product. Please try again.');
    }
  },

  // Update an existing product
  async updateProduct(id: string, data: Partial<AnyProduct>) {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      const response = await api.put(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error(`Failed to update product with ID: ${id}`);
    }
  },

  // Delete a product
  async deleteProduct(id: string) {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error(`Failed to delete product with ID: ${id}`);
    }
  },

};
