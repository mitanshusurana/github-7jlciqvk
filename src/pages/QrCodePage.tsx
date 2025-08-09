import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Share2 } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';

const QrCodePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct } = useProducts();
  const qrRef = useRef<any>(null);
  const [product, setProduct] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(id)
      .then((data: any) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id, getProduct]);

  if (!id) {
    return <div>Invalid product ID</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return (
      <div className="container-page flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Product Not Found</h1>
          <p className="text-neutral-500 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/inventory" className="btn-primary">
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  // The URL you want to encode in the QR code
  const qrValue = window.location.origin + `/product/${product.id}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    try {
      const canvas = qrRef.current;
      if (!canvas) throw new Error('QR code not rendered');
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${product.name.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrValue);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="container-page">
      {/* Back button */}
      <Link 
        to={`/product/${id}`}
        className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Product
      </Link>
      
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">{product.name} - QR Code</h1>
          <p className="text-neutral-500">
            Scan this QR code to quickly access the product details
          </p>
        </div>
        
        <div className="card p-8 flex flex-col items-center">
          {/* QR Code */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-neutral-200 mb-6">
            <QRCodeCanvas
              value={qrValue}
              size={256}
              includeMargin={true}
          
            />
          </div>
          
          {/* Product summary */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">{product.name}</h2>
            <div className="text-neutral-600">
              <p>{product.type} • {product.weight} ct</p>
              <p className="text-sm text-neutral-500 mt-1">{product.id}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handlePrint}
              className="btn-outline flex items-center"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            
            <button
              onClick={handleDownload}
              className="btn-outline flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
            
            <button
              onClick={handleCopyLink}
              className="btn-outline flex items-center"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-primary-50 border border-primary-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-primary-800 mb-2">How to use this QR code:</h3>
          <ul className="text-sm text-primary-700 space-y-2">
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-primary-200 text-primary-800 text-xs flex items-center justify-center mr-2 mt-0.5">1</span>
              Print this QR code and attach it to the product container or documentation
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-primary-200 text-primary-800 text-xs flex items-center justify-center mr-2 mt-0.5">2</span>
              Scan the code with any QR code scanner or smartphone camera
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-primary-200 text-primary-800 text-xs flex items-center justify-center mr-2 mt-0.5">3</span>
              Access detailed information about this product instantly
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QrCodePage;