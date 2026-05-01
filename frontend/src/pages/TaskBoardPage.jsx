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
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Productivity Hub</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Workflow Execution</h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Manage project delivery with precision. Switch between high-level Kanban or detailed List views.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
              <button
                onClick={() => setViewType("board")}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                  viewType === "board"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Board
              </button>
              <button
                onClick={() => setViewType("table")}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                  viewType === "table"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Table
              </button>
            </div>
            {canManage && (
              <button
                type="button"
                onClick={() => {
                  setSelectedTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="primary-button gap-2"
              >
                <Plus size={18} />
                New Task
              </button>
            )}
          </div>
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

        {viewType === "board" ? (
          <div className="grid gap-5 xl:grid-cols-3">
            {TASK_STATUSES.map((status) => (
              <div
                key={status}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const task = JSON.parse(event.dataTransfer.getData("task"));
                  handleDrop(status, task);
                }}
                className="glass-panel p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{status}</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    {groupedTasks[status]?.length || 0}
                  </span>
                </div>

                <div className="space-y-4">
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

                  {!groupedTasks[status]?.length && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Task Title</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Project</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Assignee</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Priority</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tasks.map((task) => (
                    <tr key={task._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">{task.title}</p>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-1">{task.description}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                        {task.projectId?.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {task.assignedTo?.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          task.status === "Done" ? "bg-green-100 text-green-700" : 
                          task.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          task.priority === "High" ? "bg-red-100 text-red-700" : 
                          task.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                           <button 
                             onClick={() => { setSelectedTask(task); setIsTaskModalOpen(true); }}
                             className="text-xs font-bold text-indigo-600 hover:underline"
                           >
                             Edit
                           </button>
                           {canManage && (
                             <button 
                               onClick={() => handleDeleteTask(task)}
                               className="text-xs font-bold text-red-600 hover:underline"
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
                      <td colSpan="6" className="py-10 text-center text-sm text-slate-500">
                        No tasks match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
      </div>

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
