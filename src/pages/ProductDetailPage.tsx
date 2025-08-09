import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, QrCode, Share2, ShoppingCart } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import { AnyProduct } from '../types';
import GemstoneGallery from '../components/Gemstone/GemstoneGallery';
import ShareModal from '../components/Gemstone/ShareModal';
import toast from 'react-hot-toast';
import { shopifyService } from '../services/shopifyService';

import TitlePriceSection from '../components/Gemstone/DetailPageSections/TitlePriceSection';
import ProductOverviewSection from '../components/Gemstone/DetailPageSections/ProductOverviewSection';
import CraftsmanshipMetalSection from '../components/Gemstone/DetailPageSections/CraftsmanshipMetalSection';
import AuthenticitySection from '../components/Gemstone/DetailPageSections/AuthenticitySection';
import AdditionalInfoTabs from '../components/Gemstone/DetailPageSections/AdditionalInfoTabs';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, deleteProduct, updateProduct } = useProducts();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  if (!id) return <div>Invalid product ID</div>;
  
  const [product, setProduct] = useState<AnyProduct | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getProduct(id)
      .then((data: AnyProduct) => {
        if (isMounted) setProduct(data);
      })
      .catch(() => {
        if (isMounted) setProduct(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [id, getProduct]);

  if (loading) {
    return <div className="container-page flex items-center justify-center"><h1 className="text-2xl font-bold">Loading...</h1></div>;
  }

  if (!product) {
    return (
      <div className="container-page flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
        <Link to="/inventory" className="btn-primary mt-4">Back to Inventory</Link>
      </div>
    );
  }
  
  const handleDelete = async () => {
    const success = await deleteProduct(id);
    if (success) {
      toast.success('Product deleted successfully');
      navigate('/inventory');
    } else {
      toast.error('Failed to delete product');
    }
  };

  const handleSyncToShopify = async () => {
    if (product) {
      try {
        const shopifyProduct = await shopifyService.createProduct(product);
        await updateProduct(product.id, {
          ...product,
          platformIds: {
            ...product.platformIds,
            shopifyId: shopifyProduct.id.toString(),
          },
        });
        toast.success('Product synced to Shopify successfully!');
      } catch (error) {
        toast.error('Failed to sync product to Shopify.');
        console.error(error);
      }
    }
  };

  return (
    <div className="container-page">
      <div className="flex justify-between items-center mb-6">
        <Link to="/inventory" className="inline-flex items-center text-neutral-600 hover:text-neutral-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Inventory
        </Link>
        <div className="flex space-x-2">
          <button onClick={handleSyncToShopify} className="btn-outline"><ShoppingCart className="h-4 w-4 mr-2" />Sync to Shopify</button>
          <button onClick={() => {
            // Simulate a webhook call
            fetch('/api/shopify-webhook', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: product.platformIds.shopifyId,
                title: `${product.name} (Updated from Shopify)`,
                body_html: product.description,
                vendor: product.supplier,
                product_type: product.productType,
                variants: [{ price: product.price, sku: product.id }],
              }),
            });
            toast.success('Simulated webhook call sent!');
          }} className="btn-outline">Simulate Webhook</button>
          <button onClick={() => setShowShareModal(true)} className="btn-outline"><Share2 className="h-4 w-4" /></button>
          <Link to={`/product/${id}/edit`} className="btn-primary"><Edit className="h-4 w-4" /></Link>
          <button onClick={() => {
            // Simulate an order
            if (product) {
              const newQuantity = product.productType === 'LooseStone' ? product.quantity - 1 : (product.inventoryQuantity || 0) - 1;
              if (newQuantity >= 0) {
                const updatedProduct = {
                  ...product,
                  ...(product.productType === 'LooseStone' ? { quantity: newQuantity } : { inventoryQuantity: newQuantity }),
                };
                updateProduct(product.id, updatedProduct);
                toast.success('Simulated order placed!');
              } else {
                toast.error('Not enough inventory to place order.');
              }
            }
          }} className="btn-outline">Simulate Order</button>
          <button onClick={() => setShowDeleteConfirm(true)} className="btn-outline border-error-300 text-error-700 hover:bg-error-50"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <GemstoneGallery images={product.images || []} video={product.videos?.[0]} name={product.name} />
          <div className="card p-6 mt-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Description</h3>
            <p className="text-neutral-700 whitespace-pre-wrap">{product.description}</p>
          </div>
          <AdditionalInfoTabs product={product} />
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          <TitlePriceSection product={product} />
          <ProductOverviewSection product={product} />
          <CraftsmanshipMetalSection product={product} />
          <AuthenticitySection product={product} />
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold">Delete Product</h3>
            <p className="text-neutral-600 my-4">Are you sure you want to delete "{product.name}"? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button className="btn-outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn bg-error-600 text-white hover:bg-error-700" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          productName={product.name}
          productUrl={window.location.href}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;