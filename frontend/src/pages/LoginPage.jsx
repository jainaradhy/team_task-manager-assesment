import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      navigate("/dashboard");
    } catch {
      // error is already shown via toast in AuthContext
    }
  };

  return (
    <div className="page-shell flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="glass-panel hidden overflow-hidden p-10 lg:block bg-slate-50/30 border-slate-100">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Built for Professionals</p>
            <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">
              Manage your team with precision.
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
              The all-in-one workspace for high-performing teams to coordinate projects, track deadlines, and deliver with clarity.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {["Secure JWT Auth", "Workspace Roles", "Kanban Engine"].map((item) => (
                <div key={item} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:bg-slate-900/90 dark:border-slate-800">
                  <div className="mb-3 h-3 w-14 rounded-full bg-indigo-600" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-panel p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Welcome Back</p>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">Login to your workspace</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Use your team credentials to continue.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="admin@acme.dev"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="primary-button w-full gap-2">
              {isLoading ? "Signing in..." : "Login"}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 rounded-lg bg-slate-50 p-4 border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Demo Credentials</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Admin / Owner</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">aradhy@bharat.dev / <span className="font-mono">Admin@1234</span></p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-400 uppercase">Team Member</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">rahul@bharat.dev / <span className="font-mono">Member@1234</span></p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
            Need an account?{" "}
            <Link to="/signup" className="font-semibold text-indigo-600">
              Create one here
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;

