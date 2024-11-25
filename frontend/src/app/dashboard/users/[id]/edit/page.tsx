"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserStore, useAuthStore } from "@/lib/store";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EditUserPage = () => {
  const { fetchUserById, updateUser } = useUserStore();
  const { token } = useAuthStore();
  const router = useRouter();
  const { id } = useParams(); // Get the dynamic ID from the URL

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    adminRole: false, // Default adminRole value
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!id || typeof token !== "string") return;

      try {
        const user = await fetchUserById(Number(id), token); // Fetch user details by ID
        setInitialValues({
          name: user.name,
          email: user.email,
          adminRole: user.adminRole || false, // Ensure adminRole is set properly
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/dashboard/users"); // Redirect if not found
      }
    };

    loadUser();
  }, [id, fetchUserById, token, router]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    adminRole: Yup.boolean(), // No special validation for checkbox
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (typeof token === "string") {
      try {
        await updateUser(Number(id), values, token); // Update the user in the backend
        alert("User updated successfully!");
        router.push("/dashboard/users");
      } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update the user.");
      }
    } else {
      alert("You are not authorized to perform this action.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize // Ensure Formik updates with initialValues dynamically
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
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

            {/* Admin Role Checkbox */}
            <div className="flex items-center">
              <Field
                id="adminRole"
                name="adminRole"
                type="checkbox"
                className="mr-2"
              />
              <label htmlFor="adminRole" className="font-medium text-gray-700">
                Set as Admin
              </label>
            </div>

            {/* Submit and Cancel Buttons */}
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditUserPage;
