import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

interface LoginFormValues {
  email: string;
  password: string;
  general?: string;
}

const Login = () => {
  const { login } = useAuthStore();
  const router = useRouter();

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(5, 'Password must be at least 5 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting, setFieldError }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      await login(values.email, values.password, router);
    } catch (err) {
      console.error(err);
      setFieldError('general', 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-w-[360px] p-6 border rounded-lg bg-white">
      <h1 className="text-2xl font-bold">Login</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="flex flex-col">
            {errors.general && (
              <p className="text-red-500">{errors.general}</p>
            )}
            <label className="mt-4 mb-1" htmlFor="email">Email</label>
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
            <label className="mt-4 mb-1" htmlFor="password">Password</label>
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
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
