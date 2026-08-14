import { useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Link, useParams } from 'react-router-dom';
import { useEquipment } from '../context/EquipmentContext';
import API_BASE from '../config';

export default function FarmerEquipment() {
  const { slotId } = useParams();
  const { equipment } = useEquipment();
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const title = slotId ? `Equipment in ${slotId.replace(/-/g, ' ')}` : 'My Equipment';
  const description = slotId
    ? `View and manage the equipment assigned to ${slotId.replace(/-/g, ' ')}.`
    : 'View and manage the equipment you have listed for rent.';

  const filteredEquipment = useMemo(
    () => equipment.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) || item.type.toLowerCase().includes(search.toLowerCase())
    ),
    [equipment, search]
  );

  return (
    <DashboardLayout>
      <section className="rounded-3xl bg-white p-10 shadow-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-3 text-slate-600">{description}</p>
          </div>
          <Link to="/farmer-dashboard" className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <label className="block text-sm font-medium text-slate-700">Search equipment</label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or type"
              className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
            />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold">Equipment summary</h2>
            <p className="mt-3 text-slate-600">Total equipment: {filteredEquipment.length}</p>
            <div className="mt-5 space-y-3">
              {['Available', 'Rented'].map((status) => (
                <div key={status} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <span className="text-sm font-medium">{status}</span>
                  <span className="text-sm text-slate-700">{equipment.filter((item) => item.status === status).length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredEquipment.map((item) => {
            const imageSrc = item.photoUrl && item.photoUrl.startsWith('/uploads')
              ? `${API_BASE}${item.photoUrl}`
              : item.photoUrl;
            return (
            <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              {imageSrc ? (
                <img src={imageSrc} alt={item.name} className="mb-4 h-48 w-full rounded-2xl object-cover border border-slate-100" />
              ) : (
                <div className="mb-4 h-48 w-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm">No photo</div>
              )}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="mt-2 text-sm text-slate-600">{item.type}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${item.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-5 text-slate-700">Rate: {item.rate}</p>
              {item.contact && <p className="mt-2 text-slate-700">Contact: {item.contact}</p>}
              {item.location && <p className="mt-2 text-slate-700">Location: {item.location}</p>}
              {item.description && <p className="mt-3 text-slate-600">{item.description}</p>}
              <button
                type="button"
                onClick={() => setSelectedItem(item)}
                className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                View details
              </button>
            </div>
            );
          })}
          {filteredEquipment.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-600">
              No equipment matches your search.
            </div>
          )}
        </div>

        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">{selectedItem.name}</h2>
                  <p className="mt-2 text-slate-600">{selectedItem.type}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
              {selectedItem.photoUrl && (
                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
                  <img
                    src={selectedItem.photoUrl.startsWith('/uploads') ? `${API_BASE}${selectedItem.photoUrl}` : selectedItem.photoUrl}
                    alt={selectedItem.name}
                    className="h-72 w-full object-cover"
                  />
                </div>
              )}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Rate</p>
                  <p className="mt-2 text-slate-700">{selectedItem.rate}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Status</p>
                  <p className="mt-2 text-slate-700">{selectedItem.status}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Location</p>
                  <p className="mt-2 text-slate-700">{selectedItem.location}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Contact</p>
                  <p className="mt-2 text-slate-700">{selectedItem.contact}</p>
                </div>
              </div>
              {selectedItem.description && (
                <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-slate-700">
                  {selectedItem.description}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
