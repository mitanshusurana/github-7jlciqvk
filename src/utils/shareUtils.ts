// Enhanced sharing utilities for trade purposes
import { Gemstone } from '../types';
import { formatCurrency, formatWeight, formatDimensions } from './formatters';

export interface ShareOptions {
  includeImages: boolean;
  includeVideo: boolean;
  includeTradeDetails: boolean;
  includePricing: boolean;
  includeSpecs: boolean;
  customMessage?: string;
}

export const generateTradeCaption = (gemstone: Gemstone, options: ShareOptions = {
  includeImages: true,
  includeVideo: true,
  includeTradeDetails: true,
  includePricing: true,
  includeSpecs: true
}): string => {
  const lines: string[] = [];
  
  // Header with item name and type
  lines.push(`💎 ${gemstone.name.toUpperCase()} 💎`);
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Basic Information
  lines.push(`📋 ITEM DETAILS:`);
  lines.push(`• Category: ${gemstone.category}`);
  if (gemstone.subCategory) {
    lines.push(`• Sub-Category: ${gemstone.subCategory}`);
  }
  if (gemstone.itemType) {
    lines.push(`• Item Type: ${gemstone.itemType}`);
  }
  lines.push(`• Type: ${gemstone.type}`);
  lines.push(`• Weight: ${formatWeight(gemstone.weight)}`);
  
  if (options.includeSpecs) {
    lines.push('');
    lines.push(`🔍 SPECIFICATIONS:`);
    lines.push(`• Dimensions: ${formatDimensions(gemstone.dimensions)}`);
    lines.push(`• Color: ${gemstone.color}`);
    lines.push(`• Clarity: ${gemstone.clarity}`);
    lines.push(`• Cut: ${gemstone.cut}`);
    lines.push(`• Origin: ${gemstone.origin}`);
    
    if (gemstone.treatment) {
      lines.push(`• Treatment: ${gemstone.treatment}`);
    }
    
    if (gemstone.certification) {
      lines.push(`• Certification: ${gemstone.certification}`);
    }
  }
  
  // Item-specific details
  if (gemstone.itemSpecificDetails && Object.keys(gemstone.itemSpecificDetails).length > 0) {
    lines.push('');
    lines.push(`⚙️ ADDITIONAL DETAILS:`);
    
    const details = gemstone.itemSpecificDetails;
    if (details.purity) lines.push(`• Purity: ${details.purity}`);
    if (details.metalType) lines.push(`• Metal Type: ${details.metalType}`);
    if (details.numberOfPieces) lines.push(`• Number of Pieces: ${details.numberOfPieces}`);
    if (details.totalWeight) lines.push(`• Total Weight: ${details.totalWeight}`);
    if (details.averageWeight) lines.push(`• Average Weight: ${details.averageWeight}`);
    if (details.size) lines.push(`• Size: ${details.size}`);
    if (details.setting) lines.push(`• Setting: ${details.setting}`);
    if (details.shape) lines.push(`• Shape: ${details.shape}`);
    if (details.quality) lines.push(`• Quality: ${details.quality}`);
    if (details.carving) lines.push(`• Carving: ${details.carving}`);
    if (details.artisan) lines.push(`• Artisan: ${details.artisan}`);
    if (details.style) lines.push(`• Style: ${details.style}`);
  }
  
  if (options.includePricing && (gemstone.acquisitionPrice || gemstone.estimatedValue)) {
    lines.push('');
    lines.push(`💰 PRICING INFORMATION:`);
    if (gemstone.acquisitionPrice) {
      lines.push(`• Acquisition Price: ${formatCurrency(gemstone.acquisitionPrice)}`);
    }
    if (gemstone.estimatedValue) {
      lines.push(`• Estimated Value: ${formatCurrency(gemstone.estimatedValue)}`);
    }
  }
  
  if (options.includeTradeDetails) {
    lines.push('');
    lines.push(`📊 TRADE DETAILS:`);
    lines.push(`• Item ID: ${gemstone.id}`);
    if (gemstone.acquisitionDate) {
      lines.push(`• Acquisition Date: ${gemstone.acquisitionDate}`);
    }
    if (gemstone.seller) {
      lines.push(`• Source: ${gemstone.seller}`);
    }
  }
  
  // Media information
  if (options.includeImages && gemstone.images.length > 0) {
    lines.push('');
    lines.push(`📸 MEDIA AVAILABLE:`);
    lines.push(`• ${gemstone.images.length} High-Quality Images`);
    if (options.includeVideo && gemstone.video) {
      lines.push(`• Video Available`);
    }
  }
  
  // Notes
  if (gemstone.notes) {
    lines.push('');
    lines.push(`📝 NOTES:`);
    lines.push(gemstone.notes);
  }
  
  // Tags
  if (gemstone.tags && gemstone.tags.length > 0) {
    lines.push('');
    lines.push(`🏷️ TAGS:`);
    lines.push(`#${gemstone.tags.join(' #')}`);
  }
  
  // Custom message
  if (options.customMessage) {
    lines.push('');
    lines.push(`💬 MESSAGE:`);
    lines.push(options.customMessage);
  }
  
  // Footer
  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('📞 Contact for more details');
  lines.push('🔗 Full details: ' + window.location.href);
  
  return lines.join('\n');
};

export const generateWhatsAppMessage = (gemstone: Gemstone, options: ShareOptions): string => {
  const caption = generateTradeCaption(gemstone, options);
  
  // Add media URLs if available
  let mediaText = '';
  if (options.includeImages && gemstone.images.length > 0) {
    mediaText += '\n\n📸 IMAGES:\n';
    gemstone.images.forEach((url, index) => {
      mediaText += `${index + 1}. ${url}\n`;
    });
  }
  
  if (options.includeVideo && gemstone.video) {
    mediaText += '\n🎥 VIDEO:\n';
    mediaText += gemstone.video;
  }
  
  return caption + mediaText;
};

export const generateInstagramCaption = (gemstone: Gemstone, options: ShareOptions): string => {
  const lines: string[] = [];
  
  // Instagram-optimized caption with emojis
  lines.push(`✨ ${gemstone.name.toUpperCase()} ✨`);
  lines.push('');
  
  // Key details in Instagram style
  lines.push(`💎 ${gemstone.type} | ${formatWeight(gemstone.weight)}`);
  lines.push(`🎨 ${gemstone.color} | ${gemstone.clarity}`);
  lines.push(`✂️ ${gemstone.cut} | 📍 ${gemstone.origin}`);
  
  if (options.includePricing && gemstone.estimatedValue) {
    lines.push(`💰 ${formatCurrency(gemstone.estimatedValue)}`);
  }
  
  if (gemstone.notes) {
    lines.push('');
    lines.push(gemstone.notes);
  }
  
  // Instagram hashtags
  lines.push('');
  const hashtags = [
    '#gemstone',
    '#jewelry',
    '#precious',
    '#luxury',
    '#investment',
    `#${gemstone.type.toLowerCase().replace(/\s+/g, '')}`,
    `#${gemstone.color.toLowerCase()}`,
    `#${gemstone.origin.toLowerCase().replace(/\s+/g, '')}`,
    ...gemstone.tags.map(tag => `#${tag.toLowerCase().replace(/\s+/g, '')}`)
  ];
  
  lines.push(hashtags.slice(0, 30).join(' ')); // Instagram limit
  
  return lines.join('\n');
};

export const generateEmailContent = (gemstone: Gemstone, options: ShareOptions): { subject: string; body: string } => {
  const subject = `${gemstone.name} - ${gemstone.type} | ${formatWeight(gemstone.weight)}`;
  
  const body = `
Dear Valued Client,

I hope this email finds you well. I wanted to share details about an exceptional piece that might interest you:

${generateTradeCaption(gemstone, options)}

${options.includeImages && gemstone.images.length > 0 ? `

IMAGES:
${gemstone.images.map((url, index) => `${index + 1}. ${url}`).join('\n')}
` : ''}

${options.includeVideo && gemstone.video ? `

VIDEO:
${gemstone.video}
` : ''}

Please feel free to contact me if you would like more information or to schedule a viewing.

Best regards,
[Your Name]
[Your Contact Information]

---
This email was generated from our inventory management system.
Full details: ${window.location.href}
  `.trim();
  
  return { subject, body };
};

export const downloadMediaAsZip = async (gemstone: Gemstone): Promise<void> => {
  // This would require a zip library like JSZip
  // For now, we'll provide individual download links
  const mediaUrls = [...gemstone.images];
  if (gemstone.video) mediaUrls.push(gemstone.video);
  
  if (mediaUrls.length === 0) {
    throw new Error('No media files available for download');
  }
  
  // Create a simple HTML page with download links
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${gemstone.name} - Media Downloads</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .media-item { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .download-btn { background: #007bff; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>${gemstone.name} - Media Files</h1>
      <p>Right-click on the links below and select "Save link as..." to download the files.</p>
      
      ${gemstone.images.map((url, index) => `
        <div class="media-item">
          <h3>Image ${index + 1}</h3>
          <img src="${url}" style="max-width: 200px; max-height: 200px;" />
          <br><br>
          <a href="${url}" download="${gemstone.name.replace(/\s+/g, '-')}-image-${index + 1}.jpg" class="download-btn">Download Image ${index + 1}</a>
        </div>
      `).join('')}
      
      ${gemstone.video ? `
        <div class="media-item">
          <h3>Video</h3>
          <video src="${gemstone.video}" controls style="max-width: 300px;"></video>
          <br><br>
          <a href="${gemstone.video}" download="${gemstone.name.replace(/\s+/g, '-')}-video.mp4" class="download-btn">Download Video</a>
        </div>
      ` : ''}
      
      <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px;">
        <h3>Item Details</h3>
        <pre>${generateTradeCaption(gemstone, { includeImages: true, includeVideo: true, includeTradeDetails: true, includePricing: true, includeSpecs: true })}</pre>
      </div>
    </body>
    </html>
  `;
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${gemstone.name.replace(/\s+/g, '-')}-media-package.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};