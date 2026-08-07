import Layout from '../components/Layout';

export default function Services() {
  return (
    <Layout>
      <section className="rounded-3xl bg-white p-10 shadow-md">
        <h1 className="text-3xl font-bold">Services</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold">Equipment Sharing</h2>
            <p className="mt-3 text-slate-600">Rent or list agricultural equipment for your village.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold">Crop Marketplace</h2>
            <p className="mt-3 text-slate-600">Buy and sell crops locally with transparent pricing.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold">Labor Hiring</h2>
            <p className="mt-3 text-slate-600">Hire laborers for planting, harvesting, and transport.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold">Weather & Schemes</h2>
            <p className="mt-3 text-slate-600">View weather updates and government scheme eligibility.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
