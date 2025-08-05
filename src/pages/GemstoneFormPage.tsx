import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Upload, X, Plus, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import useProducts from '../hooks/useProducts';
import {
  AnyProduct,
  Product,
  Jewelry,
  LooseStone,
  RoughStone,
  Metal,
  PreciousGemType,
  SemiPreciousGemType,
  OrganicGemType,
  PreciousMetalType,
  Shape,
  Transparency,
  Lustre,
  DesignType,
  Occasion,
  StockStatus,
  AntiqueEra,
  RegionalStyle
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
  const { getProduct, addProduct, updateProduct } = useProducts();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const qrRegionId = 'qr-reader-region';

  const isEditMode = Boolean(id);
  const [initialValues, setInitialValues] = useState<AnyProduct | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [productType, setProductType] = useState<'Jewelry' | 'LooseStone' | 'RoughStone' | 'Metal'>('Jewelry');

  const preciousGemTypes: PreciousGemType[] = [
    'Ruby',
    'Pearl',
    'Red Coral',
    'Emerald',
    'Yellow Sapphire',
    'Diamond',
    'Blue Sapphire',
    'Hessonite',
    "Cat's Eye",
  ];

  const semiPreciousGemTypes: SemiPreciousGemType[] = [
    'Agate', 'Alexandrite', 'Amazonite', 'Amber', 'Amethyst', 'Ametrine', 'Andalusite', 'Apatite', 'Aquamarine', 'Aventurine', 'Azurite', 'Bloodstone', 'Carnelian', 'Chalcedony', 'Charoite', 'Chrysocolla', 'Chrysoprase', 'Citrine', 'Coral', 'Cordierite', 'Demantoid Garnet', 'Diopside', 'Dumortierite', 'Fluorite', 'Garnet', 'Heliodor', 'Hematite', 'Hemimorphite', 'Howlite', 'Iolite', 'Jadeite', 'Jasper', 'Kunzite', 'Kyanite', 'Labradorite', 'Lapis Lazuli', 'Larimar', 'Lepidolite', 'Malachite', 'Moonstone', 'Morganite', 'Nephrite', 'Obsidian', 'Onyx', 'Opal', 'Peridot', 'Prehnite', 'Pyrite', 'Quartz', 'Rhodochrosite', 'Rhodonite', 'Rose Quartz', 'Seraphinite', 'Serpentine', 'Smoky Quartz', 'Sodalite', 'Spinel', 'Sunstone', 'Tanzanite', "Tiger's Eye", 'Topaz', 'Tourmaline', 'Turquoise', 'Zircon', 'Other'
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setLoading(true);
        const data = await getProduct(id);
        if (data) {
          setInitialValues(data);
          setProductType(data.productType);
        }
        setLoading(false);
      } else {
        // Create a default new product
        const defaultProduct: LooseStone = {
          id: '',
          name: '',
          productType: 'LooseStone',
          category: 'Precious Gemstones',
          subCategory: 'Ruby',
          weight: 0,
          dimensions: { length: 0, width: 0, height: 0 },
          color: '',
          clarity: '',
          cut: '',
          shape: '',
          origin: '',
          treatment: '',
          images: [],
          createdAt: '',
          updatedAt: '',
          createdBy: '',
          lastEditedBy: '',
          auditTrail: [],
        };
        setInitialValues(defaultProduct);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, getProduct]);

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

        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name is required'),
            id: Yup.string().required('Item ID is required'),
          })}
          onSubmit={async (values) => {
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

              const productData = {
                ...values,
                images: imageUrls,
                video: videoUrl,
                lastEditedBy: initialValues?.lastEditedBy || '',
                auditTrail: initialValues?.auditTrail || [],
              };

              if (isEditMode && initialValues) {
                const updated = await updateProduct(initialValues.id as string, productData);
                if (updated) {
                  toast.success('Item updated successfully');
                  navigate(`/product/${initialValues.id}`);
                }
              } else {
                const newProduct = await addProduct(productData);
                toast.success('Item added successfully');
                navigate(`/product/${newProduct.id}`);
              }
            } catch (error) {
              toast.error('Failed to save item');
              console.error('Error saving item:', error);
            }
          }}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="productType" className="form-label">Product Type</label>
                <Field
                  as="select"
                  name="productType"
                  className="form-select"
                  value={productType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const newType = e.target.value as 'Jewelry' | 'LooseStone' | 'RoughStone' | 'Metal';
                    setProductType(newType);
                    // Resetting the form can be handled here
                  }}
                >
                  <option value="Jewelry">Jewelry</option>
                  <option value="LooseStone">Loose Stone</option>
                  <option value="RoughStone">Rough Stone</option>
                  <option value="Metal">Metal</option>
                </Field>
              </div>

              <CollapsibleSection title="Basic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="form-label">Name</label>
                    <Field name="name" className="form-input" placeholder="e.g. Natural Burmese Ruby" />
                    <ErrorMessage name="name" component="div" className="text-error-600 text-sm mt-1" />
                  </div>
                   <div>
                    <label htmlFor="id" className="form-label">Item ID / SKU</label>
                    <Field name="id" className="form-input" placeholder="Unique identifier" />
                    <ErrorMessage name="id" component="div" className="text-error-600 text-sm mt-1" />
                  </div>
                </div>
              </CollapsibleSection>

              {productType === 'Jewelry' && (
                <>
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
                          {/* {designTypeOptions.map(dt => <option key={dt} value={dt}>{dt}</option>)} */}
                        </Field>
                      </div>
                      <div>
                        <label htmlFor="occasion" className="form-label">Occasion</label>
                        <Field as="select" name="occasion" className="form-select">
                          <option value="">Select occasion</option>
                          {/* {occasionOptions.map(o => <option key={o} value={o}>{o}</option>)} */}
                        </Field>
                      </div>
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection title="Jewelry & Composition">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="metalType" className="form-label">Metal Type</label>
                        <Field as="select" name="metalType" className="form-select">
                          {/* <option value="">Select metal type</option>
                          {preciousMetalTypes.map(mt => <option key={mt} value={mt}>{mt}</option>)} */}
                        </Field>
                      </div>
                      <div>
                        <label htmlFor="purity" className="form-label">Purity</label>
                        <Field name="purity" className="form-input" />
                      </div>
                      <div>
                        <label htmlFor="metalWeight" className="form-label">Metal Weight (grams)</label>
                        <Field type="number" name="metalWeight" className="form-input" step="0.01" min="0" />
                      </div>
                      <div>
                        <label htmlFor="ringSize" className="form-label">Ring Size</label>
                        <Field name="ringSize" className="form-input" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">Gemstones</label>
                      <FieldArray name="gemstones">
                        {({ push, remove, form }) => (
                          <div className="space-y-4">
                            {form.values.gemstones?.map((gemstone: any, index: number) => (
                              <div key={index} className="grid grid-cols-2 gap-4 border p-4 rounded-md">
                                <Field name={`gemstones.${index}.stone`} placeholder="Stone Type" className="form-input" />
                                <Field name={`gemstones.${index}.weight`} placeholder="Weight (ct)" type="number" className="form-input" />
                                <Field name={`gemstones.${index}.stoneCount`} placeholder="Count" type="number" className="form-input" />
                                <button type="button" onClick={() => remove(index)} className="btn-outline">Remove</button>
                              </div>
                            ))}
                            <button type="button" onClick={() => push({ stone: '', weight: 0, stoneCount: 1 })} className="btn-outline text-sm">Add Gemstone</button>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  </CollapsibleSection>
                </>
              )}

              {productType === 'LooseStone' && (
                <CollapsibleSection title="Physical Characteristics">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="weight" className="form-label">Weight (carats)</label>
                      <Field type="number" name="weight" className="form-input" step="0.01" min="0" />
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
                  </div>
                </CollapsibleSection>
              )}

              {productType === 'RoughStone' && (
                <CollapsibleSection title="Physical Characteristics">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="weight" className="form-label">Weight (grams)</label>
                      <Field type="number" name="weight" className="form-input" step="0.01" min="0" />
                    </div>
                    <div>
                      <label htmlFor="origin" className="form-label">Origin</label>
                      <Field name="origin" className="form-input" />
                    </div>
                  </div>
                </CollapsibleSection>
              )}

              {productType === 'Metal' && (
                <CollapsibleSection title="Metal Details">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="metalType" className="form-label">Metal Type</label>
                      <Field as="select" name="metalType" className="form-select">
                        {/* <option value="">Select metal type</option>
                        {preciousMetalTypes.map(mt => <option key={mt} value={mt}>{mt}</option>)} */}
                      </Field>
                    </div>
                    <div>
                      <label htmlFor="purity" className="form-label">Purity</label>
                      <Field name="purity" className="form-input" />
                    </div>
                    <div>
                      <label htmlFor="weight" className="form-label">Weight (grams)</label>
                      <Field type="number" name="weight" className="form-input" step="0.01" min="0" />
                    </div>
                  </div>
                </CollapsibleSection>
              )}

              {/* ... form sections ... */}

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
                    <label htmlFor="certification" className="form-label">Certification</label>
                    <Field name="certification" className="form-input" />
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
                      {/* {stockStatusOptions.map(ss => <option key={ss} value={ss}>{ss}</option>)} */}
                    </Field>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Form actions */}
              <div className="flex justify-end space-x-4">
                <Link
                  to={isEditMode ? `/product/${id}` : '/inventory'}
                  className="btn-outline"
                >
                  Cancel
                </Link>

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
          )}
        </Formik>
      </div>
    </div>
  );
};

export default GemstoneFormPage;