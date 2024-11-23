import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';

const User = () => {
  const { user, logout, setUser, getUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

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
        <>
          <h1>name <span>{user?.name}</span></h1>
          <div>{JSON.stringify(user)}</div>
          <br />
          <button name="Logout" onClick={logout} className="bg-blue-500 text-white p-2">
            Logout
          </button>
        </>
      ) : (
        <div>No user</div>
      )}
    </div>
  );
};

export default User;