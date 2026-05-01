import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { getInitials } from "../utils/helpers";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="glass-panel sticky top-4 z-30 mx-4 mt-4 flex items-center justify-between gap-4 px-5 py-4 lg:mx-0 lg:mt-0">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-500">Team Task Manager</p>
        <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">Ship projects with clarity</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-900 sm:flex">
          <Bell size={18} className="text-brand-500" />
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-sm font-bold text-white">
            {getInitials(user?.name)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

