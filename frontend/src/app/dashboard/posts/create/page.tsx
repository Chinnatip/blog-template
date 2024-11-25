"use client";

import { useRouter } from 'next/navigation';
import { usePostStore, useAuthStore } from '@/lib/store';
import MarkdownEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Define the structure of the form values
interface PostCreateFormValues {
  title: string;
  content: string;
  authorId: number;
  image?: string;
}

const CreatePostPage = () => {
  const { createPost, uploadImage } = usePostStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const initialValues: PostCreateFormValues = {
    title: '',
    content: '',
    authorId: user?.id || 0,
    image: undefined,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
  });

  const handleSubmit = async (values: PostCreateFormValues) => {
    try {
      await createPost(values);
      alert('Post created successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      return await uploadImage(file);
    } catch (error) {
      console.error('Image upload failed:', error);
      return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-4">
            {/* Title Field */}
            <div>
              <label className="block font-medium text-gray-700">Title</label>
              <Field
                name="title"
                className="w-full p-2 border rounded"
                placeholder="Enter post title"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const imageUrl = await handleImageUpload(file);
                    setFieldValue('image', imageUrl);
                  }
                }}
                className="block w-full mt-2"
              />
              {values.image && (
                <div className="mt-4">
                  <p className="text-gray-700">Uploaded Image Preview:</p>
                  <img
                    src={values.image}
                    alt="Uploaded"
                    className="mt-2 max-w-xs rounded shadow"
                  />
                </div>
              )}
            </div>

            {/* Content Field */}
            <div>
              <label className="block font-medium text-gray-700">Content</label>
              <MarkdownEditor
                value={values.content}
                style={{ height: "430px" }}
                onChange={({ text }) => setFieldValue('content', text)}
                config={{
                  view: {
                    menu: true,
                    md: true,
                    html: true,
                  },
                  canUploadImage: true,
                  onImageUpload: handleImageUpload,
                }}
                renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
              />
              <ErrorMessage
                name="content"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => router.push("/dashboard")}
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

export default CreatePostPage;
