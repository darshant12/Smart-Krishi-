import Layout from '../components/Layout';

export default function Register() {
  return (
    <Layout>
      <section className="rounded-3xl bg-white p-10 shadow-md max-w-xl mx-auto">
        <h1 className="text-3xl font-bold">Register</h1>
        <form className="mt-6 space-y-5">
          <label className="block">
            <span className="text-slate-700">Name</span>
            <input type="text" className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Your name" />
          </label>
          <label className="block">
            <span className="text-slate-700">Email</span>
            <input type="email" className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="you@example.com" />
          </label>
          <label className="block">
            <span className="text-slate-700">Password</span>
            <input type="password" className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Password" />
          </label>
          <button type="submit" className="w-full rounded-full bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700">
            Create Account
          </button>
        </form>
      </section>
    </Layout>
  );
}
