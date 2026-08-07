import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useEquipment } from '../context/EquipmentContext';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const {
    equipment,
    bookingRequests,
    ownerBookingRequests,
    updateBookingRequestStatus,
    fetchEquipment,
    fetchBookingRequests,
    fetchOwnerBookingRequests,
  } = useEquipment();

  const [actionError, setActionError] = useState('');
  const [updatingIds, setUpdatingIds] = useState([]);

  useEffect(() => {
    fetchEquipment();
    fetchBookingRequests();
    fetchOwnerBookingRequests();
  }, [fetchEquipment, fetchBookingRequests, fetchOwnerBookingRequests]);

  // Derived metrics
  const availableEquipmentCount = useMemo(
    () => equipment.filter((item) => item.status === 'Available').length,
    [equipment]
  );

  const pendingOwnerRequests = useMemo(
    () => ownerBookingRequests.filter((req) => req.status === 'Requested' || req.status === 'Pending'),
    [ownerBookingRequests]
  );

  const confirmedMyBookingsCount = useMemo(
    () => bookingRequests.filter((req) => req.status === 'Confirmed').length,
    [bookingRequests]
  );

  const handleStatusUpdate = async (id, newStatus) => {
    setActionError('');
    setUpdatingIds((current) => [...current, id]);
    try {
      await updateBookingRequestStatus(id, newStatus);
      await fetchOwnerBookingRequests();
    } catch (error) {
      setActionError(error.message || 'Failed to update request status');
    } finally {
      setUpdatingIds((current) => current.filter((requestId) => requestId !== id));
    }
  };

  const dashboardActions = [
    {
      title: 'My Equipment',
      description: 'View, edit & manage your listed farm machinery for rent.',
      to: '/farmer-equipment',
      badge: `${equipment.length} items`,
      color: 'from-emerald-500 to-teal-600',
      icon: (
        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Add Equipment',
      description: 'List new tractor, tiller, harvester, or equipment.',
      to: '/farmer-add-equipment',
      badge: '+ List New',
      color: 'from-blue-500 to-indigo-600',
      icon: (
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Search Equipment',
      description: 'Browse available rentals from nearby farmers in your area.',
      to: '/farmer-search-equipment',
      badge: 'Rent Tools',
      color: 'from-amber-500 to-orange-600',
      icon: (
        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      title: 'My Bookings',
      description: 'Check status of equipment you requested for your farm.',
      to: '/farmer-bookings',
      badge: `${bookingRequests.length} requests`,
      color: 'from-purple-500 to-indigo-600',
      icon: (
        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Owner Requests',
      description: 'Manage & respond to rental requests from other farmers.',
      to: '/farmer-owner-bookings',
      badge: pendingOwnerRequests.length > 0 ? `${pendingOwnerRequests.length} pending` : 'No pending',
      badgeColor: pendingOwnerRequests.length > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-700',
      color: 'from-rose-500 to-pink-600',
      icon: (
        <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      title: 'Crop Marketplace',
      description: 'Real-time prices for vegetables, fruits & flowers.',
      to: '/farmer-marketplace',
      badge: 'Live Prices',
      color: 'from-emerald-600 to-green-700',
      icon: (
        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      ),
    },
    {
      title: 'Weather & Forecast',
      description: 'Local weather conditions, rain warnings & farming tips.',
      to: '/weather',
      badge: '34°C Sunny',
      color: 'from-sky-500 to-blue-600',
      icon: (
        <svg className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  const marketPreview = [
    { name: 'Tomatoes', price: '₹40/kg', trend: '↑ 5%' },
    { name: 'Potatoes', price: '₹28/kg', trend: '→ stable' },
    { name: 'Mangoes', price: '₹160/kg', trend: '↑ 12%' },
    { name: 'Onions', price: '₹32/kg', trend: '↓ 2%' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 px-4 py-1.5 text-xs font-semibold text-emerald-200 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{user?.village ? `📍 ${user.village}` : '🌾 Smart Krishi Dashboard'}</span>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Welcome back, {user?.name || 'Farmer'}! 👋
              </h1>
              <p className="mt-2 text-emerald-100 text-sm sm:text-base leading-relaxed">
                Manage your farm machinery rentals, track incoming booking requests, inspect market prices, and access local weather alerts in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/farmer-add-equipment"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-800 shadow-md transition hover:bg-emerald-50 hover:shadow-lg active:scale-95"
              >
                <span>+ Add Equipment</span>
              </Link>
              <Link
                to="/farmer-search-equipment"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-900/40 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-emerald-900/60 active:scale-95"
              >
                🔍 Rent Equipment
              </Link>
            </div>
          </div>

          {/* Decorative Background Circles */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 right-36 h-48 w-48 rounded-full bg-teal-400/10 blur-xl" />
        </section>

        {/* Action error banner */}
        {actionError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            ⚠️ {actionError}
          </div>
        )}

        {/* Actionable Pending Requests Banner (If any) */}
        {pendingOwnerRequests.length > 0 && (
          <section className="rounded-3xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    You have {pendingOwnerRequests.length} pending owner request{pendingOwnerRequests.length > 1 ? 's' : ''}!
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    Farmers are requesting to rent your equipment. Respond quickly to secure bookings.
                  </p>
                </div>
              </div>
              <Link
                to="/farmer-owner-bookings"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-rose-700 transition"
              >
                Review Requests &rarr;
              </Link>
            </div>

            {/* Quick Action List for First 2 Requests */}
            <div className="mt-5 space-y-3 border-t border-rose-200/60 pt-4">
              {pendingOwnerRequests.slice(0, 2).map((req) => (
                <div key={req.id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="font-semibold text-slate-900">{req.equipmentName}</span>
                    <span className="ml-2 text-xs text-slate-500">• Requested by {req.requesterName}</span>
                    <p className="text-xs text-slate-600 mt-0.5">Rate: {req.rate} {req.hours ? `(${req.hours} hrs)` : ''}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(req.id, 'Confirmed')}
                      disabled={updatingIds.includes(req.id)}
                      className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {updatingIds.includes(req.id) ? 'Saving...' : 'Accept'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(req.id, 'Rejected')}
                      disabled={updatingIds.includes(req.id)}
                      className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stats KPI Overview Grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">My Listed Equipment</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                🚜
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">{equipment.length}</p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-medium text-emerald-800">
                {availableEquipmentCount} Available
              </span>
              <span className="text-slate-500">
                {equipment.length - availableEquipmentCount} Rented
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">My Sent Bookings</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                📋
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">{bookingRequests.length}</p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 font-medium text-purple-800">
                {confirmedMyBookingsCount} Confirmed
              </span>
              <span className="text-slate-500">
                {bookingRequests.length - confirmedMyBookingsCount} Pending
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Owner Requests</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                📬
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">{ownerBookingRequests.length}</p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className={`rounded-full px-2.5 py-0.5 font-medium ${pendingOwnerRequests.length > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}`}>
                {pendingOwnerRequests.length} Need Action
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Today's Weather</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                ☀️
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">34°C</p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
              <span>Sunny • Breeze</span>
              <span className="font-semibold text-emerald-600">Good for field work</span>
            </div>
          </div>
        </section>

        {/* Main Hub: Quick Action Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Quick Access Hub</h2>
              <p className="text-sm text-slate-600">Navigate directly to your core farming services & rental features.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardActions.map((action) => (
              <Link
                key={action.title}
                to={action.to}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-emerald-50 transition">
                      {action.icon}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        action.badgeColor || 'bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                      }`}
                    >
                      {action.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {action.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                  <span>Open {action.title}</span>
                  <span className="ml-1">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Widgets Grid: Recent Activity & Market Prices */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Recent My Bookings Activity Widget */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recent Rental Applications</h3>
                <p className="text-xs text-slate-500">Status of equipment you have requested for your farm</p>
              </div>
              <Link to="/farmer-bookings" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                View all &rarr;
              </Link>
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              {bookingRequests.slice(0, 4).map((booking) => (
                <div key={booking.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{booking.equipmentName}</p>
                    <p className="text-xs text-slate-500">
                      Rate: {booking.rate} {booking.hours ? `• ${booking.hours} hours` : ''}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      booking.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : booking.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {booking.status || 'Requested'}
                  </span>
                </div>
              ))}

              {bookingRequests.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-500">
                  You haven't requested any equipment rentals yet.{' '}
                  <Link to="/farmer-search-equipment" className="font-semibold text-emerald-600 underline">
                    Browse equipment
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Market Commodity Snapshot Widget */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Crop Prices</h3>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                  Live Market
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Today's local mandi prices</p>

              <div className="mt-5 space-y-3">
                {marketPreview.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2.5">
                    <span className="text-sm font-semibold text-slate-800">{item.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900">{item.price}</span>
                      <span className="ml-2 text-xs font-medium text-emerald-600">{item.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/farmer-marketplace"
              className="mt-6 block w-full rounded-2xl bg-slate-900 py-3 text-center text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              Explore Full Marketplace &rarr;
            </Link>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

