import { useEffect, useState } from 'react';
import { useAuthStore, User } from '@/lib/store';
import { useRouter } from 'next/navigation'

const UserBadge = ({ user } : {user: User}) => {
  const title = typeof user?.name == 'string' ? user?.name[0] : 'U'
  return <span 
    className='
      inline-block bg-purple-500 
      h-[32px] w-[32px] font-bold 
      flex items-center justify-center 
      text-white uppercase'>
    {title}
  </span>
}

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
          console.error('Error fetching user:', err);
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
            { user && <UserBadge user={user} /> }
            <div className='mx-3 font-bold text-lg text-white capitalize'>{user.name}</div>
            <button name="logout" onClick={() => router.push('/dashboard')} className="inline-block bg-green-500 text-white p-2 px-5 mx-3 rounded-md">
                Dashboard
            </button>          
            <button name="logout" onClick={() => logout(router)} className="inline-block bg-blue-500 text-white p-2 px-5 mx-3 rounded-md">
                Logout
            </button>          
        </div>
      ) : (
        <div>
            <button name="login" onClick={() => router.push('/auth/login')} className="bg-blue-500 text-white p-2 px-5 mx-3 rounded-md">
                Login
            </button>
            <button name="register" onClick={() => router.push('/auth/register')} className="bg-blue-500 text-white p-2 px-5 rounded-md ">
                Register
            </button>

        </div>
      )}
    </div>
  );
};

export default UserPanel;