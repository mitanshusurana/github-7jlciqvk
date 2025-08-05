import { useState, useCallback, useEffect, useRef } from 'react';
import { AnyProduct, FilterParams, PaginationParams, PaginatedProducts } from '../types';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';
import { useProductCacheStore } from '../store/ProductCacheStore';

const DEBOUNCE_DELAY = 400;

export const useProducts = () => {
  const [products, setProducts] = useState<PaginatedProducts>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 0,
    number: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<FilterParams>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    productCache,
    singleProductCache,
    setProductCache,
    setSingleProductCache,
    clearCaches,
  } = useProductCacheStore();

  // Helper to get cache key
  const getCacheKey = useCallback(
    () => JSON.stringify({ page: pagination.page, limit: pagination.limit, ...filters }),
    [pagination.page, pagination.limit, filters]
  );

  // Fetch products with global cache
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const cacheKey = getCacheKey();
    const cached = productCache[cacheKey];
    if (cached) {
      setProducts(cached);
      setLoading(false);
      return;
    }
    try {
      const params = { page: pagination.page, limit: pagination.limit, ...filters };
      const response = await productService.getProducts(params);

      const result = response || {
        content: [],
        totalPages: 0,
        totalElements: 0,
        size: 12,
        number: 1,
      };
      setProductCache(cacheKey, result);
      setProducts(result);
      setPagination(prev => ({
        ...prev,
        totalItems: response.total,
        totalPages: Math.ceil(response.total / prev.limit),
      }));
    } catch (err) {
      setError('Failed to fetch products');
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [getCacheKey, pagination.page, pagination.limit, filters, setProductCache]);

  // Debounce fetch on filters or pagination change
  useEffect(() => {
    const cacheKey = getCacheKey();
    const cached = productCache[cacheKey];
    if (cached) {
      setProducts(cached);
      setLoading(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts();
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // Only depend on cacheKey, not the whole productCache object
  }, [getCacheKey()]);

  // Invalidate cache on add/update/delete
  const clearCache = () => {
    Object.keys(productCache).forEach(key => delete productCache[key]);
  };

  // Get a single product with cache
  const getProduct = useCallback(async (id: string) => {
    if (singleProductCache[id]) {
      return singleProductCache[id];
    }
    try {
      const product = await productService.getProduct(id);
      if (product) {
        setSingleProductCache(id, product);
      }
      return product;
    } catch (err) {
      toast.error('Failed to fetch product details');
      return undefined;
    }
  }, [singleProductCache, setSingleProductCache]);

  // Invalidate single product cache on add/update/delete
  const clearSingleProductCache = () => {
    Object.keys(singleProductCache).forEach(key => delete singleProductCache[key]);
  };

  // Add a new product
  const addProduct = useCallback(async (data: Omit<AnyProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct = await productService.createProduct(data);
      clearCache();
      clearSingleProductCache();
      fetchProducts();
      return newProduct;
    } catch (err) {
      toast.error('Failed to add product');
      throw err;
    }
  }, [fetchProducts]);

  // Update a product
  const updateProduct = useCallback(async (id: string, updates: Partial<AnyProduct>) => {
    try {
      const updatedProduct = await productService.updateProduct(id, updates);
      clearCache();
      clearSingleProductCache();
      fetchProducts();
      return updatedProduct;
    } catch (err) {
      toast.error('Failed to update product');
      throw err;
    }
  }, [fetchProducts]);

  // Delete a product
  const deleteProduct = useCallback(async (id: string) => {
    try {
      await productService.deleteProduct(id);
      clearCache();
      clearSingleProductCache();
      fetchProducts();
      return true;
    } catch (err) {
      toast.error('Failed to delete product');
      return false;
    }
  }, [fetchProducts]);

  // Load more products
  const loadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [pagination.page, pagination.totalPages]);

  // Get all categories
  const getCategories = useCallback(() => {
    const categories = new Set<string>();
    (products.content ?? []).forEach((prod: { category: string; }) => prod.category && categories.add(prod.category));
    return Array.from(categories);
  }, [products]);

  // Get all tags
  const getTags = useCallback(() => {
    const tags = new Set<string>();
    (products.content ?? []).forEach((prod: { tags: any; }) => {
      (prod.tags || []).forEach((tag: string) => tag && tags.add(tag));
    });
    return Array.from(tags);
  }, [products]);

  const getOccasions = useCallback(() => {
    const occasions = new Set<string>();
    (products.content ?? []).forEach((prod: { occasion?: string; }) => prod.occasion && occasions.add(prod.occasion));
    return Array.from(occasions);
  }, [products]);

  const getDesignTypes = useCallback(() => {
    const designTypes = new Set<string>();
    (products.content ?? []).forEach((prod: { designType?: string; }) => prod.designType && designTypes.add(prod.designType));
    return Array.from(designTypes);
  }, [products]);

  const getStockStatuses = useCallback(() => {
    const stockStatuses = new Set<string>();
    (products.content ?? []).forEach((prod: { stockStatus?: string; }) => prod.stockStatus && stockStatuses.add(prod.stockStatus));
    return Array.from(stockStatuses);
  }, [products]);

  return {
    products,
    loading,
    error,
    pagination,
    hasMore: pagination.page < pagination.totalPages,
    loadMore: () => setPagination(prev => ({ ...prev, page: prev.page + 1 })),
    filters,
    setFilters,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getCategories,
    getTags,
    getOccasions,
    getDesignTypes,
    getStockStatuses,
    refresh: fetchProducts,
  };
};

export default useProducts;