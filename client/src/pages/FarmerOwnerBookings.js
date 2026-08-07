import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { useEquipment } from '../context/EquipmentContext';

export default function FarmerOwnerBookings() {
  const { ownerBookingRequests, updateBookingRequestStatus, fetchOwnerBookingRequests } = useEquipment();
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchOwnerBookingRequests();
  }, [fetchOwnerBookingRequests]);
  const [actionError, setActionError] = useState('');
  const [updatingIds, setUpdatingIds] = useState([]);

  const filteredRequests = useMemo(
    () => ownerBookingRequests.filter((request) => statusFilter === 'All' || request.status === statusFilter),
    [ownerBookingRequests, statusFilter]
  );

  const handleStatusUpdate = async (id, newStatus) => {
    setActionError('');
    setUpdatingIds((current) => [...current, id]);
    try {
      await updateBookingRequestStatus(id, newStatus);
    } catch (error) {
      setActionError(error.message || 'Unable to update request status');
    } finally {
      setUpdatingIds((current) => current.filter((requestId) => requestId !== id));
    }
  };

  return (
    <DashboardLayout>
      <section className="rounded-3xl bg-white p-10 shadow-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Incoming Booking Requests</h1>
            <p className="mt-3 text-slate-600">Review and respond to booking requests for your equipment.</p>
          </div>
          <Link to="/farmer-dashboard" className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Request overview</h2>
              <p className="mt-2 text-slate-600">Filter incoming requests and take action when ready.</p>
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

        {actionError && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            {actionError}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{request.equipmentName}</h2>
                  <p className="mt-2 text-slate-600">Requested by: {request.requesterName}</p>
                  {request.requesterEmail && <p className="mt-2 text-slate-600">Requester email: {request.requesterEmail}</p>}
                  <p className="mt-2 text-slate-600">Rate: {request.rate}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  request.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : request.status === 'Rejected'
                    ? 'bg-red-100 text-red-700'
                    : request.status === 'Requested'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {request.status}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {request.requesterMessage && (
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {request.requesterMessage}
                  </div>
                )}
                {request.ownerMessage && (
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {request.ownerMessage}
                  </div>
                )}
                {request.hours && (
                  <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">Hours requested: {request.hours}</p>
                )}
                {request.bookingLocation && (
                  <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">Place: {request.bookingLocation}</p>
                )}
                {request.requesterContact && (
                  <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">Requester contact: {request.requesterContact}</p>
                )}
                {request.requesterEmail && (
                  <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">Requester email: {request.requesterEmail}</p>
                )}
                {request.status === 'Requested' && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(request.id, 'Confirmed')}
                      disabled={updatingIds.includes(request.id)}
                      className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                    >
                      {updatingIds.includes(request.id) ? 'Saving…' : 'Confirm'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(request.id, 'Rejected')}
                      disabled={updatingIds.includes(request.id)}
                      className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredRequests.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-600">
              No incoming requests match the selected filter.
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
