import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

// Define the shape of your form values
interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  general?: string; // Optional for handling non-field-specific errors
}

const Register = () => {
  const { register } = useAuthStore();
  const router = useRouter();

  const initialValues: RegisterFormValues = {
    name: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(5, 'Password must be at least 5 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting, setFieldError, resetForm }: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      await register(values.name, values.email, values.password, router);
      resetForm();
      setFieldError('general', 'Registration successful!');
    } catch (err) {
      setFieldError('general', 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-w-[360px] p-6 border rounded-lg bg-white">
      <h1 className="text-2xl font-bold">Register</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="flex flex-col">
            {errors.general && (
              <p
                className={`${
                  errors.general === 'Registration successful!'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
                role={errors.general === 'Registration successful!' ? 'status' : 'alert'}
              >
                {errors.general}
              </p>
            )}
            <label className="mt-4 mb-1" htmlFor="name">
              Name
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              className="border p-2"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm"
            />
            <label className="mt-4 mb-1" htmlFor="email">
              Email
            </label>
            <Field
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="border p-2"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
            <label className="mt-4 mb-1" htmlFor="password">
              Password
            </label>
            <Field
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="border p-2"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm"
            />
            <button
              type="submit"
              className="mt-6 rounded-lg bg-blue-500 text-white p-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
