import { useState } from 'react';
import { useAuthStore } from '@/lib/store';

const Register = () => {
  const register = useAuthStore((state) => state.register);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    try {
      setSuccess(false);
      setError('');
      await register(name, email, password);
      setName('');
      setEmail('');
      setPassword('');
      setSuccess(true);
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p className="text-red-500" role="alert">{error}</p>}
      {success && <p className="text-green-500" role="status">Registration successful!</p>}
      <input
        type="text"
        placeholder="Name"
        aria-label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2"
      />
      <input
        type="email"
        placeholder="Email"
        aria-label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
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
        className="bg-blue-500 text-white p-2"
        aria-label="Submit Registration"
      >
        Submit
      </button>
    </div>
  );
};

export default Register;
