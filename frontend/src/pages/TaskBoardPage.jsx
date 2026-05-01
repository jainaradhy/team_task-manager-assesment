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
        <LoadingSpinner label="Loading task board..." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-500">Kanban Board</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Track execution in motion</h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Drag tasks across columns or use the dropdown on each card to keep status current.
            </p>
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
                  <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

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
