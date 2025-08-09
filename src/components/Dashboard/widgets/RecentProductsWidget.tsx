import React from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../../../hooks/useProducts';
import ProductCard from '../../Product/ProductCard';
import { Product } from '../../../types';

const RecentProductsWidget: React.FC = () => {
  const { products = { content: [] }, loading } = useProducts();
  const recentProducts = (products.content ?? []).slice(0, 4);

  return (
    <div className="card">
      <div className="flex justify-between items-center p-6">
        <h2 className="text-xl font-semibold text-neutral-900">Recent Products</h2>
        <Link to="/inventory" className="text-sm font-medium text-primary-600 hover:text-primary-800">
          View all
        </Link>
      </div>
      <div className="p-6 pt-0">
        <div className="gem-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="card">
                <div className="aspect-square bg-neutral-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-5 bg-neutral-200 animate-pulse rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 animate-pulse rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : recentProducts.length > 0 ? (
            recentProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-neutral-500">No products found</p>
              <Link to="/product/new" className="btn-primary mt-4 inline-flex">
                Add your first product
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentProductsWidget;
