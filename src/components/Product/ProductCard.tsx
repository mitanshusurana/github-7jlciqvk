import React from 'react';
import { Link } from 'react-router-dom';
import { AnyProduct } from '../../types';
import { Eye, Edit, QrCode, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface ProductCardProps {
  product: AnyProduct;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const { id, name, images, acquisitionDate } = product;
  
  const primaryImage = images.length > 0 
    ? images[0] 
    : 'https://via.placeholder.com/150';

  return (
    <div className="card group">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={primaryImage} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex space-x-2">
            <Link 
              to={`/product/${id}`}
              className="btn bg-white/90 hover:bg-white text-neutral-800 p-2 rounded-full"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link 
              to={`/product/${id}/edit`}
              className="btn bg-white/90 hover:bg-white text-neutral-800 p-2 rounded-full"
              title="Edit product"
            >
              <Edit className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading font-semibold text-lg text-neutral-900 truncate">
              {name}
            </h3>
            <div className="flex items-center text-sm text-neutral-500 mt-1">
              <span>{product.productType}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-neutral-500">
            Acquired {format(new Date(acquisitionDate), 'MMM d, yyyy')}
          </div>
          <Link
            to={`/product/${id}`}
            className="text-xs font-medium text-primary-600 hover:text-primary-800 flex items-center"
          >
            View details
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;