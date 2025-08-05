import { create } from 'zustand';
import { PaginatedProducts, AnyProduct } from '../types';

interface ProductCacheStore {
  productCache: Record<string, PaginatedProducts>;
  singleProductCache: Record<string, AnyProduct>;
  setProductCache: (key: string, value: PaginatedProducts) => void;
  setSingleProductCache: (id: string, value: AnyProduct) => void;
  clearCaches: () => void;
}

export const useProductCacheStore = create<ProductCacheStore>((set) => ({
  productCache: {},
  singleProductCache: {},
  setProductCache: (key, value) =>
    set((state) => ({
      productCache: { ...state.productCache, [key]: value },
    })),
  setSingleProductCache: (id, value) =>
    set((state) => ({
      singleProductCache: { ...state.singleProductCache, [id]: value },
    })),
  clearCaches: () =>
    set(() => ({
      productCache: {},
      singleProductCache: {},
    })),
}));