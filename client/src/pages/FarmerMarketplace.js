import { useMemo, useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';

// Local browse items
const localItems = [
  { id: 1, name: 'Tomatoes', type: 'Vegetables', price: '₹40/kg', location: 'Local vegetable market', description: 'Fresh tomatoes sourced from nearby farms.' },
  { id: 2, name: 'Bananas', type: 'Fruits', price: '₹35/kg', location: 'Town fruit market', description: 'Sweet yellow bananas available today.' },
  { id: 3, name: 'Roses', type: 'Flowers', price: '₹120/bunch', location: 'City flower market', description: 'Fresh red roses for gifting and decoration.' },
  { id: 4, name: 'Potatoes', type: 'Vegetables', price: '₹28/kg', location: 'Rural goods market', description: 'New crop potatoes with good texture.' },
  { id: 5, name: 'Mangoes', type: 'Fruits', price: '₹160/kg', location: 'Seasonal market', description: 'Ripe mangoes rich in flavor and sweetness.' },
  { id: 6, name: 'Marigold', type: 'Flowers', price: '₹90/bunch', location: 'Garden market', description: 'Bright marigold flowers for festivals and ceremonies.' },
  { id: 7, name: 'Cabbage', type: 'Vegetables', price: '₹24/kg', location: 'Farmers market', description: 'Fresh green cabbage with crisp leaves.' },
  { id: 8, name: 'Grapes', type: 'Fruits', price: '₹220/kg', location: 'Fruit bazaar', description: 'Juicy and sweet grapes from local orchards.' },
  { id: 9, name: 'Jasmine', type: 'Flowers', price: '₹150/bunch', location: 'Flower stall', description: 'Aromatic jasmine flowers perfect for decoration.' },
  { id: 10, name: 'Spinach', type: 'Vegetables', price: '₹35/kg', location: 'Green market', description: 'Leafy spinach with high nutrition.' },
  { id: 11, name: 'Apples', type: 'Fruits', price: '₹180/kg', location: 'Fruit market', description: 'Crisp and juicy apples from nearby orchards.' },
  { id: 12, name: 'Sunflowers', type: 'Flowers', price: '₹110/bunch', location: 'Florist market', description: 'Bright sunflowers popular for decor.' },
  { id: 13, name: 'Onions', type: 'Vegetables', price: '₹32/kg', location: 'Wholesale market', description: 'Red onions with strong aroma.' },
  { id: 14, name: 'Oranges', type: 'Fruits', price: '₹140/kg', location: 'Citrus market', description: 'Sweet oranges rich in vitamin C.' },
  { id: 15, name: 'Lilies', type: 'Flowers', price: '₹200/bunch', location: 'Flower bazaar', description: 'Elegant lilies perfect for special occasions.' },
];

const STATES = ['All States', 'Maharashtra', 'Punjab', 'Uttar Pradesh', 'Karnataka', 'Gujarat', 'Rajasthan', 'Andhra Pradesh', 'Telangana', 'Madhya Pradesh', 'West Bengal', 'Bihar', 'Tamil Nadu', 'Delhi', 'Himachal Pradesh', 'Kerala'];

export default function FarmerMarketplace() {
  const [activeTab, setActiveTab] = useState('mandi');

  // Mandi tab state
  const [mandiData, setMandiData] = useState([]);
  const [mandiLoading, setMandiLoading] = useState(false);
  const [mandiError, setMandiError] = useState('');
  const [mandiSource, setMandiSource] = useState('');
  const [mandiCommodity, setMandiCommodity] = useState('');
  const [mandiState, setMandiState] = useState('All States');

  // Local browse tab state
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const fetchMandiPrices = async () => {
    setMandiLoading(true);
    setMandiError('');
    try {
      const params = new URLSearchParams({ limit: 60 });
      if (mandiCommodity.trim()) params.set('commodity', mandiCommodity.trim());
      if (mandiState !== 'All States') params.set('state', mandiState);

      const res = await fetch(`/api/mandi?${params.toString()}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      setMandiData(json.records || []);
      setMandiSource(json.source || '');
    } catch (err) {
      setMandiError(err.message || 'Failed to fetch mandi prices');
      setMandiData([]);
    } finally {
      setMandiLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'mandi') {
      fetchMandiPrices();
    }
  }, [activeTab]); // fetchMandiPrices is stable — intentional dep omission

  const filteredLocal = useMemo(
    () => localItems.filter((item) => {
      const matchesCategory = category === 'All' || item.type === category;
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch = !query ||
        item.name.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.price.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    }),
    [category, searchTerm]
  );

  const handleGoogleSearch = (query) => {
    const q = query || searchTerm || 'agricultural produce';
    window.open(`https://www.google.com/search?q=${encodeURIComponent(q + ' market price mandi India')}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <DashboardLayout>
      <section className="space-y-6">
        {/* Page Header */}
        <div className="rounded-3xl bg-white p-8 shadow-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-hunter-100 px-3.5 py-1 text-xs font-semibold text-hunter-800">
                🌾 Crop & Mandi Marketplace
              </div>
              <h1 className="mt-3 text-3xl font-extrabold text-onyx-900 sm:text-4xl">Crop Marketplace</h1>
              <p className="mt-2 text-sm text-onyx-600">
                Live AGMARKNET mandi prices from across India + local produce listings.
              </p>
            </div>
            <Link
              to="/farmer-dashboard"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-hunter-700 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-hunter-800 transition"
            >
              &larr; Back to Dashboard
            </Link>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2 rounded-2xl bg-soft-fawn-50/80 p-1.5 border border-onyx-200/60">
            <button
              type="button"
              onClick={() => setActiveTab('mandi')}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${activeTab === 'mandi' ? 'bg-white text-hunter-800 shadow-md' : 'text-onyx-600 hover:text-onyx-900'}`}
            >
              📊 Live Mandi Prices
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${activeTab === 'browse' ? 'bg-white text-hunter-800 shadow-md' : 'text-onyx-600 hover:text-onyx-900'}`}
            >
              🛒 Browse Local Listings
            </button>
          </div>
        </div>

        {/* LIVE MANDI PRICES TAB */}
        {activeTab === 'mandi' && (
          <div className="space-y-6">
            {/* Mandi Filters */}
            <div className="rounded-3xl bg-white p-6 shadow-md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-onyx-600">Commodity / Crop</label>
                  <input
                    type="text"
                    value={mandiCommodity}
                    onChange={(e) => setMandiCommodity(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchMandiPrices()}
                    placeholder="e.g. Tomato, Wheat, Onion..."
                    className="mt-2 w-full rounded-2xl border border-onyx-300 bg-soft-fawn-50 px-4 py-3 text-sm text-onyx-900 outline-none transition focus:border-hunter-600 focus:ring-2 focus:ring-hunter-200"
                  />
                </div>
                <div className="w-full sm:w-56">
                  <label className="text-xs font-semibold uppercase tracking-wider text-onyx-600">State</label>
                  <select
                    value={mandiState}
                    onChange={(e) => setMandiState(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-onyx-300 bg-soft-fawn-50 px-4 py-3 text-sm text-onyx-900 outline-none transition focus:border-hunter-600"
                  >
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={fetchMandiPrices}
                  disabled={mandiLoading}
                  className="rounded-2xl bg-hunter-700 px-8 py-3 text-sm font-bold text-white shadow hover:bg-hunter-800 disabled:opacity-50 transition"
                >
                  {mandiLoading ? 'Loading…' : '🔍 Fetch Prices'}
                </button>
              </div>

              {/* Source indicator */}
              {mandiSource && !mandiLoading && (
                <div className="mt-4 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${mandiSource === 'live' ? 'bg-hunter-100 text-hunter-800' : mandiSource === 'cache' ? 'bg-fawn-100 text-fawn-800' : 'bg-onyx-100 text-onyx-700'}`}>
                    {mandiSource === 'live' ? '🟢 Live AGMARKNET Data' : mandiSource === 'cache' ? '🟡 Cached Data' : '⚪ Reference Data'}
                  </span>
                  <span className="text-xs text-onyx-500">{mandiData.length} commodity prices</span>
                </div>
              )}
            </div>

            {/* Error */}
            {mandiError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                ⚠️ {mandiError}
              </div>
            )}

            {/* Loading Spinner */}
            {mandiLoading && (
              <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-hunter-700 border-t-transparent" />
                <p className="mt-4 text-sm font-semibold text-onyx-600">Fetching live mandi prices from AGMARKNET…</p>
              </div>
            )}

            {/* Mandi Price Table */}
            {!mandiLoading && mandiData.length > 0 && (
              <div className="rounded-3xl bg-white shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-hunter-800 text-white">
                      <tr>
                        <th className="px-5 py-4 text-left font-semibold">Commodity</th>
                        <th className="px-5 py-4 text-left font-semibold hidden sm:table-cell">Variety</th>
                        <th className="px-5 py-4 text-left font-semibold">Market</th>
                        <th className="px-5 py-4 text-left font-semibold hidden md:table-cell">State</th>
                        <th className="px-5 py-4 text-right font-semibold">Min (₹/Q)</th>
                        <th className="px-5 py-4 text-right font-semibold">Max (₹/Q)</th>
                        <th className="px-5 py-4 text-right font-semibold">Modal (₹/Q)</th>
                        <th className="px-5 py-4 text-center font-semibold hidden lg:table-cell">Date</th>
                        <th className="px-5 py-4 text-center font-semibold">Search</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mandiData.map((row, idx) => (
                        <tr key={idx} className={`border-t border-onyx-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-soft-fawn-50/40'} hover:bg-hunter-50/60 transition`}>
                          <td className="px-5 py-3.5 font-bold text-onyx-900">{row.commodity}</td>
                          <td className="px-5 py-3.5 text-onyx-600 hidden sm:table-cell">{row.variety || '—'}</td>
                          <td className="px-5 py-3.5 text-onyx-700">{row.market}</td>
                          <td className="px-5 py-3.5 text-onyx-600 hidden md:table-cell">{row.state}</td>
                          <td className="px-5 py-3.5 text-right font-medium text-onyx-700">₹{row.minPrice.toLocaleString('en-IN')}</td>
                          <td className="px-5 py-3.5 text-right font-medium text-onyx-700">₹{row.maxPrice.toLocaleString('en-IN')}</td>
                          <td className="px-5 py-3.5 text-right font-extrabold text-chocolate-700">₹{row.modalPrice.toLocaleString('en-IN')}</td>
                          <td className="px-5 py-3.5 text-center text-xs text-onyx-500 hidden lg:table-cell">{row.date}</td>
                          <td className="px-5 py-3.5 text-center">
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(row.commodity + ' mandi price India ' + row.state)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-full bg-hunter-100 px-3 py-1 text-xs font-bold text-hunter-800 hover:bg-hunter-200 transition"
                            >
                              🔍 Google
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-onyx-100 bg-soft-fawn-50 px-6 py-3 text-center text-xs text-onyx-500">
                  Data sourced from AGMARKNET, Ministry of Agriculture &amp; Farmers Welfare, Govt. of India
                </div>
              </div>
            )}

            {!mandiLoading && mandiData.length === 0 && !mandiError && (
              <div className="rounded-3xl bg-white p-12 text-center shadow-sm text-onyx-600">
                <p className="text-base font-semibold">No results found.</p>
                <p className="mt-2 text-sm">Try a different commodity name or clear the state filter.</p>
              </div>
            )}
          </div>
        )}

        {/* LOCAL BROWSE TAB */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Search Controls */}
            <div className="rounded-3xl bg-white p-6 shadow-md">
              <form
                onSubmit={(e) => { e.preventDefault(); handleGoogleSearch(searchTerm); }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search produce name, or type to also search Google..."
                    className="w-full rounded-2xl border border-onyx-300 bg-soft-fawn-50 px-5 py-3.5 pl-11 text-sm text-onyx-900 outline-none transition focus:border-hunter-600 focus:ring-2 focus:ring-hunter-200"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-onyx-400">🔍</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleGoogleSearch(searchTerm)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-chocolate-600 to-chocolate-700 px-6 py-3.5 text-sm font-semibold text-white shadow hover:from-chocolate-700 hover:to-chocolate-800 transition"
                >
                  🔎 Search on Google
                </button>
              </form>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-onyx-100/60 pt-4">
                <p className="text-xs text-onyx-600">
                  Showing <span className="font-bold text-onyx-900">{filteredLocal.length}</span> local listing{filteredLocal.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-onyx-600">Category:</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-2xl border border-onyx-300 bg-white px-4 py-2 text-sm text-onyx-900 outline-none transition focus:border-hunter-600"
                  >
                    <option>All</option>
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Flowers</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredLocal.length > 0 ? (
                filteredLocal.map((item) => (
                  <div key={item.id} className="flex flex-col justify-between rounded-3xl border border-onyx-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
                    <div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-onyx-900">{item.name}</h2>
                        <span className="rounded-full bg-hunter-100 px-3 py-0.5 text-xs font-semibold text-hunter-800">{item.type}</span>
                      </div>
                      <p className="mt-3 text-2xl font-extrabold text-chocolate-700">{item.price}</p>
                      <p className="mt-2 text-xs font-medium text-onyx-600">📍 {item.location}</p>
                      <p className="mt-3 text-sm text-onyx-700 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="mt-6 flex flex-col gap-2 border-t border-onyx-100 pt-4">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(item.name + ' current mandi price India')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-hunter-600/30 bg-hunter-50 px-4 py-2.5 text-xs font-bold text-hunter-800 hover:bg-hunter-100 transition"
                      >
                        🔍 Google Price Search
                      </a>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(item.name + ' buy bulk online India')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-hunter-700 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-hunter-800 transition"
                      >
                        🛒 Find Suppliers on Google
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-3xl border border-onyx-200 bg-white p-12 text-center text-onyx-600">
                  <p className="font-semibold">No local produce matches "{searchTerm}".</p>
                  <button
                    type="button"
                    onClick={() => handleGoogleSearch(searchTerm)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-chocolate-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-chocolate-700 transition"
                  >
                    Search "{searchTerm}" on Google &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
