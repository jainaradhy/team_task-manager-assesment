import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signup(form);
      navigate("/dashboard");
    } catch {
      // error is already shown via toast in AuthContext
    }
  };

  return (
    <div className="page-shell flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl p-8 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-500">Create Account</p>
        <h1 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">Join Team Task Manager</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Create your workspace and start managing projects today.
        </p>

        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold">Full Name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Company / Workspace Name</label>
            <input
              className="input-field"
              placeholder="e.g. Acme Corp"
              value={form.companyName}
              onChange={(event) => setForm((prev) => ({ ...prev, companyName: event.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold">Password</label>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={isLoading} className="primary-button w-full">
              {isLoading ? "Creating workspace..." : "Create Account & Workspace"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-brand-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

