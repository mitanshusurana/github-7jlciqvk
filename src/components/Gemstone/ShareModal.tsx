import React from 'react';
import { X, Instagram, MessageSquare } from 'lucide-react';

interface ShareModalProps {
  onClose: () => void;
  productName: string;
  productUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, productName, productUrl }) => {
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Check out this amazing gemstone: ${productName}\n\n${productUrl}`
  )}`;

  const instagramShareUrl = `https://www.instagram.com/`; // Instagram sharing is more complex and usually requires their API

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Share Product</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full flex items-center justify-center"
          >
            <MessageSquare className="h-5 w-5 mr-2" /> Share on WhatsApp
          </a>
          <a
            href={instagramShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full flex items-center justify-center"
          >
            <Instagram className="h-5 w-5 mr-2" /> Share on Instagram
          </a>
          <p className="text-xs text-neutral-500 text-center">
            Note: Instagram sharing from web is limited. It's best to share from the mobile app.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
