import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const parseResponse = async (response) => {
      const text = await response.text();
      const contentType = response.headers.get('Content-Type') || response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          return JSON.parse(text);
        } catch {
          return { message: text };
        }
      }
      return { message: text };
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        const message = data?.message || 'Login failed. Please check that the backend is running.';
        throw new Error(message);
      }

      login(data);
      navigate(data.user.role === 'admin' ? '/admin-dashboard' : '/farmer-dashboard');
    } catch (err) {
      const message = err?.message || 'Login failed. Please try again.';
      setError(message);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {error && <p className="rounded-md bg-red-100 px-4 py-2 text-sm text-red-800 mb-4 text-center">{error}</p>}
          <label className="block">
            <span className="text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="block">
            <span className="text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Password"
              required
            />
          </label>
          <button type="submit" className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3 hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
            Login
          </button>
        </form>
      </section>
    </Layout>
  );
}
