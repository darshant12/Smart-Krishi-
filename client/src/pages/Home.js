import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Layout>
      <section className="rounded-3xl bg-white p-10 shadow-md">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 p-8">
            <h1 className="text-4xl font-bold text-slate-900">SmartKrishi Share</h1>
            <p className="mt-4 text-lg text-slate-600">
              A rural platform for equipment rental, crop marketplace, labor hiring, and weather updates.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/register" className="rounded-full bg-emerald-600 px-6 py-3 text-white shadow hover:bg-emerald-700">
                Get Started
              </Link>
              <Link to="/about" className="rounded-full border border-emerald-600 px-6 py-3 text-emerald-600 hover:bg-emerald-50">
                Learn More
              </Link>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-emerald-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Rent Equipment</h2>
              <p className="mt-3 text-slate-600">Find tractors, harvesters, and tools from local farmers.</p>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Sell Crops</h2>
              <p className="mt-3 text-slate-600">List harvests and connect with buyers in your region.</p>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Hire Labor</h2>
              <p className="mt-3 text-slate-600">Access trusted laborers for planting, harvesting, and transport.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
