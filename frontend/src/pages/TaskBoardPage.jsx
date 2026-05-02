import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import AppShell from "../layouts/AppShell";
import LoadingSpinner from "../components/LoadingSpinner";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { createTask, deleteTask, getTasks, updateTask } from "../services/taskService";
import { getProjects } from "../services/projectService";
import { getUsers } from "../services/userService";
import { getErrorMessage } from "../utils/helpers";
import { TASK_STATUSES } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

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

const TaskBoardPage = () => {
  const { user } = useAuth();
  const canManage = user?.role === "Admin";
  const location = useLocation();
  const projectIdFromQuery = new URLSearchParams(location.search).get("projectId") || "";
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    projectId: projectIdFromQuery,
    status: "",
    priority: "",
    sortBy: "dueDate",
    sortOrder: "asc",
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState(null);

  const [viewType, setViewType] = useState("board"); // board or table

  const loadBoardData = async () => {
    try {
      setIsLoading(true);
      const [tasksData, projectsData, usersData] = await Promise.all([
        getTasks(filters),
        getProjects(),
        canManage ? getUsers() : Promise.resolve([]),
      ]);
      setTasks(tasksData.data);
      setPagination(tasksData.pagination);
      setProjects(projectsData);
      setUsers(usersData);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBoardData();
  }, [filters.page, filters.limit, filters.projectId, filters.search, filters.status, filters.priority, filters.sortBy, filters.sortOrder]);

  const groupedTasks = TASK_STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {});

  const handleTaskSubmit = async (payload) => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask._id, payload);
        toast.success("Task updated");
      } else {
        await createTask(payload);
        toast.success("Task created");
      }
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      loadBoardData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      await updateTask(task._id, { status });
      setTasks((prev) => prev.map((item) => (item._id === task._id ? { ...item, status } : item)));
      toast.success("Task status updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteTask = async (task) => {
    const confirmed = window.confirm(`Delete "${task.title}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(task._id);
      toast.success("Task deleted");
      loadBoardData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDrop = async (status, task) => {
    if (task.status === status) {
      return;
    }
    await handleStatusChange(task, status);
  };

  if (isLoading) {
    return (
      <AppShell>
        <LoadingSpinner label="Syncing your workflow..." />
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
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <motion.div variants={item}>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">Productivity Hub</p>
            <h1 className="mt-2 text-4xl font-black text-slate-900 dark:text-white tracking-tight">Workflow Board</h1>
            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              Manage project delivery with precision. Switch between high-level Kanban or detailed List views.
            </p>
          </motion.div>
          <motion.div variants={item} className="flex items-center gap-4">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
              <button
                onClick={() => setViewType("board")}
                className={`rounded-lg px-4 py-2 text-xs font-black transition-all ${
                  viewType === "board"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Board
              </button>
              <button
                onClick={() => setViewType("table")}
                className={`rounded-lg px-4 py-2 text-xs font-black transition-all ${
                  viewType === "table"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Table
              </button>
            </div>
            {canManage && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setSelectedTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="primary-button gap-2 py-4 px-6 shadow-xl shadow-indigo-600/20"
              >
                <Plus size={20} strokeWidth={3} />
                New Task
              </motion.button>
            )}
          </motion.div>
        </div>

        <section className="glass-panel p-5">
          <div className="grid gap-4 lg:grid-cols-6">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input-field pl-11"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
              />
            </div>
            <select
              className="input-field"
              value={filters.projectId}
              onChange={(event) => setFilters((prev) => ({ ...prev, projectId: event.target.value, page: 1 }))}
            >
              <option value="">All projects</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
            <select
              className="input-field"
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value, page: 1 }))}
            >
              <option value="">All statuses</option>
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              className="input-field"
              value={filters.priority}
              onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value, page: 1 }))}
            >
              <option value="">All priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              className="input-field"
              value={filters.sortBy}
              onChange={(event) => setFilters((prev) => ({ ...prev, sortBy: event.target.value, page: 1 }))}
            >
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Priority</option>
            </select>
            <select
              className="input-field"
              value={filters.sortOrder}
              onChange={(event) => setFilters((prev) => ({ ...prev, sortOrder: event.target.value, page: 1 }))}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </section>

        <AnimatePresence mode="wait">
          {viewType === "board" ? (
            <motion.div 
              key="board"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-5 xl:grid-cols-3"
            >
              {TASK_STATUSES.map((status) => (
                <div
                  key={status}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const task = JSON.parse(event.dataTransfer.getData("task"));
                    handleDrop(status, task);
                  }}
                  className="glass-panel p-5 bg-slate-50/30 dark:bg-slate-900/30"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">{status}</h2>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-black text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                      {groupedTasks[status]?.length || 0}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {(groupedTasks[status] || []).map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          draggable
                          canManage={canManage}
                          onDragStart={(taskItem, dragEvent) =>
                            dragEvent.dataTransfer.setData("task", JSON.stringify(taskItem))
                          }
                          onStatusChange={handleStatusChange}
                          onEdit={(taskItem) => {
                            setSelectedTask(taskItem);
                            setIsTaskModalOpen(true);
                          }}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </AnimatePresence>

                    {!groupedTasks[status]?.length && (
                      <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-xs font-bold text-slate-400 dark:border-slate-800 uppercase tracking-tighter">
                        Drop tasks here
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="table"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-panel overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Task Title</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Project</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Assignee</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Status</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Priority</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {tasks.map((task) => (
                      <tr key={task._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 dark:text-white">{task.title}</p>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-1 font-medium">{task.description}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-black text-indigo-600 uppercase">
                          {task.projectId?.title}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                          {task.assignedTo?.name}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                            task.priority === "High" ? "bg-rose-100 text-rose-700" : 
                            task.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                             <button 
                               onClick={() => { setSelectedTask(task); setIsTaskModalOpen(true); }}
                               className="text-xs font-black uppercase text-indigo-600 hover:text-indigo-700 transition"
                             >
                               Edit
                             </button>
                             {canManage && (
                               <button 
                                 onClick={() => handleDeleteTask(task)}
                                 className="text-xs font-black uppercase text-rose-600 hover:text-rose-700 transition"
                               >
                                 Delete
                               </button>
                             )}
                           </div>
                        </td>
                      </tr>
                    ))}
                    {!tasks.length && (
                      <tr>
                        <td colSpan="6" className="py-20 text-center text-sm font-bold text-slate-400 uppercase">
                          No tasks match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={pagination.page === 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="secondary-button"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="secondary-button"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleTaskSubmit}
        projects={projects}
        users={users}
        task={selectedTask}
        isEditing={Boolean(selectedTask)}
      />
    </AppShell>
  );
};

export default TaskBoardPage;
