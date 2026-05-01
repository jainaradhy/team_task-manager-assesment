import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="page-shell flex min-h-screen items-center justify-center p-4">
    <div className="glass-panel max-w-lg p-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-500">404</p>
      <h1 className="mt-4 text-4xl font-extrabold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        The page you requested does not exist or may have moved.
      </p>
      <Link to="/dashboard" className="primary-button mt-8">
        Back to dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;

