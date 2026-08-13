import { useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Link, useParams } from 'react-router-dom';
import { useEquipment } from '../context/EquipmentContext';

const equipmentTypes = [
  { label: 'Tractor', description: 'Powerful tractors for plowing, hauling, and general field work.' },
  { label: 'Seeder', description: 'Seeders for planting crops efficiently across large fields.' },
  { label: 'Harvester', description: 'Harvesters for fast and reliable crop harvesting.' },
];

export default function FarmerAddEquipment() {
  const { slotId } = useParams();
  const { addEquipment } = useEquipment();
  const [selectedType, setSelectedType] = useState(equipmentTypes[0].label);
  const [name, setName] = useState('');
  const [rate, setRate] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [success, setSuccess] = useState('');

  const title = slotId ? `Add Equipment to ${slotId.replace(/-/g, ' ')}` : 'Add Equipment';
  const pageDescription = slotId
    ? `Add new equipment into ${slotId.replace(/-/g, ' ')} and keep that slot updated.`
    : 'Add new equipment to your inventory for other farmers to rent.';

  const selectedTypeDetails = useMemo(
    () => equipmentTypes.find((item) => item.label === selectedType),
    [selectedType]
  );

  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!name.trim() || !rate.trim() || !contact.trim() || !location.trim()) {
      setError('Please provide name, hourly rate, contact number, and location.');
      return;
    }

    try {
      await addEquipment({
        name: name.trim(),
        type: selectedType,
        rate: rate.trim(),
        contact: contact.trim(),
        location: location.trim(),
        description: description.trim() || `A ${selectedType.toLowerCase()} available for rent.`,
        photoFile,
      });

      setSuccess(`Successfully added ${name.trim()} to your equipment list.`);
      setName('');
      setRate('');
      setContact('');
      setLocation('');
      setDescription('');
      setPhotoFile(null);
      setPhotoPreview('');
    } catch (err) {
      setError(err.message || 'Failed to add equipment. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <section className="rounded-3xl bg-white p-10 shadow-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-4 text-slate-600">{pageDescription}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-2xl font-semibold">Choose equipment type</h2>
              <div className="mt-5 grid gap-4">
                {equipmentTypes.map((type) => (
                  <button
                    key={type.label}
                    type="button"
                    onClick={() => setSelectedType(type.label)}
                    className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                      selectedType === type.label
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-400 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-lg font-semibold">{type.label}</span>
                      {selectedType === type.label && <span className="text-sm text-emerald-700">Selected</span>}
                    </div>
                    <p className="mt-2 text-slate-600">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-2xl font-semibold">Add new equipment</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700">Equipment name</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={`e.g. ${selectedType} Model X`}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Hourly rate</label>
                <input
                  value={rate}
                  onChange={(event) => setRate(event.target.value)}
                  placeholder="e.g. 1500"
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Contact number</label>
                <input
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="e.g. 9876543210"
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Location</label>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g. Nearby village market"
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Upload equipment photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setPhotoFile(file);
                    setPhotoPreview(file ? URL.createObjectURL(file) : '');
                  }}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                />
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Equipment preview"
                    className="mt-4 h-48 w-full rounded-3xl object-cover border border-slate-200"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Add a short description for other farmers."
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Add Equipment
              </button>
              {success && <p className="text-sm text-emerald-700">{success}</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-2xl font-semibold">Selected type</h2>
              <p className="mt-4 text-slate-700">{selectedTypeDetails?.description}</p>
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Current selection</p>
                <h3 className="mt-3 text-xl font-semibold">{selectedType}</h3>
                <p className="mt-2 text-slate-600">Use the form to submit the chosen equipment type and details.</p>
              </div>
            </div>
            <Link
              to="/farmer-dashboard"
              className="inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
