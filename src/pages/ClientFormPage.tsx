import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { clientService } from '../services/clientService';
import { Client } from '../types';

const ClientFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [initialValues, setInitialValues] = useState<Client | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    const fetchClient = async () => {
      if (id) {
        setLoading(true);
        const data = await clientService.getClient(id);
        if (data) {
          setInitialValues(data);
        }
        setLoading(false);
      } else {
        setInitialValues({
          id: '',
          name: '',
          email: '',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: '',
          },
          createdAt: '',
          updatedAt: '',
        });
      }
    };
    fetchClient();
  }, [id]);

  if (loading || !initialValues) return <div>Loading...</div>;

  return (
    <div className="container-page">
      <Link to="/clients" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Clients
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">
          {isEditMode ? 'Edit Client' : 'Add New Client'}
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email'),
          })}
          onSubmit={async (values) => {
            try {
              if (isEditMode) {
                await clientService.updateClient(id!, values);
                toast.success('Client updated successfully');
              } else {
                await clientService.addClient(values);
                toast.success('Client added successfully');
              }
              navigate('/clients');
            } catch (error) {
              toast.error('Failed to save client');
              console.error('Error saving client:', error);
            }
          }}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6 card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="form-label">Name</label>
                  <Field name="name" className="form-input" />
                  <ErrorMessage name="name" component="div" className="text-error-600 text-sm mt-1" />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">Email</label>
                  <Field name="email" type="email" className="form-input" />
                  <ErrorMessage name="email" component="div" className="text-error-600 text-sm mt-1" />
                </div>
                <div>
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <Field name="phone" className="form-input" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="address.street" className="form-label">Street</label>
                    <Field name="address.street" className="form-input" />
                  </div>
                  <div>
                    <label htmlFor="address.city" className="form-label">City</label>
                    <Field name="address.city" className="form-input" />
                  </div>
                  <div>
                    <label htmlFor="address.state" className="form-label">State</label>
                    <Field name="address.state" className="form-input" />
                  </div>
                  <div>
                    <label htmlFor="address.zip" className="form-label">Zip Code</label>
                    <Field name="address.zip" className="form-input" />
                  </div>
                  <div>
                    <label htmlFor="address.country" className="form-label">Country</label>
                    <Field name="address.country" className="form-input" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link to="/clients" className="btn-outline">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Save Changes' : 'Add Client'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ClientFormPage;
