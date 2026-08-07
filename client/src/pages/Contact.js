import Layout from '../components/Layout';

export default function Contact() {
  return (
    <Layout>
      <section className="rounded-3xl bg-white p-10 shadow-md">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="mt-4 text-slate-600">Need help setting up or want to partner with SmartKrishi Share? Reach out to us.</p>
        <div className="mt-8 space-y-4">
          <p>Email: support@smartkrishishare.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </section>
    </Layout>
  );
}
