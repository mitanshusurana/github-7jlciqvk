import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, QrCode } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import useProducts from '../hooks/useProducts';
import ProductGrid from '../components/Product/ProductGrid';
import ProductFilter from '../components/Product/ProductFilter';
import { FilterParams } from '../types';
import {
  DESIGN_TYPES,
  PRECIOUS_METALS,
} from '../utils/constants';

const InventoryPage: React.FC = () => {
  const { 
    products,
    loading, 
    hasMore, 
    loadMore, 
    setFilters,
  } = useProducts();
  
  const [showQrScanner, setShowQrScanner] = useState(false);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const runningRef = useRef(false);
  const qrRegionId = "inventory-qr-region";
  const navigate = useNavigate();

  const handleFilterChange = (filters: FilterParams) => {
    setFilters(filters);
  };

  // Helper to stop and clear scanner
  const stopAndClearScanner = useCallback(async () => {
    if (qrScannerRef.current) {
      try {
        if (runningRef.current) await qrScannerRef.current.stop();
        await qrScannerRef.current.clear();
      } catch (err) {
        // ignore
      } finally {
        qrScannerRef.current = null;
        runningRef.current = false;
      }
    }
  }, []);

  // Clean up QR scanner on unmount
  useEffect(() => {
    return () => {
      stopAndClearScanner();
    };
  }, [stopAndClearScanner]);

  // Only start/stop scanner when showQrScanner changes
  useEffect(() => {
    let cancelled = false;
    const startScanner = async () => {
      if (showQrScanner && !qrScannerRef.current) {
        const region = document.getElementById(qrRegionId);
        if (region) {
          const scanner = new Html5Qrcode(qrRegionId);
          qrScannerRef.current = scanner;
          try {
            await scanner.start(
              { facingMode: 'environment' },
              { fps: 10, qrbox: 250 },
              async (decodedText) => {
                if (cancelled) return;
                console.log('QR decoded value:', decodedText);
                setShowQrScanner(false);
                navigate(`/product/${decodedText}`);
                setTimeout(() => {
                  stopAndClearScanner();
                }, 300);
              },
              () => {}
            );
            runningRef.current = true;
          } catch (err) {
            setShowQrScanner(false);
            qrScannerRef.current = null;
            runningRef.current = false;
          }
        }
      }
      if (!showQrScanner && qrScannerRef.current && runningRef.current) {
        stopAndClearScanner();
      }
    };
    startScanner();
    return () => {
      cancelled = true;
    };
  }, [showQrScanner, navigate, stopAndClearScanner]);

  return (
    <div className="container-page">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Product Inventory</h1>
          <p className="mt-1 text-neutral-500">
            Browse, search, and manage your product collection
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          {/* QR Scanner Button */}
          <button
            type="button"
            className="btn-outline flex items-center"
            onClick={() => setShowQrScanner((prev) => !prev)}
            title="Scan QR"
          >
            <QrCode className="h-5 w-5 mr-1" />
            Scan QR
          </button>
          <Link
            to="/product/new"
            className="btn-primary flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* QR Scanner UI (always mounted, just hidden when not in use) */}
      <div className="mb-4 flex flex-col items-center" style={{ display: showQrScanner ? 'flex' : 'none' }}>
        <div id={qrRegionId} style={{ width: 300 }} />
        <button
          type="button"
          className="btn-outline mt-2"
          onClick={() => setShowQrScanner(false)}
        >
          Close Scanner
        </button>
      </div>

      {/* Filters */}
      <ProductFilter
        onFilterChange={handleFilterChange}
        categories={DESIGN_TYPES}
        styles={DESIGN_TYPES}
        metals={PRECIOUS_METALS}
      />
      
      {/* Grid view */}
      <ProductGrid
        products={products.content ?? []}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
};

export default InventoryPage;