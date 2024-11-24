"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePostStore, useAuthStore, PostCreate } from '@/lib/store';
import MarkdownEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";

const CreatePostPage = () => {
  const { createPost, uploadImage } = usePostStore();
  const { user } = useAuthStore()
  const router = useRouter();


  const [form, setForm] = useState<PostCreate>({
    title: '',
    content: '',
    authorId: user != null ? user?.id : 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost(form);
    alert('Post created successfully!');
    router.push('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = ({ text }: { text: string }) => {
    setForm((prev) => ({ ...prev, content: text }));
  };

  const handleImageUpload = async (file: File) => {
    const image_url = await uploadImage(file)
    console.log(image_url)
    if(typeof image_url == 'string'){
      return image_url
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
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
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
