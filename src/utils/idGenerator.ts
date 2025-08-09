import { ProductType } from '../types';

/**
 * Generates a unique product ID based on product type and current timestamp
 */
export const generateProductId = (productType: ProductType): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const timestamp = now.getTime().toString().slice(-4);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  
  // Product type prefixes
  const typePrefix = {
    'LooseStone': 'GEM',
    'CarvedIdol': 'ART', 
    'Jewelry': 'JWL'
  }[productType];
  
  return `${typePrefix}-${year}${month}${day}-${timestamp}${random}`;
};

/**
 * Validates product ID format
 */
export const validateProductIdFormat = (id: string): boolean => {
  if (!id || id.trim().length === 0) return false;
  
  // Must be alphanumeric with dashes and underscores only
  const formatRegex = /^[a-zA-Z0-9_-]+$/;
  if (!formatRegex.test(id)) return false;
  
  // Must be between 3 and 50 characters
  if (id.length < 3 || id.length > 50) return false;
  
  return true;
};

/**
 * Extracts product ID from QR code URL or returns the string as-is
 */
export const extractIdFromQrCode = (scannedText: string): string => {
  try {
    // Try to parse as URL first
    const url = new URL(scannedText);
    const pathParts = url.pathname.split('/');
    const productIndex = pathParts.indexOf('product');
    
    if (productIndex !== -1 && pathParts[productIndex + 1]) {
      return pathParts[productIndex + 1];
    }
  } catch {
    // Not a URL, could be a direct ID
  }
  
  // Return as-is if not a URL or no product ID found in URL
  return scannedText.trim();
};

/**
 * Suggests alternative IDs if the current one is taken
 */
export const suggestAlternativeIds = (baseId: string, existingIds: string[]): string[] => {
  const suggestions: string[] = [];
  const cleanBase = baseId.replace(/[-_]\d+$/, ''); // Remove trailing numbers
  
  for (let i = 1; i <= 5; i++) {
    const suggestion = `${cleanBase}-${i.toString().padStart(2, '0')}`;
    if (!existingIds.includes(suggestion)) {
      suggestions.push(suggestion);
    }
  }
  
  return suggestions;
};
