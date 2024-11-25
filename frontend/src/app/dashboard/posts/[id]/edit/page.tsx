"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePostStore } from "@/lib/store";
import MarkdownEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Define the structure of the form values
interface PostEditFormValues {
  title: string;
  content: string;
  published: boolean;
  image?: string;
}

const EditPostPage = () => {
  const { fetchPostById, updatePost, uploadImage } = usePostStore();
  const router = useRouter();
  const { id } = useParams(); // Get the dynamic ID from the URL

  const [initialValues, setInitialValues] = useState<PostEditFormValues>({
    title: "",
    content: "",
    published: false,
    image: undefined,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      try {
        const post = await fetchPostById(Number(id)); // Fetch the post details by ID
        setInitialValues({
          title: post.title,
          content: post.content,
          published: post.published,
          image: post.image || undefined,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        router.push("/dashboard"); // Redirect if post is not found
      }
    };

    loadPost();
  }, [id, fetchPostById, router]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
  });

  const handleImageUpload = async (file: File) => {
    try {
      return await uploadImage(file);
    } catch (error) {
      console.error("Image upload failed:", error);
      return "";
    }
  };

  const handleSubmit = async (values: PostEditFormValues) => {
    try {
      await updatePost(Number(id), values); // Update the post in the backend
      alert("Post updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update the post.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block font-medium text-gray-700">
                Title
              </label>
              <Field
                id="title"
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
                    setFieldValue("image", imageUrl);
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
                style={{ height: "300px" }}
                onChange={({ text }) => setFieldValue("content", text)}
                renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>} // Use ReactMarkdown to render HTML
              />
              <ErrorMessage
                name="content"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Published Toggle */}
            <div className="flex items-center">
              <Field
                id="published"
                name="published"
                type="checkbox"
                className="mr-2"
              />
              <label htmlFor="published" className="font-medium text-gray-700">
                Published
              </label>
            </div>

            {/* Buttons */}
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditPostPage;
