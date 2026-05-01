import { FolderKanban, LayoutDashboard, LogOut, PanelLeftClose, UserSquare2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navigation = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Task Board", icon: UserSquare2 },
];

const Sidebar = ({ isOpen, onToggle }) => {
  const { logout, user } = useAuth();

  return (
    <aside className={`${isOpen ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-slate-200 bg-white/90 px-6 py-8 backdrop-blur-xl transition dark:border-slate-800 dark:bg-slate-950/95 lg:static lg:translate-x-0 lg:rounded-xl lg:border lg:shadow-soft`}>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">Workspace</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">TTM</h2>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <PanelLeftClose size={20} />
        </button>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl bg-slate-100 p-5 dark:bg-slate-900">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{user?.role}</p>
        <button type="button" onClick={logout} className="secondary-button mt-5 w-full gap-2">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

