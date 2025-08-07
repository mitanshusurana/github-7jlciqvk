import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { AnyProduct, ProductType } from '../../types';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GripVertical } from 'lucide-react';

interface ProductFormProps {
  product?: AnyProduct;
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

const DraggableMediaItem: React.FC<DraggableMediaItemProps> = ({ item, index, moveItem, removeItem }) => {
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
      <div ref={ref}>
        {item.type === 'image' ? (
          <img src={item.url} className="w-24 h-24 object-cover rounded-md" />
        ) : (
          <video src={item.url} className="w-24 h-24 object-cover rounded-md" />
        )}
        <button type="button" onClick={() => removeItem(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">X</button>
        <div className="absolute top-0 left-0 bg-black/50 p-1 rounded-br-md cursor-grab">
          <GripVertical className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
};


const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {
  const [productType, setProductType] = React.useState<ProductType>(product?.productType || 'LooseStone');

  const initialValues = product || {
    productType: 'LooseStone',
    name: '',
    description: '',
    images: [],
    videos: [],
    // ... other initial values
  };

  return (
    <DndProvider backend={HTML5Backend}>
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

            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Media</h3>
              <FieldArray name="images">
                {({ push, remove }) => (
                  <div>
                    <input type="file" multiple onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => push(URL.createObjectURL(file)));
                    }} />
                  </div>
                )}
              </FieldArray>
              <FieldArray name="videos">
                {({ push, remove }) => (
                  <div>
                    <input type="file" multiple onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => push(URL.createObjectURL(file)));
                    }} />
                  </div>
                )}
              </FieldArray>
              <div className="flex flex-wrap gap-4 mt-4">
                {values.images.map((url, index) => (
                  <DraggableMediaItem
                    key={url}
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
                {values.videos.map((url, index) => (
                  <DraggableMediaItem
                    key={url}
                    item={{ url, type: 'video' }}
                    index={index + values.images.length}
                    moveItem={(dragIndex, hoverIndex) => {
                      // This is a simplified implementation. A real implementation would need to handle reordering between image and video arrays.
                    }}
                    removeItem={(i) => {
                      const newVideos = [...values.videos];
                      newVideos.splice(i, 1);
                      setFieldValue('videos', newVideos);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ... other form fields ... */}

            <div className="flex justify-end space-x-4">
              <button type="submit" className="btn-primary">
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </DndProvider>
  );
};

export default ProductForm;
