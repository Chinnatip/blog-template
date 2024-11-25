"use client";

import { useEffect } from 'react';
import withAuthGuard from '@/components/AuthGuard'
import { usePostStore, useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { date_format } from '@/lib/date'

const DashboardPage = () => {
  const router = useRouter()
  const { user } = useAuthStore();
  const { posts, pageInfo, fetchPosts, deletePost, togglePublish } = usePostStore();

  useEffect(() => {
    const getContent = async () => {
      if(user != null){
        await fetchPosts({ page: 1, user_id: user.id })  
      }
    };
    getContent();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(id); // Assume `deletePost` is defined in your store
      alert('Post deleted successfully!');
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/posts/${id}/edit`);
  };

  const handleCreate = () => {
    router.push('/dashboard/posts/create');
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    await togglePublish(id, currentStatus);
    alert(`Post publish status updated to ${!currentStatus ? 'Published' : 'Unpublished'}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {pageInfo?.totalPosts 
            ? `Total ${pageInfo.totalPosts} posts available` 
            : 'Your Post Dashboard'}
        </h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleCreate}
        >
          Create Post+
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-4 text-left font-medium text-gray-600">ID</th>
            <th className="p-4 text-left font-medium text-gray-600">Title</th>
            <th className="p-4 text-left font-medium text-gray-600">Description</th>
            <th className="p-4 text-left font-medium text-gray-600">Date</th>
            <th className="p-4 text-left font-medium text-gray-600">Image</th>
            <th className="p-4 text-left font-medium text-gray-600">Published</th>
            <th className="p-4 text-left font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{post.id}</td>
              <td className="p-4">{post.title}</td>
              <td className="p-4 max-w-[240px]">{post.content}</td>
              <td className="p-4">{date_format(post.date)}</td>
              <td className="p-4">
                <img
                  src={post.image || '/image_feature.jpg'}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="p-4">
                <select
                  value={post.published ? 'true' : 'false'}
                  onChange={() => handleTogglePublish(post.id, post.published)}
                  className="p-2 border rounded"
                >
                  <option value="true">Published</option>
                  <option value="false">Unpublished</option>
                </select>
              </td>
              <td className="p-4 space-x-2">
                <button
                  className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                  onClick={() => handleEdit(post.id)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withAuthGuard(DashboardPage);
