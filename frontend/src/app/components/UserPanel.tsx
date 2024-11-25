import { useEffect, useState } from 'react';
import { useAuthStore, User } from '@/lib/store';
import { useRouter } from 'next/navigation'

const UserPanel = () => {
  const { user, logout, setUser, getUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('doppio_u_token');
      if (token) {
        try {
          const user = await getUser(token)
          if (user != undefined) {
            setUser(user); // Assuming the backend response contains `user`
          } else {
            console.error('Failed to fetch user:', 'Unknown error');
          }
        } catch (err) {
          localStorage.removeItem('doppio_u_token');
          // console.error('Error fetching user:', err);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [setUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div className='flex space-x-4 items-center'>
            {/* { user && <UserBadge user={user} /> } */}
            <div className='mx-3 font-bold text-md capitalize'>
              <span className='font-thin'>Hello, </span>
              {user.name}
            </div>
            <button name="logout" onClick={() => router.push('/dashboard')} className="inline-block bg-green-500 text-white p-2 px-5 rounded-sm">
                Dashboard
            </button>          
            <button name="logout" onClick={() => logout(router)} className="inline-block bg-blue-500 text-white p-2 px-5 rounded-sm">
                Logout
            </button>          
        </div>
      ) : (
        <div className='space-x-4'>
            <button name="login" onClick={() => router.push('/auth/login')} className="bg-blue-600 text-white p-2 px-5 rounded-sm">
                Login
            </button>
            <button name="register" onClick={() => router.push('/auth/register')} className="bg-gray-400 text-white p-2 px-5 rounded-sm ">
                Register
            </button>
        </div>
      )}
    </div>
  );
};

export default UserPanel;