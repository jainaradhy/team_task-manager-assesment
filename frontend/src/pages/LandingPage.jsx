import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Layout, Shield, Users, Layers } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* Navigation */}
      <nav className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white">
              <Layout size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              TaskManager
            </span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                  Log in
                </Link>
                <Link to="/signup" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">
                  Start for free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            A better way to manage your team's work
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
            TaskManager helps teams organize projects, assign work, and track progress all in one place. Built for speed and clarity.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/signup" className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700 transition">
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Product Mockup Image Area */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden aspect-[16/9] flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <Layout size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Dashboard Interface</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">Features</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to ship faster
            </p>
            <p className="mt-4 text-lg text-slate-600">
              Designed to eliminate clutter and help your team focus on the work that matters.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-12 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-lg font-bold text-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <Layers size={20} />
                  </div>
                  Kanban Boards
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base text-slate-600">
                  <p className="flex-auto">Visualize your workflow with intuitive drag-and-drop boards. Move tasks from Todo to Done seamlessly.</p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-lg font-bold text-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <Users size={20} />
                  </div>
                  Team Collaboration
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base text-slate-600">
                  <p className="flex-auto">Invite members to your workspace, assign tasks, and track who is doing what in real-time.</p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-lg font-bold text-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                    <Shield size={20} />
                  </div>
                  Role-Based Security
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base text-slate-600">
                  <p className="flex-auto">Protect your data with strict Admin and Member roles. Multi-tenant architecture ensures complete data isolation.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 text-center bg-white">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} TaskManager. Built for modern teams.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
