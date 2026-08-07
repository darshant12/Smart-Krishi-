import { useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useEquipment } from '../context/EquipmentContext';
import { useAuth } from '../context/AuthContext';

export default function FarmerSearchEquipment() {
  const { equipment, addBookingRequest } = useEquipment();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [confirmationItem, setConfirmationItem] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ hours: 1, requesterContact: '', requesterEmail: user?.email || '', bookingLocation: '' });
  const [bookingError, setBookingError] = useState('');
  const navigate = useNavigate();

  const filteredListings = useMemo(() => {
    const base = [...equipment];
    return base.filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || item.type === category;
      return matchesQuery && matchesCategory;
    });
  }, [equipment, query, category]);

  return (
    <DashboardLayout>
      <section className="rounded-3xl bg-white p-10 shadow-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Search Equipment</h1>
            <p className="mt-3 text-slate-600">Search local equipment listings and request rentals from other farmers.</p>
          </div>
          <Link to="/farmer-dashboard" className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <label className="block text-sm font-medium text-slate-700">Search listings</label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by equipment name or type"
              className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
            />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
            >
              <option>All</option>
              <option>Tractor</option>
              <option>Seeder</option>
              <option>Harvester</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredListings.length > 0 ? (
            filteredListings.map((item) => {
              const imageSrc = item.photoUrl && item.photoUrl.startsWith('/uploads') ? `http://localhost:5000${item.photoUrl}` : item.photoUrl;
              return (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  {imageSrc ? (
                    <img src={imageSrc} alt={item.name} className="h-48 w-full rounded-3xl object-cover" />
                  ) : (
                    <div className="h-48 w-full rounded-3xl bg-slate-100" />
                  )}
                  <h2 className="mt-4 text-xl font-semibold">{item.name}</h2>
                  <p className="mt-2 text-slate-600">{item.type}</p>
                  <p className="mt-4 text-slate-700">Location: {item.location}</p>
                  <p className="mt-2 text-slate-700">Rate: {item.rate}</p>
                  {item.ownerName && <p className="mt-2 text-slate-700">Owner: {item.ownerName}</p>}
                  {item.ownerEmail && <p className="mt-2 text-slate-700">Owner email: {item.ownerEmail}</p>}
                  {item.contact && <p className="mt-2 text-slate-700">Contact: {item.contact}</p>}
                  {item.description && <p className="mt-3 text-slate-600">{item.description}</p>}
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmationItem(item);
                      setBookingError('');
                      setBookingDetails({
                        hours: 1,
                        requesterContact: '',
                        requesterEmail: user?.email || '',
                        bookingLocation: '',
                      });
                    }}
                    className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 text-center"
                  >
                    Request booking
                  </button>
                </div>
              );
            })
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-600">
              No equipment listings match your search.
            </div>
          )}
        </div>

        {confirmationItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
              <h2 className="text-2xl font-semibold">Confirm booking request</h2>
              <p className="mt-4 text-slate-600">Are you sure you want to request booking for <strong>{confirmationItem.name}</strong> at {confirmationItem.rate}?</p>
              {confirmationItem.ownerName && (
                <p className="mt-3 text-slate-600">Request will be sent to <strong>{confirmationItem.ownerName}</strong> ({confirmationItem.ownerEmail || 'owner email unavailable'}).</p>
              )}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-slate-700">Number of hours</span>
                  <input
                    type="number"
                    min="1"
                    value={bookingDetails.hours}
                    onChange={(event) => setBookingDetails((prev) => ({ ...prev, hours: Number(event.target.value) }))}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                  />
                </label>
                <label className="block">
                  <span className="text-slate-700">Contact number</span>
                  <input
                    type="tel"
                    value={bookingDetails.requesterContact}
                    onChange={(event) => setBookingDetails((prev) => ({ ...prev, requesterContact: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                  />
                </label>
                <label className="block">
                  <span className="text-slate-700">Email</span>
                  <input
                    type="email"
                    value={bookingDetails.requesterEmail}
                    onChange={(event) => setBookingDetails((prev) => ({ ...prev, requesterEmail: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                  />
                </label>
                <label className="block">
                  <span className="text-slate-700">Place</span>
                  <input
                    type="text"
                    value={bookingDetails.bookingLocation}
                    onChange={(event) => setBookingDetails((prev) => ({ ...prev, bookingLocation: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                  />
                </label>
              </div>
              {bookingError && (
                <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {bookingError}
                </div>
              )}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmationItem(null)}
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!bookingDetails.requesterContact || !bookingDetails.requesterEmail || !bookingDetails.bookingLocation || !bookingDetails.hours) {
                      setBookingError('Please enter hours, contact, email, and place before confirming.');
                      return;
                    }
                    try {
                      await addBookingRequest({
                        equipmentId: confirmationItem.id,
                        hours: bookingDetails.hours,
                        requesterContact: bookingDetails.requesterContact,
                        requesterEmail: bookingDetails.requesterEmail,
                        bookingLocation: bookingDetails.bookingLocation,
                      });
                      setConfirmationItem(null);
                      navigate('/farmer-bookings');
                    } catch (error) {
                      console.error(error);
                      setBookingError(error.message || 'Booking request failed.');
                    }
                  }}
                  className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Confirm booking
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
