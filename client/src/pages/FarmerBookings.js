import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { useEquipment } from '../context/EquipmentContext';

export default function FarmerBookings() {
  const { bookingRequests, fetchBookingRequests } = useEquipment();
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchBookingRequests();
  }, [fetchBookingRequests]);

  const allBookings = useMemo(() => {
    return bookingRequests.map((request) => ({
      id: request.id,
      equipment: request.equipmentName,
      date: new Date(request.createdAt).toLocaleDateString(),
      duration: request.rate,
      status: request.status,
      ownerEmail: request.ownerEmail,
      ownerContact: request.ownerContact,
      ownerLocation: request.ownerLocation,
      requesterContact: request.requesterContact,
      requesterEmail: request.requesterEmail,
      bookingLocation: request.bookingLocation,
      hours: request.hours,
      requesterMessage: request.requesterMessage,
      ownerMessage: request.ownerMessage,
    }));
  }, [bookingRequests]);

  const filteredBookings = useMemo(
    () => allBookings.filter((booking) => statusFilter === 'All' || booking.status === statusFilter),
    [statusFilter, allBookings]
  );

  const requestCount = bookingRequests.length;

  return (
    <DashboardLayout>
      <section className="rounded-3xl bg-white p-10 shadow-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="mt-3 text-slate-600">Track and manage your equipment rental bookings.</p>
          </div>
          <Link to="/farmer-dashboard" className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Booking overview</h2>
              <p className="mt-2 text-slate-600">Filter bookings by status to manage your schedule.</p>
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
            >
              <option>All</option>
              <option>Requested</option>
              <option>Confirmed</option>
              <option>Rejected</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        {requestCount > 0 && (
          <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-700">
            <h2 className="text-lg font-semibold">Booking requests sent</h2>
            <p className="mt-2 text-slate-700">
              You have sent {requestCount} request{requestCount === 1 ? '' : 's'} to equipment owners.
            </p>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{booking.equipment}</h2>
                  <p className="mt-2 text-slate-600">{booking.date} · {booking.duration}</p>
                  {booking.ownerEmail && <p className="mt-2 text-slate-600">Owner email: {booking.ownerEmail}</p>}
                  {booking.ownerContact && <p className="mt-2 text-slate-600">Owner contact: {booking.ownerContact}</p>}
                  {booking.ownerLocation && <p className="mt-2 text-slate-600">Owner location: {booking.ownerLocation}</p>}
                  {booking.hours && <p className="mt-2 text-slate-600">Hours: {booking.hours}</p>}
                  {booking.bookingLocation && <p className="mt-2 text-slate-600">Place: {booking.bookingLocation}</p>}
                  {booking.requesterContact && <p className="mt-2 text-slate-600">Your contact: {booking.requesterContact}</p>}
                  {booking.requesterEmail && <p className="mt-2 text-slate-600">Your email: {booking.requesterEmail}</p>}
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  booking.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : booking.status === 'Rejected'
                    ? 'bg-red-100 text-red-700'
                    : booking.status === 'Requested' || booking.status === 'Pending'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {booking.status || 'Requested'}
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {booking.requesterMessage && (
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {booking.requesterMessage}
                  </div>
                )}
                {booking.ownerMessage && (
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {booking.ownerMessage}
                  </div>
                )}
                {booking.status === 'Requested' && (
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Awaiting owner confirmation.
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredBookings.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-600">
              No bookings match the selected filter.
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
