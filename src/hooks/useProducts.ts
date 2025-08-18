import { useState, useCallback, useEffect, useRef } from 'react';
import { AnyProduct, FilterParams, PaginationParams, PaginatedProducts } from '../types';
import { productService } from '../services/productService';
import { shopifyService } from '../services/shopifyService';
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
  });
  const [paginationMeta, setPaginationMeta] = useState({
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

  const filtersKey = JSON.stringify(filters);

  // Helper to get cache key
  const getCacheKey = useCallback(
    () => JSON.stringify({ page: pagination.page, limit: pagination.limit, ...filters }),
    [pagination.page, pagination.limit, filtersKey]
  );

  // Fetch products with global cache
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const cacheKey = getCacheKey();
    const cached = productCache[cacheKey];
    if (cached) {
      setProducts(cached);
      setPaginationMeta({
        totalItems: cached.totalElements,
        totalPages: cached.totalPages,
      });
      setLoading(false);
      return;
    }
    try {
      const params = {
        page: pagination.page - 1, // Spring Boot pagination is 0-indexed
        size: pagination.limit,
        ...filters,
      };
      const response = await productService.getProducts(params);

      const result = {
        content: response.content || [],
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        size: response.size,
        number: response.number + 1, // Convert back to 1-indexed for UI
      };

      setProductCache(cacheKey, result);
      setProducts(result);
      setPaginationMeta({
        totalItems: result.totalElements,
        totalPages: result.totalPages,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getCacheKey, pagination.page, pagination.limit, filtersKey, setProductCache]);

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
  }, [getCacheKey, fetchProducts]);

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
  const addProduct = useCallback(async (data: Omit<AnyProduct, 'id' | 'acquisitionDate'>) => {
    try {
      const newProduct = await productService.createProduct(data);
      await shopifyService.createProduct(newProduct);
      clearCache();
      clearSingleProductCache();
      fetchProducts();
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchProducts]);

  // Update a product
  const updateProduct = useCallback(async (id: string, updates: Partial<AnyProduct>) => {
    try {
      const updatedProduct = await productService.updateProduct(id, updates);
      if (updatedProduct.platformIds?.shopifyId) {
        await shopifyService.updateProduct(parseInt(updatedProduct.platformIds.shopifyId), updatedProduct);
      }

      // Check for reorder threshold
      const quantity = updatedProduct.productType === 'LooseStone' ? updatedProduct.quantity : updatedProduct.inventoryQuantity;
      if (quantity !== undefined && updatedProduct.reorderThreshold !== undefined && quantity < updatedProduct.reorderThreshold) {
        console.log(`Reorder request for product ${updatedProduct.name} (ID: ${updatedProduct.id})`);
        toast.info(`Reorder request for product ${updatedProduct.name}`);
      }

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
    if (pagination.page < paginationMeta.totalPages) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [pagination.page, paginationMeta.totalPages]);

  // Get unique categories from products
  const getCategories = useCallback(() => {
    const allProducts = products.content || [];
    const categories = new Set<string>();

    allProducts.forEach(product => {
      if (product.productType === 'Jewelry' && product.category) {
        categories.add(product.category);
      } else if (product.productType === 'LooseStone' && product.gemstoneType) {
        categories.add(product.gemstoneType);
      } else if (product.productType === 'CarvedIdol' && product.material) {
        categories.add(product.material);
      }
    });

    return Array.from(categories).sort();
  }, [products.content]);

  return {
    products,
    loading,
    error,
    pagination: { ...pagination, ...paginationMeta },
    hasMore: pagination.page < paginationMeta.totalPages,
    loadMore,
    filters,
    setFilters,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getCategories,
    refresh: fetchProducts,
  };
};

export default useProducts;
