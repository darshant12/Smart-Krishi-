import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';

export default function AdminBookings() {
  return (
    <DashboardLayout>
      <section className="rounded-3xl bg-white p-10 shadow-md">
        <h1 className="text-3xl font-bold">Manage Bookings</h1>
        <p className="mt-4 text-slate-600">Review booking requests and manage rental workflows.</p>
        <Link to="/admin-dashboard" className="mt-6 inline-block rounded-full bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700">
          Back to Dashboard
        </Link>
      </section>
    </DashboardLayout>
  );
}
