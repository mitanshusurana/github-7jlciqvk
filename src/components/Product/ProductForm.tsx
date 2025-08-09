import React, { useState, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { 
  AnyProduct, 
  ProductType, 
  LooseGemstone, 
  CarvedIdol, 
  JewelryItem,
  CreationMethod,
  ClarityGrade,
  Condition,
  ReservationStatus,
  FinishType,
  CarvingStyle,
  Rarity,
  WorkmanshipGrade,
  JewelryCategory,
  JewelryStyle,
  Metal,
  Hallmark,
  SettingType,
  Warranty
} from '../../types';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  GripVertical,
  X,
  Upload,
  Plus,
  Minus,
  Info,
  Star,
  Calendar,
  DollarSign,
  Package,
  MapPin,
  Tag,
  Gem,
  Palette,
  Ruler,
  Weight,
  Shield,
  Award,
  Hash
} from 'lucide-react';
import ProductIdInput from './ProductIdInput';
import { generateProductId } from '../../utils/idGenerator';

interface ProductFormProps {
  product?: AnyProduct | null;
  onSubmit: (values: AnyProduct) => void;
}

const ItemTypes = {
  MEDIA: 'media',
};

interface DraggableMediaItemProps {
  item: { url: string; type: 'image' | 'video' };
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  removeItem: (index: number) => void;
}

const DraggableMediaItem: React.FC<DraggableMediaItemProps> = ({ 
  item, 
  index, 
  moveItem, 
  removeItem 
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: ItemTypes.MEDIA,
    hover(draggedItem: { index: number }) {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.MEDIA,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={preview} style={{ opacity: isDragging ? 0.5 : 1 }} className="relative">
      <div ref={ref} className="relative group">
        {item.type === 'image' ? (
          <img src={item.url} className="w-24 h-24 object-cover rounded-lg border-2 border-neutral-200" alt="Product" />
        ) : (
          <video src={item.url} className="w-24 h-24 object-cover rounded-lg border-2 border-neutral-200" />
        )}
        <button 
          type="button" 
          onClick={() => removeItem(index)} 
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
        <div className="absolute top-1 left-1 bg-black/50 p-1 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-3 w-3 text-white" />
        </div>
      </div>
    </div>
  );
};

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {
  const [productType, setProductType] = useState<ProductType>(product?.productType || 'LooseStone');
  const [activeTab, setActiveTab] = useState('basic');
  const [isIdValid, setIsIdValid] = useState(false);

  // Generate a unique product ID
  const generateNewProductId = useCallback(() => {
    return generateProductId(productType);
  }, [productType]);

  // Create initial values based on product type
  const createInitialValues = useCallback((): AnyProduct => {
    const baseValues = {
      id: product?.id || (product ? '' : generateNewProductId()),
      name: product?.name || '',
      description: product?.description || '',
      acquisitionDate: product?.acquisitionDate || new Date().toISOString().split('T')[0],
      supplier: product?.supplier || '',
      cost: product?.cost || 0,
      price: product?.price || 0,
      markup: product?.markup || 0,
      storageLocation: product?.storageLocation || '',
      condition: product?.condition || 'New' as Condition,
      reservationStatus: product?.reservationStatus || 'Available' as ReservationStatus,
      seoTitle: product?.seoTitle || '',
      seoDescription: product?.seoDescription || '',
      tags: product?.tags || [],
      categoryHierarchy: product?.categoryHierarchy || '',
      images: product?.images || [],
      videos: product?.videos || [],
      platformIds: {
        shopifyId: product?.platformIds?.shopifyId || '',
        etsyId: product?.platformIds?.etsyId || '',
        ebayId: product?.platformIds?.ebayId || '',
        amazonId: product?.platformIds?.amazonId || '',
        googleShoppingId: product?.platformIds?.googleShoppingId || '',
      },
      auditTrail: product?.auditTrail || [],
      insuranceValue: product?.insuranceValue || 0,
      appraisalDate: product?.appraisalDate || '',
      taxCategory: product?.taxCategory || '',
      inventoryQuantity: product?.inventoryQuantity || 1,
      reorderThreshold: product?.reorderThreshold || 5,
    };

    if (productType === 'LooseStone') {
      return {
        ...baseValues,
        productType: 'LooseStone',
        gemstoneType: (product as LooseGemstone)?.gemstoneType || '',
        variety: (product as LooseGemstone)?.variety || '',
        origin: (product as LooseGemstone)?.origin || '',
        creationMethod: (product as LooseGemstone)?.creationMethod || 'Natural' as CreationMethod,
        certificationId: (product as LooseGemstone)?.certificationId || '',
        caratWeight: (product as LooseGemstone)?.caratWeight ?? 0,
        dimensions: (product as LooseGemstone)?.dimensions || '',
        shape: (product as LooseGemstone)?.shape || '',
        cutGrade: (product as LooseGemstone)?.cutGrade || '',
        colorGrade: (product as LooseGemstone)?.colorGrade || '',
        clarityGrade: (product as LooseGemstone)?.clarityGrade || 'VS1' as ClarityGrade,
        fluorescence: (product as LooseGemstone)?.fluorescence || '',
        polish: (product as LooseGemstone)?.polish || '',
        symmetry: (product as LooseGemstone)?.symmetry || '',
        quantity: (product as LooseGemstone)?.quantity ?? 1,
        lotNumber: (product as LooseGemstone)?.lotNumber || '',
      } as LooseGemstone;
    }

    if (productType === 'CarvedIdol') {
      return {
        ...baseValues,
        productType: 'CarvedIdol',
        material: (product as CarvedIdol)?.material || '',
        culturalSignificance: (product as CarvedIdol)?.culturalSignificance || '',
        deityFigure: (product as CarvedIdol)?.deityFigure || '',
        carvingStyle: (product as CarvedIdol)?.carvingStyle || 'Traditional' as CarvingStyle,
        origin: (product as CarvedIdol)?.origin || '',
        dimensions: (product as CarvedIdol)?.dimensions || '',
        weight: (product as CarvedIdol)?.weight ?? 0,
        finishType: (product as CarvedIdol)?.finishType || 'Polished' as FinishType,
        carvingDetailLevel: (product as CarvedIdol)?.carvingDetailLevel || '',
        baseIncluded: (product as CarvedIdol)?.baseIncluded ?? false,
        colorDescription: (product as CarvedIdol)?.colorDescription || '',
        artisan: (product as CarvedIdol)?.artisan || '',
        carvingTechnique: (product as CarvedIdol)?.carvingTechnique || '',
        agePeriod: (product as CarvedIdol)?.agePeriod || '',
        rarity: (product as CarvedIdol)?.rarity || 'Common' as Rarity,
        workmanshipGrade: (product as CarvedIdol)?.workmanshipGrade || 'Standard' as WorkmanshipGrade,
      } as CarvedIdol;
    }

    // Jewelry
    return {
      ...baseValues,
      productType: 'Jewelry',
      category: (product as JewelryItem)?.category || 'Ring' as JewelryCategory,
      style: (product as JewelryItem)?.style || 'Solitaire' as JewelryStyle,
      brand: (product as JewelryItem)?.brand || '',
      collection: (product as JewelryItem)?.collection || '',
      metal: (product as JewelryItem)?.metal || 'Gold' as Metal,
      metalPurity: (product as JewelryItem)?.metalPurity || '',
      metalWeight: (product as JewelryItem)?.metalWeight ?? 0,
      metalColor: (product as JewelryItem)?.metalColor || '',
      hallmark: (product as JewelryItem)?.hallmark || '14K' as Hallmark,
      plating: (product as JewelryItem)?.plating || '',
      gemstones: (product as JewelryItem)?.gemstones || [],
      ringSize: (product as JewelryItem)?.ringSize ?? 0,
      length: (product as JewelryItem)?.length ?? 0,
      adjustable: (product as JewelryItem)?.adjustable ?? false,
      sizeRange: (product as JewelryItem)?.sizeRange || '',
      laborCost: (product as JewelryItem)?.laborCost ?? 0,
      warranty: (product as JewelryItem)?.warranty || 'None' as Warranty,
    } as JewelryItem;
  }, [product, productType, generateNewProductId]);

  const validationSchema = Yup.object().shape({
    id: Yup.string().required('Product ID is required').matches(
      /^[a-zA-Z0-9_-]+$/,
      'ID can only contain letters, numbers, dashes, and underscores'
    ),
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    cost: Yup.number().min(0, 'Cost must be positive'),
    price: Yup.number().min(0, 'Price must be positive'),
  });

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'physical', label: 'Physical', icon: Ruler },
    { id: 'business', label: 'Business', icon: DollarSign },
    { id: 'media', label: 'Media', icon: Upload },
    { id: 'platform', label: 'Platforms', icon: Package },
    { id: 'compliance', label: 'Compliance', icon: Shield },
  ];

  const renderTabContent = (values: AnyProduct, setFieldValue: any) => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            {/* Product ID Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
                <Hash className="h-4 w-4 mr-2" />
                Product Identification
              </h3>
              <ProductIdInput
                value={values.id}
                onChange={(value) => setFieldValue('id', value)}
                onValidation={(isValid, error) => {
                  setIsIdValid(isValid);
                  if (error) {
                    console.log('ID validation error:', error);
                  }
                }}
                placeholder="Enter unique product ID or scan QR code"
                existingIds={[]} // TODO: This should come from your product service
                generateId={generateNewProductId}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="productType" className="form-label">
                  <Package className="h-4 w-4 inline mr-2" />
                  Product Type
                </label>
                <Field
                  as="select"
                  name="productType"
                  className="form-select"
                  value={productType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const newType = e.target.value as ProductType;
                    setProductType(newType);
                    setFieldValue('productType', newType);
                    // Generate new ID when product type changes for new products
                    if (!product && values.id.includes('-')) {
                      setFieldValue('id', generateNewProductId());
                    }
                  }}
                >
                  <option value="LooseStone">Loose Gemstone</option>
                  <option value="CarvedIdol">Carved Idol</option>
                  <option value="Jewelry">Jewelry</option>
                </Field>
              </div>

              <div className="form-group">
                <label htmlFor="condition" className="form-label">
                  <Star className="h-4 w-4 inline mr-2" />
                  Condition
                </label>
                <Field as="select" name="condition" className="form-select">
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Antique">Antique</option>
                </Field>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <Tag className="h-4 w-4 inline mr-2" />
                Product Name
              </label>
              <Field name="name" className="form-input" placeholder="Enter product name" />
              <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <Field name="description" as="textarea" rows={4} className="form-textarea" placeholder="Detailed product description" />
              <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
            </div>

            {/* Product Type Specific Fields */}
            {productType === 'LooseStone' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label">
                    <Gem className="h-4 w-4 inline mr-2" />
                    Gemstone Type
                  </label>
                  <Field name="gemstoneType" className="form-input" placeholder="e.g., Diamond, Ruby" />
                </div>
                <div className="form-group">
                  <label className="form-label">Variety</label>
                  <Field name="variety" className="form-input" placeholder="e.g., Padparadscha" />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Origin
                  </label>
                  <Field name="origin" className="form-input" placeholder="e.g., Ceylon, Burma" />
                </div>
                <div className="form-group">
                  <label className="form-label">Creation Method</label>
                  <Field as="select" name="creationMethod" className="form-select">
                    <option value="Natural">Natural</option>
                    <option value="Lab-Grown">Lab-Grown</option>
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">Certification ID</label>
                  <Field name="certificationId" className="form-input" placeholder="GIA/SSEF Certificate #" />
                </div>
                <div className="form-group">
                  <label className="form-label">Shape</label>
                  <Field name="shape" className="form-input" placeholder="e.g., Round, Oval" />
                </div>
              </div>
            )}

            {productType === 'CarvedIdol' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label">Material</label>
                  <Field name="material" className="form-input" placeholder="e.g., Jade, Quartz" />
                </div>
                <div className="form-group">
                  <label className="form-label">Cultural Significance</label>
                  <Field name="culturalSignificance" className="form-input" placeholder="e.g., Buddhist, Hindu" />
                </div>
                <div className="form-group">
                  <label className="form-label">Deity/Figure</label>
                  <Field name="deityFigure" className="form-input" placeholder="e.g., Ganesha, Buddha" />
                </div>
                <div className="form-group">
                  <label className="form-label">Carving Style</label>
                  <Field as="select" name="carvingStyle" className="form-select">
                    <option value="Traditional">Traditional</option>
                    <option value="Modern">Modern</option>
                    <option value="Abstract">Abstract</option>
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">Artisan</label>
                  <Field name="artisan" className="form-input" placeholder="Artist name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Rarity</label>
                  <Field as="select" name="rarity" className="form-select">
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                    <option value="Very Rare">Very Rare</option>
                    <option value="Unique">Unique</option>
                  </Field>
                </div>
              </div>
            )}

            {productType === 'Jewelry' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <Field as="select" name="category" className="form-select">
                    <option value="Ring">Ring</option>
                    <option value="Necklace">Necklace</option>
                    <option value="Bracelet">Bracelet</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Pendant">Pendant</option>
                    <option value="Brooch">Brooch</option>
                    <option value="Other">Other</option>
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">Style</label>
                  <Field as="select" name="style" className="form-select">
                    <option value="Solitaire">Solitaire</option>
                    <option value="Halo">Halo</option>
                    <option value="Vintage">Vintage</option>
                    <option value="Modern">Modern</option>
                    <option value="Three-Stone">Three-Stone</option>
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">Metal</label>
                  <Field as="select" name="metal" className="form-select">
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Palladium">Palladium</option>
                    <option value="Titanium">Titanium</option>
                    <option value="Tungsten">Tungsten</option>
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <Field name="brand" className="form-input" placeholder="Brand name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Collection</label>
                  <Field name="collection" className="form-input" placeholder="Collection name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Hallmark</label>
                  <Field as="select" name="hallmark" className="form-select">
                    <option value="925">925 (Sterling Silver)</option>
                    <option value="10K">10K Gold</option>
                    <option value="14K">14K Gold</option>
                    <option value="18K">18K Gold</option>
                    <option value="PT950">PT950 Platinum</option>
                  </Field>
                </div>
              </div>
            )}
          </div>
        );

      case 'physical':
        return (
          <div className="space-y-6">
            {productType === 'LooseStone' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label">
                    <Weight className="h-4 w-4 inline mr-2" />
                    Carat Weight
                  </label>
                  <Field type="number" step="0.01" name="caratWeight" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Ruler className="h-4 w-4 inline mr-2" />
                    Dimensions (mm)
                  </label>
                  <Field name="dimensions" className="form-input" placeholder="L x W x H" />
                </div>
                <div className="form-group">
                  <label className="form-label">Clarity Grade</label>
                  <Field as="select" name="clarityGrade" className="form-select">
                    <option value="FL">FL (Flawless)</option>
                    <option value="IF">IF (Internally Flawless)</option>
                    <option value="VVS1">VVS1</option>
                    <option value="VVS2">VVS2</option>
                    <option value="VS1">VS1</option>
                    <option value="VS2">VS2</option>
                    <option value="SI1">SI1</option>
                    <option value="SI2">SI2</option>
                    <option value="I1">I1</option>
                    <option value="I2">I2</option>
                    <option value="I3">I3</option>
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">Color Grade</label>
                  <Field name="colorGrade" className="form-input" placeholder="e.g., D, E, F" />
                </div>
                <div className="form-group">
                  <label className="form-label">Cut Grade</label>
                  <Field name="cutGrade" className="form-input" placeholder="e.g., Excellent, Very Good" />
                </div>
                <div className="form-group">
                  <label className="form-label">Fluorescence</label>
                  <Field name="fluorescence" className="form-input" placeholder="e.g., None, Faint" />
                </div>
                <div className="form-group">
                  <label className="form-label">Polish</label>
                  <Field name="polish" className="form-input" placeholder="e.g., Excellent" />
                </div>
                <div className="form-group">
                  <label className="form-label">Symmetry</label>
                  <Field name="symmetry" className="form-input" placeholder="e.g., Excellent" />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <Field type="number" name="quantity" className="form-input" />
                </div>
              </div>
            )}

            {productType === 'CarvedIdol' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label">
                    <Ruler className="h-4 w-4 inline mr-2" />
                    Dimensions
                  </label>
                  <Field name="dimensions" className="form-input" placeholder="L x W x H" />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Weight className="h-4 w-4 inline mr-2" />
                    Weight (grams)
                  </label>
                  <Field type="number" step="0.1" name="weight" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Finish Type</label>
                  <Field as="select" name="finishType" className="form-select">
                    <option value="Polished">Polished</option>
                    <option value="Matte">Matte</option>
                    <option value="Brushed">Brushed</option>
                    <option value="Hammered">Hammered</option>
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Palette className="h-4 w-4 inline mr-2" />
                    Color Description
                  </label>
                  <Field name="colorDescription" className="form-input" placeholder="e.g., Deep green" />
                </div>
                <div className="form-group">
                  <label className="form-label">Carving Detail Level</label>
                  <Field name="carvingDetailLevel" className="form-input" placeholder="e.g., High, Medium" />
                </div>
                <div className="form-group">
                  <label className="form-label">Workmanship Grade</label>
                  <Field as="select" name="workmanshipGrade" className="form-select">
                    <option value="Standard">Standard</option>
                    <option value="Fine">Fine</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Masterpiece">Masterpiece</option>
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">Base Included</label>
                  <Field type="checkbox" name="baseIncluded" className="form-checkbox" />
                </div>
                <div className="form-group">
                  <label className="form-label">Carving Technique</label>
                  <Field name="carvingTechnique" className="form-input" placeholder="e.g., Hand carved" />
                </div>
                <div className="form-group">
                  <label className="form-label">Age Period</label>
                  <Field name="agePeriod" className="form-input" placeholder="e.g., Ming Dynasty" />
                </div>
              </div>
            )}

            {productType === 'Jewelry' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="form-group">
                    <label className="form-label">Metal Purity</label>
                    <Field name="metalPurity" className="form-input" placeholder="e.g., 14K, 18K" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <Weight className="h-4 w-4 inline mr-2" />
                      Metal Weight (grams)
                    </label>
                    <Field type="number" step="0.1" name="metalWeight" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Metal Color</label>
                    <Field name="metalColor" className="form-input" placeholder="e.g., Yellow, White, Rose" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Plating</label>
                    <Field name="plating" className="form-input" placeholder="e.g., Rhodium" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ring Size</label>
                    <Field type="number" step="0.5" name="ringSize" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Length (inches)</label>
                    <Field type="number" step="0.1" name="length" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Adjustable</label>
                    <Field type="checkbox" name="adjustable" className="form-checkbox" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Size Range</label>
                    <Field name="sizeRange" className="form-input" placeholder="e.g., 5-8" />
                  </div>
                </div>

                {/* Gemstones in Jewelry */}
                <div className="form-group">
                  <label className="form-label">
                    <Gem className="h-4 w-4 inline mr-2" />
                    Gemstones
                  </label>
                  <FieldArray name="gemstones">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.productType === 'Jewelry' && (values as JewelryItem).gemstones.map((gemstone, index) => (
                          <div key={index} className="border border-neutral-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">Gemstone {index + 1}</h4>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <Field
                                  name={`gemstones.${index}.type`}
                                  className="form-input"
                                  placeholder="Gemstone type"
                                />
                              </div>
                              <div>
                                <Field
                                  name={`gemstones.${index}.caratWeight`}
                                  type="number"
                                  step="0.01"
                                  className="form-input"
                                  placeholder="Carat weight"
                                />
                              </div>
                              <div>
                                <Field
                                  as="select"
                                  name={`gemstones.${index}.settingType`}
                                  className="form-select"
                                >
                                  <option value="Prong">Prong</option>
                                  <option value="Bezel">Bezel</option>
                                  <option value="Pave">Pave</option>
                                  <option value="Channel">Channel</option>
                                  <option value="Invisible">Invisible</option>
                                </Field>
                              </div>
                              <div>
                                <Field
                                  name={`gemstones.${index}.quality`}
                                  className="form-input"
                                  placeholder="Quality grade"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ type: '', caratWeight: 0, settingType: 'Prong', quality: '' })}
                          className="btn-secondary inline-flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Gemstone
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>
            )}
          </div>
        );

      case 'business':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="form-group">
                <label className="form-label">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Acquisition Date
                </label>
                <Field type="date" name="acquisitionDate" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Supplier</label>
                <Field name="supplier" className="form-input" placeholder="Supplier name" />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Storage Location
                </label>
                <Field name="storageLocation" className="form-input" placeholder="e.g., Vault A, Shelf 3" />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <DollarSign className="h-4 w-4 inline mr-2" />
                  Cost
                </label>
                <Field type="number" step="0.01" name="cost" className="form-input" />
                <ErrorMessage name="cost" component="div" className="text-red-600 text-sm mt-1" />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <DollarSign className="h-4 w-4 inline mr-2" />
                  Retail Price
                </label>
                <Field type="number" step="0.01" name="price" className="form-input" />
                <ErrorMessage name="price" component="div" className="text-red-600 text-sm mt-1" />
              </div>
              <div className="form-group">
                <label className="form-label">Markup %</label>
                <Field type="number" step="0.1" name="markup" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Reservation Status</label>
                <Field as="select" name="reservationStatus" className="form-select">
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold</option>
                </Field>
              </div>
              <div className="form-group">
                <label className="form-label">Inventory Quantity</label>
                <Field type="number" name="inventoryQuantity" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Reorder Threshold</label>
                <Field type="number" name="reorderThreshold" className="form-input" />
              </div>
              {productType === 'LooseStone' && (
                <div className="form-group">
                  <label className="form-label">Lot Number</label>
                  <Field name="lotNumber" className="form-input" placeholder="Lot identification" />
                </div>
              )}
              {productType === 'Jewelry' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Labor Cost</label>
                    <Field type="number" step="0.01" name="laborCost" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Warranty</label>
                    <Field as="select" name="warranty" className="form-select">
                      <option value="None">None</option>
                      <option value="1-Year">1 Year</option>
                      <option value="Lifetime">Lifetime</option>
                    </Field>
                  </div>
                </>
              )}
            </div>

            {/* SEO Fields */}
            <div className="border-t border-neutral-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">SEO & Marketing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">SEO Title</label>
                  <Field name="seoTitle" className="form-input" placeholder="SEO optimized title" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category Hierarchy</label>
                  <Field name="categoryHierarchy" className="form-input" placeholder="e.g., Jewelry > Rings > Engagement" />
                </div>
                <div className="form-group md:col-span-2">
                  <label className="form-label">SEO Description</label>
                  <Field name="seoDescription" as="textarea" rows={3} className="form-textarea" placeholder="SEO meta description" />
                </div>
                <div className="form-group md:col-span-2">
                  <label className="form-label">Tags</label>
                  <FieldArray name="tags">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {values.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                              {tag}
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="ml-2 text-primary-600 hover:text-primary-800"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex">
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Add tag"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                if (input.value.trim()) {
                                  push(input.value.trim());
                                  input.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>
            </div>
          </div>
        );

      case 'media':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                <Upload className="h-5 w-5 inline mr-2" />
                Product Media
              </h3>
              
              {/* Image Upload */}
              <div className="form-group">
                <label className="form-label">Images</label>
                <FieldArray name="images">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          className="hidden"
                          id="image-upload"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach(file => push(URL.createObjectURL(file)));
                          }} 
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
                          <p className="text-neutral-600">Click to upload images or drag and drop</p>
                          <p className="text-sm text-neutral-500">PNG, JPG, GIF up to 10MB</p>
                        </label>
                      </div>
                      
                      {values.images.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                          {values.images.map((url, index) => (
                            <DraggableMediaItem
                              key={`image-${index}`}
                              item={{ url, type: 'image' }}
                              index={index}
                              moveItem={(dragIndex, hoverIndex) => {
                                const newImages = [...values.images];
                                const draggedImage = newImages[dragIndex];
                                newImages.splice(dragIndex, 1);
                                newImages.splice(hoverIndex, 0, draggedImage);
                                setFieldValue('images', newImages);
                              }}
                              removeItem={(i) => {
                                const newImages = [...values.images];
                                newImages.splice(i, 1);
                                setFieldValue('images', newImages);
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Video Upload */}
              <div className="form-group">
                <label className="form-label">Videos</label>
                <FieldArray name="videos">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                        <input 
                          type="file" 
                          multiple 
                          accept="video/*"
                          className="hidden"
                          id="video-upload"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach(file => push(URL.createObjectURL(file)));
                          }} 
                        />
                        <label htmlFor="video-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
                          <p className="text-neutral-600">Click to upload videos or drag and drop</p>
                          <p className="text-sm text-neutral-500">MP4, MOV up to 100MB</p>
                        </label>
                      </div>
                      
                      {values.videos.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                          {values.videos.map((url, index) => (
                            <DraggableMediaItem
                              key={`video-${index}`}
                              item={{ url, type: 'video' }}
                              index={index + values.images.length}
                              moveItem={() => {}} // Simplified for now
                              removeItem={(i) => {
                                const newVideos = [...values.videos];
                                newVideos.splice(i, 1);
                                setFieldValue('videos', newVideos);
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>
          </div>
        );

      case 'platform':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">
              <Package className="h-5 w-5 inline mr-2" />
              E-commerce Platform Integration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="form-group">
                <label className="form-label">Shopify ID</label>
                <Field name="platformIds.shopifyId" className="form-input" placeholder="Shopify product ID" />
              </div>
              <div className="form-group">
                <label className="form-label">Etsy ID</label>
                <Field name="platformIds.etsyId" className="form-input" placeholder="Etsy listing ID" />
              </div>
              <div className="form-group">
                <label className="form-label">eBay ID</label>
                <Field name="platformIds.ebayId" className="form-input" placeholder="eBay item ID" />
              </div>
              <div className="form-group">
                <label className="form-label">Amazon ID</label>
                <Field name="platformIds.amazonId" className="form-input" placeholder="Amazon ASIN" />
              </div>
              <div className="form-group">
                <label className="form-label">Google Shopping ID</label>
                <Field name="platformIds.googleShoppingId" className="form-input" placeholder="Google product ID" />
              </div>
            </div>
          </div>
        );

      case 'compliance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">
              <Shield className="h-5 w-5 inline mr-2" />
              Compliance & Insurance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="form-group">
                <label className="form-label">Insurance Value</label>
                <Field type="number" step="0.01" name="insuranceValue" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Appraisal Date</label>
                <Field type="date" name="appraisalDate" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Tax Category</label>
                <Field name="taxCategory" className="form-input" placeholder="e.g., Luxury goods" />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto">
        <Formik
          initialValues={createInitialValues()}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-8">
              {/* Tab Navigation */}
              <div className="border-b border-neutral-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[600px]">
                {renderTabContent(values, setFieldValue)}
              </div>

              {/* Form Actions */}
              <div className="flex justify-between items-center pt-6 border-t border-neutral-200">
                <div className="text-sm text-neutral-500">
                  * Required fields must be completed and ID must be valid before saving
                  {!isIdValid && values.id.trim() && (
                    <div className="text-red-500 mt-1">⚠ Product ID validation required</div>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isIdValid || !values.id.trim()}
                    className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        Save Product
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </DndProvider>
  );
};

export default ProductForm;
