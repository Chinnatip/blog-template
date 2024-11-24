import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation'

const Register = () => {
  const { register } = useAuthStore()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter()

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      setSuccess(false);
      await register(name, email, password, router);
      setName('');
      setEmail('');
      setPassword('');
      setSuccess(true);
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className='min-w-[360px] p-6 border rounded-lg bg-white'>
      <h1 className='text-2xl font-bold'>Register</h1>
      {error && <p className="text-red-500" role="alert">{error}</p>}
      {success && <p className="text-green-500" role="status">Registration successful!</p>}
      <form onSubmit={handleRegister} className='flex flex-col'>
        <label className='mt-4 mb-1' htmlFor="name">Name</label>
        <input
          type="text"
          placeholder="Name"
          aria-label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />
        <label className='mt-4 mb-1' htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Email"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <label className='mt-4 mb-1' htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          aria-label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={handleRegister}
          className="mt-6 rounded-lg bg-blue-500 text-white p-2"
          aria-label="Submit Registration"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
