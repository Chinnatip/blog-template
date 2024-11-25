"use client";

import { useRouter } from 'next/navigation';
import { useUserStore, useAuthStore } from '@/lib/store';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CreateUserPage = () => {
  const { createUser } = useUserStore();
  const { token } = useAuthStore();
  const router = useRouter();

  // Define initial values for Formik
  const initialValues = {
    name: '',
    email: '',
    password: '',
    adminRole: false, // Default to false
  };

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(5, 'Password must be at least 5 characters'),
    adminRole: Yup.boolean(), // No special validation for checkbox
  });

  // Submit handler
  const handleSubmit = async (values: typeof initialValues) => {
    if (typeof token === 'string') {
      try {
        await createUser(values, token);
        alert('User created successfully!');
        router.push('/dashboard/users');
      } catch (error) {
        console.error('Error creating user:', error);
        alert('Failed to create user.');
      }
    } else {
      alert('You are not authorized to perform this action.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block font-medium text-gray-700">
                Name
              </label>
              <Field
                id="name"
                name="name"
                className="w-full p-2 border rounded"
                placeholder="Enter name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-medium text-gray-700">
                Email
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                className="w-full p-2 border rounded"
                placeholder="Enter email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block font-medium text-gray-700"
              >
                Password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                className="w-full p-2 border rounded"
                placeholder="Enter password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Admin Role Checkbox */}
            <div className="flex items-center">
              <Field
                id="adminRole"
                name="adminRole"
                type="checkbox"
                className="mr-2"
              />
              <label
                htmlFor="adminRole"
                className="font-medium text-gray-700"
              >
                Set as Admin
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => router.push("/dashboard/users")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateUserPage;
