"use client";

import { useEffect } from 'react';
import withAuthGuard from '@/components/AuthGuard'
import { useUserStore, useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { date_format } from '@/lib/date'

const DashboardPage = () => {
  const router = useRouter()
  const { user, token } = useAuthStore();
  const { users, userInfo, fetchUsers, toggleAdmin } = useUserStore();

  useEffect(() => {
    const getUser = async () => {
      if(user != null && token != null){
        await fetchUsers({ page: 1 , token })  
      }
    };
    getUser();
  }, [user]);

  const handleEdit = (id: number) => {
    router.push(`/dashboard/users/${id}/edit`);
  };

  const handleCreate = () => {
    router.push('/dashboard/users/create');
  };

  const handleToggleAdmin = async (id: number, currentStatus: boolean) => {
    if(token != null){
      await toggleAdmin(id, currentStatus, token);
    }
    alert(`User status updated to ${!currentStatus ? 'Admin' : 'Writer'}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {userInfo?.totalUsers 
            ? `Total ${userInfo.totalUsers} users` 
            : 'User Dashboard'}
        </h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleCreate}
        >
          Create User +
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-4 text-left font-medium text-gray-600">ID</th>
            <th className="p-4 text-left font-medium text-gray-600">Name</th>
            <th className="p-4 text-left font-medium text-gray-600">Email</th>
            <th className="p-4 text-left font-medium text-gray-600">Date</th>
            <th className="p-4 text-left font-medium text-gray-600">Published</th>
            <th className="p-4 text-left font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{user.id}</td>
              <td className="p-4">{user.name}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">{date_format(user.date)}</td>
              <td className="p-4">
                <select
                  value={user.adminRole ? 'true' : 'false'}
                  onChange={() => handleToggleAdmin(user.id, user.adminRole)}
                  className="p-2 border rounded"
                >
                  <option value="true">Admin</option>
                  <option value="false">Writer</option>
                </select>
              </td>
              <td className="p-4 space-x-2">
                <button
                  className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                  onClick={() => handleEdit(user.id)}
                >
                  Edit
                </button>
                {/* <button
                  className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withAuthGuard(DashboardPage);
