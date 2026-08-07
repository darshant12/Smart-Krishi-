import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <section className="rounded-3xl bg-white p-10 shadow-md">
        <h1 className="text-3xl font-bold">About SmartKrishi Share</h1>
        <p className="mt-4 text-slate-600 leading-8">
          SmartKrishi Share is built to empower farmers in rural communities with affordable equipment rental,
          crop selling, labor hiring, weather updates, and access to government schemes.
        </p>
      </section>
    </Layout>
  );
}
