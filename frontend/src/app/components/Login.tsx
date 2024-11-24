import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation'

const Login = () => {
  const { login } = useAuthStore()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter()

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      await login(email, password, router);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err)
      setError('Invalid credentials');
    }
  };

  return (
    <div className='min-w-[360px] p-6 border rounded-lg bg-white'>
      <h1 className='text-2xl font-bold'>Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className='flex flex-col'>
        <label className='mt-4 mb-1' htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <label className='mt-4 mb-1' htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="mt-6 rounded-lg bg-blue-500 text-white p-2">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
