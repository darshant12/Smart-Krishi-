import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';

export default function AdminReports() {
  return (
    <DashboardLayout>
      <section className="rounded-3xl bg-white p-10 shadow-md">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="mt-4 text-slate-600">View admin reports and analytics for the platform.</p>
        <Link to="/admin-dashboard" className="mt-6 inline-block rounded-full bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700">
          Back to Dashboard
        </Link>
      </section>
    </DashboardLayout>
  );
}
