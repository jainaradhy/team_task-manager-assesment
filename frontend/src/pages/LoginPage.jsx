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
        <section className="glass-panel hidden overflow-hidden p-10 lg:block">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-500">Production Ready</p>
            <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">
              Coordinate teams, projects, and delivery in one clean workspace.
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
              Built for admins who need visibility and members who need clarity. Manage projects, track deadlines,
              and move work through a polished Kanban flow.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {["Secure JWT auth", "Admin/member roles", "Responsive Kanban"].map((item) => (
                <div key={item} className="rounded-3xl bg-white/90 p-5 shadow-sm dark:bg-slate-900/90">
                  <div className="mb-3 h-3 w-14 rounded-full bg-brand-500" />
                  <p className="font-semibold text-slate-900 dark:text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-panel p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">Welcome Back</p>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">Login to your workspace</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Use your team credentials to continue.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold">Email</label>
              <input
                type="email"
                className="input-field"
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

          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
            Need an account?{" "}
            <Link to="/signup" className="font-semibold text-brand-500">
              Create one here
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;

