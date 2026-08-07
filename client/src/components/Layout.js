import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    setShowProfile(false);
    logout();
    navigate('/');
  };

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Close on route change
  useEffect(() => { setShowProfile(false); }, [location]);

  const initials = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #f5f2ec 0%, #eef4eb 60%, #f0ede6 100%)' }}>
      {/* ── HEADER ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-xl' : 'shadow-md'
        }`}
        style={{ background: 'linear-gradient(100deg, #152211 0%, #2a4323 40%, #3f6534 75%, #2b343b 100%)' }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-3.5">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-xl shadow-inner group-hover:bg-white/20 transition">🌾</span>
            <span className="font-outfit text-xl font-black tracking-tight text-white">
              Smart<span className="text-soft-fawn-300">Krishi</span>
            </span>
          </Link>

          {/* Main nav */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin-dashboard' : '/farmer-dashboard'}
                  className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-white/12 px-4 py-2 text-sm font-semibold text-white hover:bg-white/22 transition border border-white/15"
                >
                  <span>📊</span> Dashboard
                </Link>

                {/* Profile avatar */}
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setShowProfile((v) => !v)}
                    className="relative flex h-9 w-9 items-center justify-center rounded-full font-bold text-hunter-900 shadow-md ring-2 ring-white/40 hover:ring-white/70 transition-all"
                    style={{ background: 'linear-gradient(135deg, #daaf58, #c87337)' }}
                    aria-label="Account"
                  >
                    {initials}
                  </button>

                  {showProfile && (
                    <div className="animate-slidedown absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
                      {/* Gradient header */}
                      <div
                        className="flex items-center gap-3 px-5 py-4"
                        style={{ background: 'linear-gradient(135deg, #2a4323, #3f6534)' }}
                      >
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-black text-hunter-900 shadow"
                          style={{ background: 'linear-gradient(135deg, #daaf58, #c87337)' }}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="font-outfit text-base font-bold text-white">{user.name}</p>
                          <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-soft-fawn-300">
                            {user.role === 'admin' ? '🛡 Admin' : '🌱 Farmer'}
                          </p>
                        </div>
                      </div>

                      {/* Info rows */}
                      <div className="space-y-0 bg-white px-5 py-3 text-sm">
                        {[
                          ['📧', 'Email', user.email],
                          user.phone && ['📞', 'Phone', user.phone],
                          user.village && ['📍', 'Village', user.village],
                        ].filter(Boolean).map(([icon, label, val]) => (
                          <div key={label} className="flex items-center gap-2 border-b border-onyx-100 py-2.5 last:border-0">
                            <span className="text-base">{icon}</span>
                            <span className="font-semibold text-onyx-600 w-16 shrink-0">{label}</span>
                            <span className="text-onyx-800 truncate">{val}</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 border-t border-onyx-100 bg-white px-4 py-3">
                        <Link
                          to={user.role === 'admin' ? '/admin-dashboard' : '/farmer-dashboard'}
                          className="flex-1 rounded-xl bg-hunter-700 py-2.5 text-center text-xs font-bold text-white hover:bg-hunter-800 transition"
                        >
                          Dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex-1 rounded-xl border border-chocolate-200 bg-chocolate-50 py-2.5 text-xs font-bold text-chocolate-700 hover:bg-chocolate-100 transition"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-xl bg-chocolate-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-chocolate-600 transition"
              >
                Login →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-5 py-8 animate-fadein">
        {children}
      </main>

      <Footer />
    </div>
  );
}
