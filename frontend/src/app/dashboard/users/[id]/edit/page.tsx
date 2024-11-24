"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserStore, useAuthStore, UserEdit } from "@/lib/store";

const EditUserPage = () => {
  const { fetchUserById, updateUser } = useUserStore();
  const { token } = useAuthStore();
  const router = useRouter();
  const { id } = useParams(); // Get the dynamic ID from the URL

  const [form, setForm] = useState<UserEdit>({
    name: "",
    email: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;

      try {
        if(typeof token == 'string'){
          const user = await fetchUserById(Number(id), token); // Fetch the user details by ID
          setForm({
            name: user.name,
            email: user.email
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/dashboard/users"); // Redirect if not found
      }
    };

    loadUser();
  }, [id, fetchUserById, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
  
    // ตรวจสอบว่าฟิลด์เป็น checkbox
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked, // ใช้ `checked` สำหรับ checkbox
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if(typeof token == 'string'){
        await updateUser(Number(id), form, token); // Update the user in the backend
        alert("User updated successfully!");
        router.push("/dashboard/users");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update the user.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Edit user</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
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
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
