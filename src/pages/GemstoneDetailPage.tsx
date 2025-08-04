import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, QrCode, Share2, Clock, Info } from 'lucide-react';
import useGemstones from '../hooks/useGemstones';
import { Gemstone } from '../types';
import GemstoneGallery from '../components/Gemstone/GemstoneGallery';
import { formatDate, formatDateTime } from '../utils/formatters';
import toast from 'react-hot-toast';

import TitlePriceSection from '../components/Gemstone/DetailPageSections/TitlePriceSection';
import ProductOverviewSection from '../components/Gemstone/DetailPageSections/ProductOverviewSection';
import CraftsmanshipMetalSection from '../components/Gemstone/DetailPageSections/CraftsmanshipMetalSection';
import AuthenticitySection from '../components/Gemstone/DetailPageSections/AuthenticitySection';
import AdditionalInfoTabs from '../components/Gemstone/DetailPageSections/AdditionalInfoTabs';

const GemstoneDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getGemstone, deleteGemstone } = useGemstones();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  if (!id) return <div>Invalid gemstone ID</div>;
  
  const [gemstone, setGemstone] = useState<Gemstone | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getGemstone(id)
      .then((data: Gemstone) => {
        if (isMounted) setGemstone(data);
      })
      .catch(() => {
        if (isMounted) setGemstone(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [id, getGemstone]);

  if (loading) {
    return <div className="container-page flex items-center justify-center"><h1 className="text-2xl font-bold">Loading...</h1></div>;
  }

  if (!gemstone) {
    return (
      <div className="container-page flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Gemstone Not Found</h1>
        <Link to="/inventory" className="btn-primary mt-4">Back to Inventory</Link>
      </div>
    );
  }
  
  const handleDelete = async () => {
    const success = await deleteGemstone(id);
    if (success) {
      toast.success('Gemstone deleted successfully');
      navigate('/inventory');
    } else {
      toast.error('Failed to delete gemstone');
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
          <Link to={`/gemstone/${id}/qr`} className="btn-outline"><QrCode className="h-4 w-4" /></Link>
          <Link to={`/gemstone/${id}/edit`} className="btn-primary"><Edit className="h-4 w-4" /></Link>
          <button onClick={() => setShowDeleteConfirm(true)} className="btn-outline border-error-300 text-error-700 hover:bg-error-50"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <GemstoneGallery images={gemstone.images || []} video={gemstone.video} name={gemstone.name} />
          {gemstone.detailedDescription && (
            <div className="card p-6 mt-8">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Description</h3>
              <p className="text-neutral-700 whitespace-pre-wrap">{gemstone.detailedDescription}</p>
            </div>
          )}
          <AdditionalInfoTabs gemstone={gemstone} />
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          <TitlePriceSection gemstone={gemstone} />
          <ProductOverviewSection gemstone={gemstone} />
          <CraftsmanshipMetalSection gemstone={gemstone} />
          <AuthenticitySection gemstone={gemstone} />
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold">Delete Gemstone</h3>
            <p className="text-neutral-600 my-4">Are you sure you want to delete "{gemstone.name}"? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button className="btn-outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn bg-error-600 text-white hover:bg-error-700" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GemstoneDetailPage;