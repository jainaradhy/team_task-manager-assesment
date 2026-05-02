import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { getInitials } from "../utils/helpers";
import { motion } from "framer-motion";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel sticky top-0 z-30 mx-4 mt-4 flex items-center justify-between gap-4 px-6 py-4 lg:mx-0 lg:mt-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 shadow-sm"
    >
      <div className="hidden sm:block">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Enterprise Workspace</p>
        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Executive Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={toggleTheme}
          className="rounded-xl border border-slate-200/60 bg-white/50 p-3 text-slate-600 transition hover:bg-white dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:bg-slate-800 shadow-sm"
        >
          {theme === "dark" ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
        </motion.button>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/50 px-4 py-2 dark:border-slate-800/60 dark:bg-slate-900/50 shadow-sm">
          <div className="relative">
            <Bell size={20} strokeWidth={2.5} className="text-indigo-500" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 rounded-full bg-rose-500" />
          </div>
          <div className="hidden text-right lg:block">
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{user?.name}</p>
            <p className="text-[10px] font-bold text-indigo-600/80 uppercase tracking-widest">{user?.role}</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xs font-black text-white shadow-lg shadow-indigo-600/30"
          >
            {getInitials(user?.name)}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;

