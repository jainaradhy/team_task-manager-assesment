import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, ListTodo } from "lucide-react";
import AppShell from "../layouts/AppShell";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { getDashboardSummary } from "../services/dashboardService";
import { getErrorMessage, formatDate } from "../utils/helpers";
import toast from "react-hot-toast";

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
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Tasks" value={summary?.stats.totalTasks || 0} subtitle="Across active projects" accent="bg-brand-500" />
            <StatCard title="Completed" value={summary?.stats.completedTasks || 0} subtitle="Tasks finished" accent="bg-emerald-500" />
            <StatCard title="Pending" value={summary?.stats.pendingTasks || 0} subtitle="Still in progress" accent="bg-amber-500" />
            <StatCard title="Overdue" value={summary?.stats.overdueTasks || 0} subtitle="Needs attention" accent="bg-rose-500" />
          </section>

          <section className="glass-panel p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-500">Your Work</p>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">Assigned to you</h2>
              </div>
              <div className="rounded-2xl bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
                {summary?.stats.assignedToMe || 0} tasks
              </div>
            </div>

            <div className="space-y-4">
              {summary?.myTasks?.length ? (
                summary.myTasks.map((task) => (
                  <div key={task._id} className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{task.title}</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{task.description}</p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {task.projectId?.title}
                        </p>
                      </div>
                      <StatusBadge status={task.status} />
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Clock3 size={16} />
                      Due {formatDate(task.dueDate)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  No tasks are assigned yet.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="glass-panel p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Delivery snapshot</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {summary?.stats.totalProjects || 0} projects tracked
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-800">
                <ListTodo className="text-brand-500" size={22} />
                <p className="mt-3 text-sm text-slate-500">Open work</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{summary?.stats.pendingTasks || 0}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-800">
                <CheckCircle2 className="text-emerald-500" size={22} />
                <p className="mt-3 text-sm text-slate-500">Completed</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{summary?.stats.completedTasks || 0}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-800">
                <AlertTriangle className="text-rose-500" size={22} />
                <p className="mt-3 text-sm text-slate-500">Overdue</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{summary?.stats.overdueTasks || 0}</p>
              </div>
            </div>
          </section>

          <section className="glass-panel p-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Activity log</h2>
            <div className="mt-5 space-y-4">
              {summary?.recentActivity?.length ? (
                summary.recentActivity.map((item) => (
                  <div key={item._id} className="rounded-3xl border border-slate-200 px-4 py-4 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.action.replaceAll("_", " ")}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {item.performedBy?.name || "System"} on {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
};

export default DashboardPage;

