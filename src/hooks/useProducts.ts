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
      const response = await productService.getProducts();
      let allProducts = response.content || [];

      // Apply filters
      if (filters.search) {
        allProducts = allProducts.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
      }
      if (filters.category) {
        allProducts = allProducts.filter(p => p.productType === 'Jewelry' && p.category === filters.category);
      }
      if (filters.style) {
        allProducts = allProducts.filter(p => p.productType === 'Jewelry' && p.style === filters.style);
      }
      if (filters.metal) {
        allProducts = allProducts.filter(p => p.productType === 'Jewelry' && p.metal === filters.metal);
      }
      if (filters.clarityGrade) {
        allProducts = allProducts.filter(p => p.productType === 'LooseStone' && p.clarityGrade === filters.clarityGrade);
      }
      if (filters.rarity) {
        allProducts = allProducts.filter(p => p.productType === 'CarvedIdol' && p.rarity === filters.rarity);
      }
      if (filters.workmanshipGrade) {
        allProducts = allProducts.filter(p => p.productType === 'CarvedIdol' && p.workmanshipGrade === filters.workmanshipGrade);
      }
      if (filters.dateFrom) {
        allProducts = allProducts.filter(p => new Date(p.acquisitionDate) >= new Date(filters.dateFrom));
      }
      if (filters.dateTo) {
        allProducts = allProducts.filter(p => new Date(p.acquisitionDate) <= new Date(filters.dateTo));
      }

      const totalElements = allProducts.length;
      const totalPages = Math.ceil(totalElements / pagination.limit);
      const paginatedProducts = allProducts.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit);

      const result = {
        content: paginatedProducts,
        totalPages,
        totalElements,
        size: pagination.limit,
        number: pagination.page,
      };

      setProductCache(cacheKey, result);
      setProducts(result);
      setPagination(prev => ({
        ...prev,
        totalItems: totalElements,
        totalPages,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      toast.error(errorMessage);
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
  }, [getCacheKey]);

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
      const shopifyProduct = await shopifyService.createProduct(newProduct);
      const updatedProduct = await productService.updateProduct(newProduct.id, {
        ...newProduct,
        platformIds: {
          ...newProduct.platformIds,
          shopifyId: shopifyProduct.id.toString(),
        },
      });
      clearCache();
      clearSingleProductCache();
      fetchProducts();
      return updatedProduct;
    } catch (err) {
      toast.error('Failed to add product');
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
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [pagination.page, pagination.totalPages]);

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
    pagination,
    hasMore: pagination.page < pagination.totalPages,
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
