import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import API_BASE from '../config';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim(),
          village: village.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Registration failed.');
      }

      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">Create Account</h1>
          <p className="text-sm text-center text-slate-500 mb-6">Join SmartKrishi Share as a farmer</p>

          {error && (
            <p className="rounded-md bg-red-100 px-4 py-2 text-sm text-red-800 mb-4 text-center">{error}</p>
          )}
          {success && (
            <p className="rounded-md bg-green-100 px-4 py-2 text-sm text-green-800 mb-4 text-center">{success}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-slate-700 text-sm font-medium">Full Name <span className="text-red-500">*</span></span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="Your full name"
                required
              />
            </label>

            <label className="block">
              <span className="text-slate-700 text-sm font-medium">Email <span className="text-red-500">*</span></span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="block">
              <span className="text-slate-700 text-sm font-medium">Password <span className="text-red-500">*</span></span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="Minimum 6 characters"
                required
              />
            </label>

            <label className="block">
              <span className="text-slate-700 text-sm font-medium">Phone <span className="text-slate-400 font-normal">(optional)</span></span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="Your phone number"
              />
            </label>

            <label className="block">
              <span className="text-slate-700 text-sm font-medium">Village / Town <span className="text-slate-400 font-normal">(optional)</span></span>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="Your village or town"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
