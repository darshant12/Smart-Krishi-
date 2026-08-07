import Layout from '../components/Layout';

export default function AdminDashboard() {
  return (
    <Layout>
      <section className="rounded-3xl bg-white p-10 shadow-md">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {['Users', 'Equipment', 'Bookings', 'Reports'].map((item) => (
            <div key={item} className="rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold">{item}</h2>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
