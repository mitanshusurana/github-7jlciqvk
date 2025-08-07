import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Movement } from '../../types';

interface MovementFormProps {
  productId: string;
  onSubmit: (values: Omit<Movement, 'id' | 'userId'>) => void;
}

const MovementForm: React.FC<MovementFormProps> = ({ productId, onSubmit }) => {
  const initialValues: Omit<Movement, 'id' | 'userId'> = {
    productId,
    fromLocation: '',
    toLocation: '',
    date: new Date().toISOString().split('T')[0],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        fromLocation: Yup.string().required('Required'),
        toLocation: Yup.string().required('Required'),
        date: Yup.date().required('Required'),
      })}
      onSubmit={onSubmit}
    >
      <Form className="space-y-4">
        <Field name="fromLocation" placeholder="From Location" className="form-input" />
        <ErrorMessage name="fromLocation" />
        <Field name="toLocation" placeholder="To Location" className="form-input" />
        <ErrorMessage name="toLocation" />
        <Field name="date" type="date" className="form-input" />
        <ErrorMessage name="date" />
        <button type="submit" className="btn-primary">Record Movement</button>
      </Form>
    </Formik>
  );
};

export default MovementForm;
