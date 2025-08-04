import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Upload, X, Plus, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import useGemstones from '../hooks/useGemstones';
import {
  Gemstone, Category, ItemType, PreciousGemType, SemiPreciousGemType, OrganicGemType, PreciousMetalType,
  Shape, Transparency, Lustre, DesignType, Occasion, StockStatus, AntiqueEra, RegionalStyle
} from '../types';
import { uploadService } from '../services/uploadService';
import { Html5Qrcode } from 'html5-qrcode';

// Collapsible Section Component
const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; initialOpen?: boolean }> = ({ title, children, initialOpen = true }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <div className="card">
      <button
        type="button"
        className="w-full flex justify-between items-center p-6"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="p-6 pt-0">{children}</div>}
    </div>
  );
};

const GemstoneFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getGemstone, addGemstone, updateGemstone } = useGemstones();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const qrRegionId = 'qr-reader-region';

  const isEditMode = Boolean(id);
  const [initialValues, setInitialValues] = useState<Gemstone | null>(null);
  const [loading, setLoading] = useState(!!id);

  // Category and type options
  const categories: Category[] = [
    'Precious Gemstones',
    'Semi-Precious Gemstones', 
    'Precious Metals',
    'Organic Gems'
  ];

  const itemTypes: ItemType[] = [
    'Loose Gemstone',
    'Gemstone Lot',
    'Ring',
    'Necklace',
    'Bracelet',
    'Earrings',
    'Pendant',
    'Brooch',
    'Carved Idol',
    'Rough Stone',
    'Metal Bar/Ingot',
    'Metal Sheet',
    'Metal Wire',
    'Antique Piece',
    'Custom Jewelry',
    'Watch',
    'Cufflinks',
    'Other'
  ];

  const preciousGemTypes: PreciousGemType[] = [
    'Diamond',
    'Ruby',
    'Sapphire',
    'Emerald',
    'Tanzanite',
    'Paraiba Tourmaline',
    'Jadeite',
    'Red Beryl',
    'Taaffeite'
  ];

  const semiPreciousGemTypes: SemiPreciousGemType[] = [
    'Amethyst',
    'Aquamarine',
    'Citrine',
    'Garnet',
    'Peridot',
    'Topaz',
    'Tourmaline',
    'Spinel',
    'Moonstone',
    'Labradorite',
    'Amazonite',
    'Aventurine',
    'Carnelian',
    'Chalcedony',
    'Chrysoprase',
    'Jasper',
    'Onyx',
    'Agate',
    'Quartz',
    'Rose Quartz',
    'Smoky Quartz',
    'Tiger Eye',
    'Turquoise',
    'Lapis Lazuli',
    'Malachite',
    'Sodalite',
    'Fluorite',
    'Iolite',
    'Kyanite',
    'Andalusite',
    'Other'
  ];

  const organicGemTypes: OrganicGemType[] = [
    'Pearl',
    'Amber',
    'Coral',
    'Jet',
    'Ivory',
    'Shell',
    'Other'
  ];

  const preciousMetalTypes: PreciousMetalType[] = [
    'Gold',
    'Silver',
    'Platinum',
    'Palladium',
    'Rhodium',
    'Iridium',
    'Other'
  ];

  const purityOptions = [
    '24K', '22K', '18K', '14K', '10K', '9K', // Gold
    '999', '925', '900', '800', // Silver
    '950', '900', '850', // Platinum
    'Other'
  ];

  const shapeOptions: Shape[] = ['Round', 'Princess', 'Emerald', 'Asscher', 'Marquise', 'Oval', 'Radiant', 'Pear', 'Heart', 'Cushion', 'Other'];
  const transparencyOptions: Transparency[] = ['Transparent', 'Translucent', 'Opaque'];
  const lustreOptions: Lustre[] = ['Vitreous', 'Resinous', 'Pearly', 'Greasy', 'Silky', 'Waxy', 'Dull', 'Metallic'];
  const designTypeOptions: DesignType[] = ['Antique', 'Modern', 'Temple', 'Classic', 'Contemporary', 'Ethnic', 'Other'];
  const occasionOptions: Occasion[] = ['Bridal', 'Daily Wear', 'Festive', 'Gift', 'Work Wear', 'Party Wear', 'Other'];
  const stockStatusOptions: StockStatus[] = ['In Stock', 'Out of Stock', 'Made-to-Order', 'On Hold'];
  const antiqueEraOptions: AntiqueEra[] = ['Pre-1800s', 'Victorian (1837-1901)', 'Art Nouveau (1890-1910)', 'Edwardian (1901-1910)', 'Art Deco (1920-1935)', 'Retro (1935-1950)', 'Mid-Century (1950s)', 'Modern (Post-1960)', 'Other'];
  const regionalStyleOptions: RegionalStyle[] = ['Rajasthani', 'South Indian', 'Mughal', 'Nizami', 'Pahari', 'Other'];

  useEffect(() => {
    const fetchGemstone = async () => {
      if (id) {
        setLoading(true);
        const data = await getGemstone(id);
        setInitialValues(data);
        setLoading(false);
      } else {
        setInitialValues({
          id: '',
          name: '',
          category: 'Precious Gemstones',
          subCategory: '',
          itemType: 'Loose Gemstone',
          weight: 0,
          dimensions: { length: 0, width: 0, height: 0 },
          color: '',
          clarity: '',
          cut: '',
          origin: '',
          treatment: '',
          certification: '',
          acquisitionDate: '',
          acquisitionPrice: undefined,
          seller: '',
          estimatedValue: undefined,
          notes: '',
          images: [],
          video: '',
          qrCode: '',
          shape: '',
          gemVariety: '',
          stoneCount: undefined,
          ringSize: '',
          totalCaratWeight: undefined,
          shortDescription: '',
          detailedDescription: '',
          transparency: '',
          lustre: '',
          designType: '',
          occasion: '',
          treatmentDetails: '',
          certificationUpload: '',
          returnPolicy: '',
          warrantyInfo: '',
          careInstructions: '',
          zodiacRelevance: '',
          inTheBox: [],
          mrp: undefined,
          sellingPrice: undefined,
          discountLabel: '',
          stockStatus: 'In Stock',
          deliveryTimeEstimate: '',
          customOrderAvailable: false,
          bulkInquiryEnabled: false,
          antiqueEra: '',
          regionalStyle: '',
          materialComposition: '',
          craftsmanshipDetail: '',
          artisanOrWorkshop: '',
          tags: [],
          createdAt: '',
          updatedAt: '',
          createdBy: '',
          lastEditedBy: '',
          auditTrail: [],
          itemSpecificDetails: {},
        });
        setLoading(false);
      }
    };
    fetchGemstone();
  }, [id, getGemstone]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    category: Yup.string().required('Category is required'),
    subCategory: Yup.string().required('Sub-category is required'),
    itemType: Yup.string().required('Item type is required'),
    gemVariety: Yup.string(),
    weight: Yup.number().required('Weight is required').positive().min(0.01),
    dimensions: Yup.object().shape({
      length: Yup.number().positive().min(0),
      width: Yup.number().positive().min(0),
      height: Yup.number().positive().min(0),
    }),
    id: Yup.string().required('Item ID is required'),
    mrp: Yup.number().positive().nullable(),
    sellingPrice: Yup.number().positive().nullable(),
    acquisitionPrice: Yup.number().positive().nullable(),
    estimatedValue: Yup.number().positive().nullable(),
    stoneCount: Yup.number().integer().min(0).nullable(),
    totalCaratWeight: Yup.number().positive().nullable(),
  });

  const getSubCategoryOptions = (category: string) => {
    switch (category) {
      case 'Precious Gemstones':
        return preciousGemTypes;
      case 'Semi-Precious Gemstones':
        return semiPreciousGemTypes;
      case 'Organic Gems':
        return organicGemTypes;
      case 'Precious Metals':
        return preciousMetalTypes;
      default:
        return [];
    }
  };

  const handleSubmit = async (values: Gemstone) => {
    try {
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        const uploadedImages = await uploadService.uploadMultipleFiles(selectedImages);
        const keptUrls = imagePreviewUrls.filter(url => initialValues?.images?.includes(url));
        imageUrls = [...keptUrls, ...uploadedImages];
      } else if (isEditMode && initialValues && imagePreviewUrls.length > 0) {
        imageUrls = imagePreviewUrls;
      } else {
        imageUrls = [];
      }

      let videoUrl: string = '';
      if (selectedVideo) {
        const uploadedVideo = await uploadService.uploadMultipleFiles([selectedVideo]);
        videoUrl = uploadedVideo[0] || '';
      } else if (isEditMode && initialValues && videoPreviewUrl) {
        videoUrl = videoPreviewUrl;
      }

      const gemstoneData = {
        ...values,
        images: imageUrls,
        video: videoUrl,
        lastEditedBy: initialValues?.lastEditedBy || '',
        auditTrail: initialValues?.auditTrail || [],
      };

      if (isEditMode && initialValues) {
        const updated = await updateGemstone(initialValues.id as string, gemstoneData);
        if (updated) {
          toast.success('Item updated successfully');
          navigate(`/gemstone/${initialValues.id}`);
        }
      } else {
        const newGemstone = await addGemstone(gemstoneData);
        toast.success('Item added successfully');
        navigate(`/gemstone/${newGemstone.id}`);
      }
    } catch (error) {
      toast.error('Failed to save item');
      console.error('Error saving item:', error);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(URL.revokeObjectURL);
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [imagePreviewUrls, videoPreviewUrl]);

  useEffect(() => {
    if (isEditMode && initialValues && Array.isArray(initialValues.images)) {
      setImagePreviewUrls(initialValues.images);
    }
    if (isEditMode && initialValues && initialValues.video) {
      setVideoPreviewUrl(initialValues.video);
    }
  }, [isEditMode, initialValues]);

  if (loading || !initialValues) return <div>Loading...</div>;

  return (
    <div className="container-page">
      <Link to={isEditMode ? `/gemstone/${id}` : '/inventory'} className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {isEditMode ? 'Back to Item' : 'Back to Inventory'}
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">
          {isEditMode ? 'Edit Item' : 'Add New Item'}
        </h1>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, setFieldValue, values }) => {
            const [qrScanner, setQrScanner] = useState<Html5Qrcode | null>(null);
            const [qrScannerRunning, setQrScannerRunning] = useState(false);
            const [showQrScanner, setShowQrScanner] = useState(false);

            const stopAndClearScanner = async () => {
              if (qrScanner) {
                try {
                  if (qrScannerRunning) await qrScanner.stop();
                  await qrScanner.clear();
                } catch (err) {
                  console.warn("Error stopping/clearing scanner", err);
                } finally {
                  setQrScanner(null);
                  setQrScannerRunning(false);
                }
              }
            };

            useEffect(() => {
              return () => {
                stopAndClearScanner();
              };
            }, []);

            useEffect(() => {
              if (showQrScanner && !qrScanner) {
                const region = document.getElementById(qrRegionId);
                if (region) {
                  const scanner = new Html5Qrcode(qrRegionId);
                  setQrScanner(scanner);
                  scanner
                    .start(
                      { facingMode: 'environment' },
                      { fps: 10, qrbox: 250 },
                      async (decodedText) => {
                        console.log('QR Detected:', decodedText);
                        setFieldValue('id', decodedText);
                        setShowQrScanner(false);
                        await stopAndClearScanner();
                      },
                      () => {}
                    )
                    .then(() => setQrScannerRunning(true))
                    .catch((err) => {
                      toast.error('QR Scan Error');
                      console.error(err);
                      setShowQrScanner(false);
                      setQrScanner(null);
                    });
                }
              }

              if (!showQrScanner && qrScanner && qrScannerRunning) {
                stopAndClearScanner();
              }
            }, [showQrScanner]);

            // Reset sub-category when category changes
            useEffect(() => {
              setFieldValue('subCategory', '');
              setFieldValue('gemVariety', '');
            }, [values.category, setFieldValue]);

            return (
              <Form className="space-y-6">
                <CollapsibleSection title="Basic Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="form-label">Name</label>
                      <Field name="name" className="form-input" placeholder="e.g. Natural Burmese Ruby" />
                      <ErrorMessage name="name" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                    <div>
                      <label htmlFor="category" className="form-label">Category</label>
                      <Field as="select" name="category" className="form-select">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </Field>
                    </div>
                    <div>
                      <label htmlFor="subCategory" className="form-label">Sub-Category</label>
                      <Field as="select" name="subCategory" className="form-select" disabled={!values.category}>
                        <option value="">Select sub-category</option>
                        {getSubCategoryOptions(values.category).map(sc => <option key={sc} value={sc}>{sc}</option>)}
                      </Field>
                    </div>
                    <div>
                      <label htmlFor="itemType" className="form-label">Item Type</label>
                      <Field as="select" name="itemType" className="form-select">
                        {itemTypes.map(it => <option key={it} value={it}>{it}</option>)}
                      </Field>
                    </div>
                     <div>
                      <label htmlFor="gemVariety" className="form-label">Gem Variety</label>
                      <Field name="gemVariety" className="form-input" placeholder="e.g. Corundum, Beryl" />
                    </div>
                    <div>
                      <label htmlFor="weight" className="form-label">
                        Weight ({values.category === 'Precious Metals' ? 'grams' : 'carats'})
                      </label>
                      <Field type="number" name="weight" className="form-input" step="0.01" min="0" />
                      <ErrorMessage name="weight" component="div" className="text-error-600 text-sm mt-1" />
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Description & Occasion">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="shortDescription" className="form-label">Short Description / Tagline</label>
                      <Field name="shortDescription" as="textarea" rows={2} className="form-input" />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="detailedDescription" className="form-label">Detailed Description</label>
                      <Field name="detailedDescription" as="textarea" rows={4} className="form-input" />
                    </div>
                     <div>
                      <label htmlFor="designType" className="form-label">Design Type</label>
                      <Field as="select" name="designType" className="form-select">
                        <option value="">Select design type</option>
                        {designTypeOptions.map(dt => <option key={dt} value={dt}>{dt}</option>)}
                      </Field>
                    </div>
                    <div>
                      <label htmlFor="occasion" className="form-label">Occasion</label>
                      <Field as="select" name="occasion" className="form-select">
                        <option value="">Select occasion</option>
                        {occasionOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </Field>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Physical Characteristics">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="dimensions.length" className="form-label">Length (mm)</label>
                      <Field type="number" name="dimensions.length" className="form-input" step="0.01" min="0" />
                    </div>
                    <div>
                      <label htmlFor="dimensions.width" className="form-label">Width (mm)</label>
                      <Field type="number" name="dimensions.width" className="form-input" step="0.01" min="0" />
                    </div>
                    <div>
                      <label htmlFor="dimensions.height" className="form-label">Height (mm)</label>
                      <Field type="number" name="dimensions.height" className="form-input" step="0.01" min="0" />
                    </div>
                    <div>
                      <label htmlFor="color" className="form-label">Color</label>
                      <Field name="color" className="form-input" />
                    </div>
                    <div>
                      <label htmlFor="clarity" className="form-label">Clarity</label>
                      <Field name="clarity" className="form-input" />
                    </div>
                    <div>
                      <label htmlFor="cut" className="form-label">Cut</label>
                      <Field name="cut" className="form-input" />
                    </div>
                    <div>
                      <label htmlFor="shape" className="form-label">Shape</label>
                      <Field as="select" name="shape" className="form-select">
                        <option value="">Select shape</option>
                        {shapeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </Field>
                    </div>
                    <div>
                      <label htmlFor="transparency" className="form-label">Transparency</label>
                      <Field as="select" name="transparency" className="form-select">
                        <option value="">Select transparency</option>
                        {transparencyOptions.map(t => <option key={t} value={t}>{t}</option>)}
                      </Field>
                    </div>
                    <div>
                      <label htmlFor="lustre" className="form-label">Lustre</label>
                      <Field as="select" name="lustre" className="form-select">
                        <option value="">Select lustre</option>
                        {lustreOptions.map(l => <option key={l} value={l}>{l}</option>)}
                      </Field>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Jewelry & Composition">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="stoneCount" className="form-label">Stone Count</label>
                      <Field type="number" name="stoneCount" className="form-input" min="0" />
                    </div>
                    <div>
                      <label htmlFor="totalCaratWeight" className="form-label">Total Carat Weight</label>
                      <Field type="number" name="totalCaratWeight" className="form-input" step="0.01" min="0" />
                    </div>
                    <div>
                      <label htmlFor="ringSize" className="form-label">Ring Size</label>
                      <Field name="ringSize" className="form-input" />
                    </div>
                     <div className="md:col-span-2">
                      <label htmlFor="materialComposition" className="form-label">Material Composition</label>
                      <Field name="materialComposition" className="form-input" placeholder="e.g. 22K Gold, Uncut Diamonds..." />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="craftsmanshipDetail" className="form-label">Craftsmanship Detail</label>
                      <Field name="craftsmanshipDetail" className="form-input" />
                    </div>
                     <div>
                      <label htmlFor="artisanOrWorkshop" className="form-label">Artisan / Workshop</label>
                      <Field name="artisanOrWorkshop" className="form-input" />
                    </div>
                  </div>
                </CollapsibleSection>

                {values.itemType === 'Antique Piece' && (
                  <CollapsibleSection title="Antique & Heritage Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="antiqueEra" className="form-label">Antique Era</label>
                        <Field as="select" name="antiqueEra" className="form-select">
                          <option value="">Select era</option>
                          {antiqueEraOptions.map(ae => <option key={ae} value={ae}>{ae}</option>)}
                        </Field>
                      </div>
                      <div>
                        <label htmlFor="regionalStyle" className="form-label">Regional Style</label>
                        <Field as="select" name="regionalStyle" className="form-select">
                          <option value="">Select style</option>
                          {regionalStyleOptions.map(rs => <option key={rs} value={rs}>{rs}</option>)}
                        </Field>
                      </div>
                    </div>
                  </CollapsibleSection>
                )}

                <CollapsibleSection title="Origin & Certification">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="origin" className="form-label">Origin</label>
                      <Field name="origin" className="form-input" />
                    </div>
                    <div>
                      <label htmlFor="treatment" className="form-label">Treatment</label>
                      <Field name="treatment" className="form-input" />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="treatmentDetails" className="form-label">Treatment Details</label>
                      <Field name="treatmentDetails" as="textarea" rows={2} className="form-input" />
                    </div>
                    <div>
                      <label htmlFor="certification" className="form-label">Certification No.</label>
                      <Field name="certification" className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Certification Document</label>
                      <input type="file" accept="application/pdf,image/*" onChange={(e) => {
                        const file = e.currentTarget.files?.[0];
                        if (file) {
                          setSelectedCertificate(file);
                          setFieldValue("certificationUpload", file.name);
                        }
                      }} className="form-input" />
                      {values.certificationUpload && <span className="text-sm text-neutral-500 mt-1">{values.certificationUpload}</span>}
                    </div>
                  </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="E-Commerce">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="mrp" className="form-label">MRP</label>
                      <Field type="number" name="mrp" className="form-input" />
                    </div>
                    <div>
                      <label htmlFor="sellingPrice" className="form-label">Selling Price</label>
                      <Field type="number" name="sellingPrice" className="form-input" />
                    </div>
                    <div>
                      <label htmlFor="discountLabel" className="form-label">Discount Label</label>
                      <Field name="discountLabel" className="form-input" placeholder="e.g. 15% OFF" />
                    </div>
                    <div>
                      <label htmlFor="stockStatus" className="form-label">Stock Status</label>
                      <Field as="select" name="stockStatus" className="form-select">
                        {stockStatusOptions.map(ss => <option key={ss} value={ss}>{ss}</option>)}
                      </Field>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="deliveryTimeEstimate" className="form-label">Delivery Time Estimate</label>
                      <Field name="deliveryTimeEstimate" className="form-input" placeholder="e.g. 5-7 business days" />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <Field type="checkbox" name="customOrderAvailable" className="form-checkbox" />
                        Custom Order Available
                      </label>
                      <label className="flex items-center gap-2">
                        <Field type="checkbox" name="bulkInquiryEnabled" className="form-checkbox" />
                        Bulk Inquiry Enabled
                      </label>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Additional Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="careInstructions" className="form-label">Care Instructions</label>
                      <Field name="careInstructions" as="textarea" rows={3} className="form-input" />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="returnPolicy" className="form-label">Return Policy</label>
                      <Field name="returnPolicy" className="form-input" />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="warrantyInfo" className="form-label">Warranty Information</label>
                      <Field name="warrantyInfo" className="form-input" />
                    </div>
                     <div>
                      <label htmlFor="zodiacRelevance" className="form-label">Zodiac Relevance</label>
                      <Field name="zodiacRelevance" className="form-input" />
                    </div>
                    <div>
                      <label htmlFor="inTheBox" className="form-label">What's in the Box</label>
                      <FieldArray name="inTheBox">
                        {({ push, remove, form }) => (
                          <div>
                            {form.values.inTheBox?.map((item: any, index: number) => (
                              <div key={index} className="flex items-center gap-2 mb-2">
                                <Field name={`inTheBox.${index}`} className="form-input" />
                                <button type="button" onClick={() => remove(index)}><X className="h-4 w-4" /></button>
                              </div>
                            ))}
                            <button type="button" onClick={() => push('')} className="btn-outline text-sm">Add Item</button>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="notes" className="form-label">Internal Notes</label>
                      <Field name="notes" as="textarea" rows={3} className="form-input" />
                    </div>
                  </div>
                </CollapsibleSection>
                
                {/* Form actions */}
                <div className="flex justify-end space-x-4">
                  <Link
                    to={isEditMode ? `/gemstone/${id}` : '/inventory'}
                    className="btn-outline"
                  >
                    Cancel
                  </Link>
                  
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this item?')) {
                          // Handle delete
                        }
                      }}
                      className="btn bg-error-600 text-white hover:bg-error-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isEditMode ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default GemstoneFormPage;