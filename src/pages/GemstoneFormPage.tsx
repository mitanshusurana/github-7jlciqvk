import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import { AnyProduct } from '../types';
import ProductForm from '../components/Product/ProductForm';
import toast from 'react-hot-toast';

const GemstoneFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, addProduct, updateProduct } = useProducts();
  const [product, setProduct] = useState<AnyProduct | null>(null);
  const [loading, setLoading] = useState(!!id);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProduct(id)
        .then(setProduct)
        .finally(() => setLoading(false));
    }
  }, [id, getProduct]);

  const handleSubmit = async (values: AnyProduct) => {
    try {
      if (isEditMode && product) {
        await updateProduct(product.id, values);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(values);
        toast.success('Product added successfully!');
      }
      navigate('/inventory');
    } catch (error) {
      toast.error('Failed to save product.');
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container-page">
      <Link to="/inventory" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Inventory
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <ProductForm product={product} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default GemstoneFormPage;