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
import { useEffect } from 'react';
import { uploadService } from '../../services/uploadService';
import toast from 'react-hot-toast';
import {
  GEMSTONE_TYPES,
  GEMSTONE_VARIETIES,
  GEMSTONE_ORIGINS,
  GEMSTONE_SHAPES,
  CUT_GRADES,
  COLOR_GRADES,
  POLISH_GRADES,
  SYMMETRY_GRADES,
  FLUORESCENCE_LEVELS,
  FLUORESCENCE_COLORS,
  CARVING_MATERIALS,
  CULTURAL_ORIGINS,
  DEITY_FIGURES,
  CARVING_TECHNIQUES,
  AGE_PERIODS,
  METAL_COLORS,
  METAL_PURITIES,
  PLATING_OPTIONS,
  CRAFTING_TECHNIQUES,
  SUPPLIERS,
  STORAGE_LOCATIONS,
  TAX_CATEGORIES,
  CERTIFICATION_LABS,
  TREATMENT_TYPES
} from '../../utils/formConstants';

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
  const [isIdValid, setIsIdValid] = useState(false);

  // Generate a unique product ID
  const generateNewProductId = useCallback(() => {
    return generateProductId(productType);
  }, [productType]);

  // Create initial values based on product type
  const createInitialValues = useCallback((type: ProductType): AnyProduct => {
    const baseValues = {
      id: product?.id || '',
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
        certificationLab: (product as LooseGemstone)?.certificationLab || '',
        treatmentType: (product as LooseGemstone)?.treatmentType || '',
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
    name: Yup.string(),
    description: Yup.string(),
    cost: Yup.number().min(0, 'Cost must be positive'),
    price: Yup.number().min(0, 'Price must be positive'),
  });

  const generateProductName = (values: AnyProduct) => {
    switch (values.productType) {
      case 'LooseStone':
        const ls = values as LooseGemstone;
        return [ls.gemstoneType, ls.variety, ls.shape, `${ls.caratWeight}ct`].filter(Boolean).join(' ');
      case 'CarvedIdol':
        const ci = values as CarvedIdol;
        return [ci.material, ci.deityFigure, 'Idol'].filter(Boolean).join(' ');
      case 'Jewelry':
        const ji = values as JewelryItem;
        return [ji.metal, ji.category, ji.style].filter(Boolean).join(' ');
      default:
        return '';
    }
  };

  const renderFormContent = (values: AnyProduct, setFieldValue: any, setValues: (values: React.SetStateAction<AnyProduct>) => void) => {
    useEffect(() => {
      const newName = generateProductName(values);
      if (newName) {
        setFieldValue('name', newName);
      }
    }, [values, setFieldValue]);

    return (
      <>
        {/* Basic Info Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 border-b pb-2">Basic Info</h2>
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
                  const preservedId = values.id;
                  setProductType(newType);

                  const newInitialValues = createInitialValues(newType);

                  setValues({
                    ...newInitialValues,
                    id: preservedId,
                  });
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
              <Field name="name" className="form-input" placeholder="Enter product name" readOnly />
            <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <Field name="description" as="textarea" rows={4} className="form-textarea" placeholder="Detailed product description" />
            <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
          </div>

          {/* Product Type Specific Fields */}
          {productType === 'LooseStone' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label">
                    <Gem className="h-4 w-4 inline mr-2" />
                    Gemstone Type
                  </label>
                  <Field as="select" name="gemstoneType" className="form-select">
                    <option value="">Select gemstone type</option>
                    {GEMSTONE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">Variety</label>
                  <Field as="select" name="variety" className="form-select">
                    <option value="">Select variety</option>
                    {values.productType === 'LooseStone' &&
                     values.gemstoneType &&
                     GEMSTONE_VARIETIES[values.gemstoneType as keyof typeof GEMSTONE_VARIETIES] ?
                     GEMSTONE_VARIETIES[values.gemstoneType as keyof typeof GEMSTONE_VARIETIES].map(variety => (
                      <option key={variety} value={variety}>{variety}</option>
                    )) : null}
                    <option value="Other">Other (specify in description)</option>
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Origin
                  </label>
                  <Field as="select" name="origin" className="form-select">
                    <option value="">Select origin</option>
                    {GEMSTONE_ORIGINS.map(origin => (
                      <option key={origin} value={origin}>{origin}</option>
                    ))}
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">Creation Method</label>
                  <Field as="select" name="creationMethod" className="form-select">
                    <option value="Natural">Natural</option>
                    <option value="Lab-Grown">Lab-Grown</option>
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">Shape</label>
                  <Field as="select" name="shape" className="form-select">
                    <option value="">Select shape</option>
                    {GEMSTONE_SHAPES.map(shape => (
                      <option key={shape} value={shape}>{shape}</option>
                    ))}
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">Certification Lab</label>
                  <Field as="select" name="certificationLab" className="form-select">
                    <option value="">Select certification lab</option>
                    {CERTIFICATION_LABS.map(lab => (
                      <option key={lab} value={lab}>{lab}</option>
                    ))}
                  </Field>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Certification ID</label>
                <Field name="certificationId" className="form-input" placeholder="Certificate number (e.g., GIA-1234567890)" />
              </div>
            </div>
          )}

          {productType === 'CarvedIdol' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="form-group">
                <label className="form-label">Material</label>
                <Field as="select" name="material" className="form-select">
                  <option value="">Select material</option>
                  {CARVING_MATERIALS.map(material => (
                    <option key={material} value={material}>{material}</option>
                  ))}
                </Field>
              </div>
              <div className="form-group">
                  <label className="form-label">Cultural Significance</label>
                <Field as="select" name="culturalSignificance" className="form-select">
                    <option value="">Select cultural significance</option>
                  {CULTURAL_ORIGINS.map(culture => (
                    <option key={culture} value={culture}>{culture}</option>
                  ))}
                </Field>
              </div>
              <div className="form-group">
                <label className="form-label">Deity/Figure</label>
                <Field as="select" name="deityFigure" className="form-select">
                  <option value="">Select deity/figure</option>
                  {DEITY_FIGURES.map(deity => (
                    <option key={deity} value={deity}>{deity}</option>
                  ))}
                </Field>
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
                <label className="form-label">Carving Technique</label>
                <Field as="select" name="carvingTechnique" className="form-select">
                  <option value="">Select technique</option>
                  {CARVING_TECHNIQUES.map(technique => (
                    <option key={technique} value={technique}>{technique}</option>
                  ))}
                </Field>
              </div>
              <div className="form-group">
                <label className="form-label">Age Period</label>
                <Field as="select" name="agePeriod" className="form-select">
                  <option value="">Select age period</option>
                  {AGE_PERIODS.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </Field>
              </div>
              <div className="form-group">
                <label className="form-label">Artisan</label>
                <Field name="artisan" className="form-input" placeholder="Artist name (if known)" />
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
              <div className="form-group">
                  <label className="form-label">Geographic Origin</label>
                  <Field name="origin" className="form-input" placeholder="e.g., India, China" />
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

        {/* Physical Section */}
        <div className="space-y-6 pt-8 mt-8 border-t">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 border-b pb-2">Physical Attributes</h2>
          {productType === 'LooseStone' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label">
                    <Weight className="h-4 w-4 inline mr-2" />
                    Carat Weight
                  </label>
                  <Field type="number" step="0.01" name="caratWeight" className="form-input" placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Ruler className="h-4 w-4 inline mr-2" />
                    Dimensions (mm)
                  </label>
                  <Field name="dimensions" className="form-input" placeholder="L x W x H (e.g., 10.5 x 8.2 x 5.1)" />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <Field type="number" name="quantity" className="form-input" placeholder="1" />
                </div>
              </div>

              {/* Grading Section */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-neutral-900 mb-4">Grading & Quality</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="form-group">
                    <label className="form-label">Clarity Grade</label>
                    <Field as="select" name="clarityGrade" className="form-select">
                      <option value="FL">FL (Flawless)</option>
                      <option value="IF">IF (Internally Flawless)</option>
                      <option value="VVS1">VVS1 (Very Very Slightly Included 1)</option>
                      <option value="VVS2">VVS2 (Very Very Slightly Included 2)</option>
                      <option value="VS1">VS1 (Very Slightly Included 1)</option>
                      <option value="VS2">VS2 (Very Slightly Included 2)</option>
                      <option value="SI1">SI1 (Slightly Included 1)</option>
                      <option value="SI2">SI2 (Slightly Included 2)</option>
                      <option value="I1">I1 (Included 1)</option>
                      <option value="I2">I2 (Included 2)</option>
                      <option value="I3">I3 (Included 3)</option>
                    </Field>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Color Grade</label>
                    <Field as="select" name="colorGrade" className="form-select">
                      <option value="">Select color grade</option>
                      {values.productType === 'LooseStone' &&
                       values.gemstoneType &&
                       COLOR_GRADES[values.gemstoneType as keyof typeof COLOR_GRADES] ?
                       COLOR_GRADES[values.gemstoneType as keyof typeof COLOR_GRADES].map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      )) :
                       COLOR_GRADES.Other.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </Field>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cut Grade</label>
                    <Field as="select" name="cutGrade" className="form-select">
                      <option value="">Select cut grade</option>
                      {CUT_GRADES.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </Field>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Polish</label>
                    <Field as="select" name="polish" className="form-select">
                      <option value="">Select polish grade</option>
                      {POLISH_GRADES.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </Field>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Symmetry</label>
                    <Field as="select" name="symmetry" className="form-select">
                      <option value="">Select symmetry grade</option>
                      {SYMMETRY_GRADES.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </Field>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fluorescence Level</label>
                    <Field as="select" name="fluorescence" className="form-select">
                      <option value="">Select fluorescence</option>
                      {FLUORESCENCE_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </Field>
                  </div>
                </div>
              </div>

              {/* Treatment Information */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-neutral-900 mb-4">Treatment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Treatment Type</label>
                    <Field as="select" name="treatmentType" className="form-select">
                      <option value="">Select treatment</option>
                      {TREATMENT_TYPES.map(treatment => (
                        <option key={treatment} value={treatment}>{treatment}</option>
                      ))}
                    </Field>
                  </div>
                </div>
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
            </div>
          )}

          {productType === 'Jewelry' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label">Metal Purity</label>
                  <Field as="select" name="metalPurity" className="form-select">
                    <option value="">Select purity</option>
                    {values.productType === 'Jewelry' &&
                     values.metal &&
                     METAL_PURITIES[values.metal as keyof typeof METAL_PURITIES] ?
                     METAL_PURITIES[values.metal as keyof typeof METAL_PURITIES].map(purity => (
                      <option key={purity} value={purity}>{purity}</option>
                    )) :
                     METAL_PURITIES.Other.map(purity => (
                      <option key={purity} value={purity}>{purity}</option>
                    ))}
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Weight className="h-4 w-4 inline mr-2" />
                    Metal Weight (grams)
                  </label>
                  <Field type="number" step="0.1" name="metalWeight" className="form-input" placeholder="0.0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Metal Color</label>
                  <Field as="select" name="metalColor" className="form-select">
                    <option value="">Select metal color</option>
                    {METAL_COLORS.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </Field>
                </div>
                <div className="form-group">
                  <label className="form-label">Plating</label>
                  <Field as="select" name="plating" className="form-select">
                    <option value="">Select plating</option>
                    {PLATING_OPTIONS.map(plating => (
                      <option key={plating} value={plating}>{plating}</option>
                    ))}
                  </Field>
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

        {/* Business Section */}
        <div className="space-y-6 pt-8 mt-8 border-t">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 border-b pb-2">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="form-group">
              <label className="form-label">
                <Calendar className="h-4 w-4 inline mr-2" />
                Acquisition Date
              </label>
              <Field type="date" name="acquisitionDate" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Supplier Type</label>
              <Field as="select" name="supplier" className="form-select">
                <option value="">Select supplier type</option>
                {SUPPLIERS.map(supplier => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </Field>
            </div>
            <div className="form-group">
              <label className="form-label">
                <MapPin className="h-4 w-4 inline mr-2" />
                Storage Location
              </label>
              <Field as="select" name="storageLocation" className="form-select">
                <option value="">Select storage location</option>
                {STORAGE_LOCATIONS.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </Field>
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

        {/* Media Section */}
        <div className="space-y-6 pt-8 mt-8 border-t">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 border-b pb-2">Media</h2>
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
                        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;

                          const toastId = toast.loading(`Uploading ${files.length} image(s)...`);
                          try {
                            const uploadedUrls = await uploadService.uploadMultipleFiles(files, 'images');
                            uploadedUrls.forEach(url => push(url));
                            toast.success('Images uploaded successfully!', { id: toastId });
                          } catch (error) {
                            toast.error('Failed to upload images.', { id: toastId });
                          }
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
                        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;

                          const toastId = toast.loading(`Uploading ${files.length} video(s)...`);
                          try {
                            const uploadedUrls = await uploadService.uploadMultipleFiles(files, 'videos');
                            uploadedUrls.forEach(url => push(url));
                            toast.success('Videos uploaded successfully!', { id: toastId });
                          } catch (error) {
                            toast.error('Failed to upload videos.', { id: toastId });
                          }
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

        {/* Platform Section */}
        <div className="space-y-6 pt-8 mt-8 border-t">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 border-b pb-2">Platform Integration</h2>
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

        {/* Compliance Section */}
        <div className="space-y-6 pt-8 mt-8 border-t">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 border-b pb-2">Compliance & Insurance</h2>
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
              <Field as="select" name="taxCategory" className="form-select">
                <option value="">Select tax category</option>
                {TAX_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Field>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto">
        <Formik
          initialValues={createInitialValues(product?.productType || 'LooseStone')}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, isSubmitting, setValues }) => (
            <Form className="space-y-8">
              {/* Form Content */}
              <div className="min-h-[600px]">
                {renderFormContent(values, setFieldValue, setValues)}
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
