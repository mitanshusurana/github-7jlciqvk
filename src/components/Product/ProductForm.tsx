import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { AnyProduct, ProductType } from '../../types';

interface ProductFormProps {
  product?: AnyProduct;
  onSubmit: (values: AnyProduct) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {
  const [productType, setProductType] = React.useState<ProductType>(product?.productType || 'LooseStone');

  const initialValues = product || {
    productType: 'LooseStone',
    // ... other initial values
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-6">
          <div>
            <label htmlFor="productType" className="form-label">Product Type</label>
            <Field
              as="select"
              name="productType"
              className="form-select"
              value={productType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const newType = e.target.value as ProductType;
                setProductType(newType);
                setFieldValue('productType', newType);
              }}
            >
              <option value="LooseStone">Loose Stone</option>
              <option value="CarvedIdol">Carved Idol</option>
              <option value="Jewelry">Jewelry</option>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="form-label">Name</label>
              <Field name="name" className="form-input" />
              <ErrorMessage name="name" component="div" className="text-error-600 text-sm mt-1" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="form-label">Description</label>
              <Field name="description" as="textarea" rows={3} className="form-input" />
              <ErrorMessage name="description" component="div" className="text-error-600 text-sm mt-1" />
            </div>
          </div>

          {productType === 'LooseStone' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <h3 className="text-lg font-semibold text-neutral-900 md:col-span-2">Loose Gemstone Details</h3>
              <Field name="gemstoneType" placeholder="Gemstone Type" className="form-input" />
              <Field name="variety" placeholder="Variety" className="form-input" />
              <Field name="origin" placeholder="Origin" className="form-input" />
              <Field as="select" name="creationMethod" className="form-select">
                <option value="Natural">Natural</option>
                <option value="Lab-Grown">Lab-Grown</option>
              </Field>
              <Field name="certificationId" placeholder="Certification ID" className="form-input" />
              <Field name="caratWeight" type="number" placeholder="Carat Weight" className="form-input" />
              <Field name="dimensions" placeholder="Dimensions (e.g. 10x8x5 mm)" className="form-input" />
              <Field name="shape" placeholder="Shape" className="form-input" />
              <Field name="cutGrade" placeholder="Cut Grade" className="form-input" />
              <Field name="colorGrade" placeholder="Color Grade" className="form-input" />
              <Field as="select" name="clarityGrade" className="form-select">
                <option value="FL">FL</option>
                <option value="IF">IF</option>
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
              <Field name="fluorescence" placeholder="Fluorescence" className="form-input" />
              <Field name="polish" placeholder="Polish" className="form-input" />
              <Field name="symmetry" placeholder="Symmetry" className="form-input" />
              <Field name="quantity" type="number" placeholder="Quantity" className="form-input" />
              <Field name="lotNumber" placeholder="Lot Number" className="form-input" />
            </div>
          )}

          {productType === 'CarvedIdol' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <h3 className="text-lg font-semibold text-neutral-900 md:col-span-2">Carved Idol Details</h3>
              <Field name="material" placeholder="Material" className="form-input" />
              <Field name="culturalSignificance" placeholder="Cultural Significance" className="form-input" />
              <Field name="deityFigure" placeholder="Deity/Figure" className="form-input" />
              <Field as="select" name="carvingStyle" className="form-select">
                <option value="Traditional">Traditional</option>
                <option value="Modern">Modern</option>
                <option value="Abstract">Abstract</option>
              </Field>
              <Field name="origin" placeholder="Origin" className="form-input" />
              <Field name="dimensions" placeholder="Dimensions" className="form-input" />
              <Field name="weight" type="number" placeholder="Weight" className="form-input" />
              <Field as="select" name="finishType" className="form-select">
                <option value="Polished">Polished</option>
                <option value="Matte">Matte</option>
                <option value="Brushed">Brushed</option>
                <option value="Hammered">Hammered</option>
              </Field>
              <Field name="carvingDetailLevel" placeholder="Carving Detail Level" className="form-input" />
              <label className="flex items-center space-x-2">
                <Field type="checkbox" name="baseIncluded" />
                <span>Base Included</span>
              </label>
              <Field name="colorDescription" placeholder="Color Description" className="form-input" />
              <Field name="artisan" placeholder="Artisan" className="form-input" />
              <Field name="carvingTechnique" placeholder="Carving Technique" className="form-input" />
              <Field name="agePeriod" placeholder="Age Period" className="form-input" />
              <Field as="select" name="rarity" className="form-select">
                <option value="Common">Common</option>
                <option value="Uncommon">Uncommon</option>
                <option value="Rare">Rare</option>
                <option value="Very Rare">Very Rare</option>
                <option value="Unique">Unique</option>
              </Field>
              <Field as="select" name="workmanshipGrade" className="form-select">
                <option value="Standard">Standard</option>
                <option value="Fine">Fine</option>
                <option value="Excellent">Excellent</option>
                <option value="Masterpiece">Masterpiece</option>
              </Field>
            </div>
          )}

          {productType === 'Jewelry' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <h3 className="text-lg font-semibold text-neutral-900 md:col-span-2">Jewelry Details</h3>
              <Field as="select" name="category" className="form-select">
                <option value="Ring">Ring</option>
                <option value="Necklace">Necklace</option>
                <option value="Bracelet">Bracelet</option>
                <option value="Earrings">Earrings</option>
                <option value="Pendant">Pendant</option>
                <option value="Brooch">Brooch</option>
                <option value="Other">Other</option>
              </Field>
              <Field as="select" name="style" className="form-select">
                <option value="Solitaire">Solitaire</option>
                <option value="Halo">Halo</option>
                <option value="Vintage">Vintage</option>
                <option value="Modern">Modern</option>
                <option value="Three-Stone">Three-Stone</option>
              </Field>
              <Field name="brand" placeholder="Brand" className="form-input" />
              <Field name="collection" placeholder="Collection" className="form-input" />
              <Field as="select" name="metal" className="form-select">
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Platinum">Platinum</option>
              </Field>
              <Field name="metalPurity" placeholder="Metal Purity" className="form-input" />
              <Field name="metalWeight" type="number" placeholder="Metal Weight" className="form-input" />
              <Field name="metalColor" placeholder="Metal Color" className="form-input" />
              <Field name="hallmark" placeholder="Hallmark" className="form-input" />
              <Field name="plating" placeholder="Plating" className="form-input" />
              <FieldArray name="gemstones">
                {({ push, remove, form }) => (
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="text-md font-semibold">Gemstones</h4>
                    {form.values.gemstones?.map((gemstone: any, index: number) => (
                      <div key={index} className="grid grid-cols-2 gap-4 border p-4 rounded-md">
                        <Field name={`gemstones.${index}.type`} placeholder="Type" className="form-input" />
                        <Field name={`gemstones.${index}.caratWeight`} type="number" placeholder="Carat Weight" className="form-input" />
                        <Field name={`gemstones.${index}.settingType`} placeholder="Setting Type" className="form-input" />
                        <Field name={`gemstones.${index}.quality`} placeholder="Quality" className="form-input" />
                        <button type="button" onClick={() => remove(index)} className="btn-outline">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => push({ type: '', caratWeight: 0, settingType: '', quality: '' })} className="btn-outline text-sm">Add Gemstone</button>
                  </div>
                )}
              </FieldArray>
              <Field name="ringSize" type="number" placeholder="Ring Size" className="form-input" />
              <Field name="length" type="number" placeholder="Length" className="form-input" />
              <label className="flex items-center space-x-2">
                <Field type="checkbox" name="adjustable" />
                <span>Adjustable</span>
              </label>
              <Field name="sizeRange" placeholder="Size Range" className="form-input" />
              <Field name="laborCost" type="number" placeholder="Labor Cost" className="form-input" />
              <Field as="select" name="warranty" className="form-select">
                <option value="None">None</option>
                <option value="1-Year">1-Year</option>
                <option value="Lifetime">Lifetime</option>
              </Field>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;
