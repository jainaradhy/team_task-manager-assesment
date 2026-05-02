import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, ListTodo, FolderKanban } from "lucide-react";
import AppShell from "../layouts/AppShell";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { getDashboardSummary } from "../services/dashboardService";
import { getErrorMessage, formatDate } from "../utils/helpers";
import toast from "react-hot-toast";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, []);

  if (isLoading) {
    return (
      <AppShell>
        <LoadingSpinner label="Loading dashboard..." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <motion.div variants={item}>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Welcome back to your workspace overview.</p>
          </motion.div>
        </div>

        <div className="grid gap-6 xl:grid-cols-4 sm:grid-cols-2">
          <StatCard title="Total Tasks" value={summary?.stats.totalTasks || 0} subtitle="Across active projects" accent="bg-indigo-600" />
          <StatCard title="Completed" value={summary?.stats.completedTasks || 0} subtitle="Tasks finished" accent="bg-emerald-600" />
          <StatCard title="Pending" value={summary?.stats.pendingTasks || 0} subtitle="Still in progress" accent="bg-amber-500" />
          <StatCard title="Overdue" value={summary?.stats.overdueTasks || 0} subtitle="Needs attention" accent="bg-rose-500" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
          <div className="space-y-6">
            <motion.section variants={item} className="glass-panel overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Assigned to you</h2>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                    {summary?.stats.assignedToMe || 0}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 p-0 dark:divide-slate-800">
                {summary?.myTasks?.length ? (
                  summary.myTasks.map((task) => (
                    <motion.div 
                      key={task._id} 
                      whileHover={{ x: 4 }}
                      className="group flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">{task.title}</h3>
                          <StatusBadge status={task.status} />
                        </div>
                        <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
                        <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><ListTodo size={14} /> {task.projectId?.title}</span>
                          <span className="flex items-center gap-1.5"><Clock3 size={14} /> {formatDate(task.dueDate)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 text-center text-sm text-slate-500">
                    No active tasks assigned to you.
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          <div className="space-y-6">
            {summary?.tasksPerUser?.length > 0 && (
              <motion.section variants={item} className="glass-panel p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-5">Tasks per User</h2>
                <div className="space-y-3">
                  {summary.tasksPerUser.map((u, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{u.name}</span>
                      <div className="flex flex-1 items-center gap-3 px-4">
                        <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(u.count / summary.stats.totalTasks) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full bg-indigo-500" 
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{u.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            <motion.section variants={item} className="glass-panel p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-5">Quick Stats</h2>
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20"
                >
                  <div>
                    <p className="text-xs font-bold text-indigo-600 uppercase">Total Projects</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{summary?.stats.totalProjects || 0}</p>
                  </div>
                  <FolderKanban className="text-indigo-400" size={24} />
                </motion.div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="rounded-lg border border-slate-100 p-4 dark:border-slate-800"
                  >
                    <p className="text-xs font-bold text-slate-400 uppercase">Work Ratio</p>
                    <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                      {summary?.stats.totalTasks > 0 ? Math.round((summary.stats.completedTasks / summary.stats.totalTasks) * 100) : 0}%
                    </p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${summary?.stats.totalTasks > 0 ? (summary.stats.completedTasks / summary.stats.totalTasks) * 100 : 0}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full bg-emerald-500" 
                      />
                    </div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="rounded-lg border border-slate-100 p-4 dark:border-slate-800"
                  >
                    <p className="text-xs font-bold text-slate-400 uppercase">Overdue</p>
                    <p className="mt-2 text-xl font-bold text-rose-600">
                      {summary?.stats.overdueTasks || 0}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Critical attention</p>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            <motion.section variants={item} className="glass-panel overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Recent Activity</h2>
              </div>
              <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                {summary?.recentActivity?.length ? (
                  summary.recentActivity.map((item, idx) => (
                    <motion.div 
                      key={item._id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="px-6 py-4 hover:bg-slate-50/50 transition cursor-default"
                    >
                      <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                        {item.action.replaceAll("_", " ")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.performedBy?.name || "System"} • {formatDate(item.createdAt)}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 italic">
                    No activity recorded yet.
                  </div>
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
};

export default DashboardPage;

