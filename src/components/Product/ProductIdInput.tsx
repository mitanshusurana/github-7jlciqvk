import React, { useState, useRef, useEffect, useCallback } from 'react';
import { QrCode, X, Hash, Check, AlertCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { validateProductIdFormat, extractIdFromQrCode } from '../../utils/idGenerator';

interface ProductIdInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidation?: (isValid: boolean, error?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  existingIds?: string[]; // List of existing product IDs to validate against
  generateId?: () => string; // Function to generate a new ID if needed
}

const ProductIdInput: React.FC<ProductIdInputProps> = ({
  value,
  onChange,
  onValidation,
  placeholder = "Enter product ID or scan QR code",
  disabled = false,
  existingIds = [],
  generateId
}) => {
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'duplicate'>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const runningRef = useRef(false);
  const qrRegionId = "product-id-qr-region";

  // Validation function
  const validateId = useCallback(async (id: string) => {
    if (!id.trim()) {
      setValidationStatus('idle');
      setValidationMessage('');
      onValidation?.(false);
      return;
    }

    setIsValidating(true);

    // Basic format validation
    if (!validateProductIdFormat(id)) {
      setValidationStatus('invalid');
      setValidationMessage('ID must be 3-50 characters: letters, numbers, dashes, and underscores only');
      onValidation?.(false, 'Invalid format');
      setIsValidating(false);
      return;
    }

    // Check for duplicates
    if (existingIds.includes(id)) {
      setValidationStatus('duplicate');
      setValidationMessage('This ID already exists');
      onValidation?.(false, 'Duplicate ID');
      setIsValidating(false);
      return;
    }

    // Valid ID
    setValidationStatus('valid');
    setValidationMessage('ID is available');
    onValidation?.(true);
    setIsValidating(false);
  }, [existingIds, onValidation]);

  // Validate when value changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      validateId(value);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [value, validateId]);

  // QR Scanner cleanup
  const stopAndClearScanner = useCallback(async () => {
    if (qrScannerRef.current) {
      try {
        if (runningRef.current) await qrScannerRef.current.stop();
        await qrScannerRef.current.clear();
      } catch (err) {
        console.warn('Error stopping QR scanner:', err);
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

  // QR Scanner effect
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

                // Extract ID from URL or use as-is
                const extractedId = extractIdFromQrCode(decodedText);

                onChange(extractedId);
                setShowQrScanner(false);
                toast.success('QR code scanned successfully!');
              },
              (errorMessage) => {
                // Scan error, ignore
              }
            );
            runningRef.current = true;
          } catch (err) {
            console.error('Error starting QR scanner:', err);
            const error = err as Error;
            if (error.name === 'NotAllowedError') {
              toast.error('Camera permission denied. Please allow camera access and try again.');
            } else if (error.name === 'NotFoundError') {
              toast.error('No camera found on this device.');
            } else if (error.name === 'NotSupportedError') {
              toast.error('Camera not supported on this device.');
            } else {
              toast.error('Failed to start camera. Please check permissions and try again.');
            }
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
  }, [showQrScanner, onChange, stopAndClearScanner]);

  const handleGenerateId = () => {
    if (generateId) {
      const newId = generateId();
      onChange(newId);
      toast.success('New ID generated');
    }
  };

  const getStatusIcon = () => {
    if (isValidating) {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
    }
    
    switch (validationStatus) {
      case 'valid':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'invalid':
      case 'duplicate':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getInputClasses = () => {
    const baseClasses = "form-input pr-24";
    
    switch (validationStatus) {
      case 'valid':
        return `${baseClasses} border-green-300 focus:border-green-500 focus:ring-green-500`;
      case 'invalid':
      case 'duplicate':
        return `${baseClasses} border-red-300 focus:border-red-500 focus:ring-red-500`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="space-y-3">
      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Hash className="h-4 w-4 text-neutral-400" />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${getInputClasses()} pl-10`}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {/* Status Icon */}
          <div className="pr-2">
            {getStatusIcon()}
          </div>
          
          {/* QR Scanner Button */}
          <button
            type="button"
            onClick={() => setShowQrScanner(!showQrScanner)}
            disabled={disabled}
            className="p-2 text-neutral-400 hover:text-neutral-600 disabled:opacity-50"
            title="Scan QR Code"
          >
            <QrCode className="h-4 w-4" />
          </button>
          
          {/* Generate ID Button */}
          {generateId && (
            <button
              type="button"
              onClick={handleGenerateId}
              disabled={disabled}
              className="p-2 mr-2 text-neutral-400 hover:text-neutral-600 disabled:opacity-50"
              title="Generate New ID"
            >
              <Hash className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Validation Message */}
      {validationMessage && (
        <div className={`text-sm flex items-center ${
          validationStatus === 'valid' ? 'text-green-600' : 'text-red-600'
        }`}>
          {validationStatus === 'valid' ? (
            <Check className="h-3 w-3 mr-1" />
          ) : (
            <AlertCircle className="h-3 w-3 mr-1" />
          )}
          {validationMessage}
        </div>
      )}

      {/* QR Scanner */}
      {showQrScanner && (
        <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-neutral-900">Scan QR Code</h3>
            <button
              type="button"
              onClick={() => setShowQrScanner(false)}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex justify-center">
            <div id={qrRegionId} style={{ width: 300 }} />
          </div>
          
          <div className="mt-4 text-xs text-neutral-500 text-center">
            Position the QR code within the frame to scan automatically
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-neutral-500">
        <div className="flex flex-wrap gap-4">
          <span>• Type a unique product ID</span>
          <span>• Click <QrCode className="h-3 w-3 inline mx-1" /> to scan QR code</span>
          {generateId && <span>• Click <Hash className="h-3 w-3 inline mx-1" /> to generate ID</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductIdInput;
