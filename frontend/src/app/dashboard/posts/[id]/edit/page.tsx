"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePostStore, PostEdit } from "@/lib/store";
import MarkdownEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";

const EditPostPage = () => {
  const { fetchPostById, updatePost } = usePostStore();
  const router = useRouter();
  const { id } = useParams(); // Get the dynamic ID from the URL

  const [form, setForm] = useState<PostEdit>({
    title: "",
    content: "",
    published: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      try {
        const post = await fetchPostById(Number(id)); // Fetch the post details by ID
        setForm({
          title: post.title,
          content: post.content,
          published: post.published,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        router.push("/dashboard"); // Redirect if post is not found
      }
    };

    loadPost();
  }, [id, fetchPostById, router]);

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

  const handleEditorChange = ({ text }: { text: string }) => {
    setForm((prev) => ({ ...prev, content: text }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updatePost(Number(id), form); // Update the post in the backend
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Content</label>
          <MarkdownEditor
            value={form.content}
            style={{ height: "300px" }}
            onChange={handleEditorChange}
            renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>} // Use ReactMarkdown to render HTML
          />
        </div>

        <div className="flex items-center">
          <input
            id="published"
            name="published"
            type="checkbox"
            checked={form.published}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="published" className="font-medium text-gray-700">
            Published
          </label>
        </div>

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
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostPage;
