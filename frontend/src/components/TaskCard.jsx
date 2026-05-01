import { CalendarClock, Pencil, Trash2, UserRound } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, isOverdue } from "../utils/helpers";

const TaskCard = ({
  task,
  canManage,
  draggable = false,
  onDragStart,
  onStatusChange,
  onEdit,
  onDelete,
}) => (
  <div
    draggable={draggable}
    onDragStart={(event) => onDragStart?.(task, event)}
    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{task.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{task.description}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <StatusBadge status={task.status} />
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${task.priority === "High" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" : task.priority === "Low" ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
          {task.priority || "Medium"}
        </span>
      </div>
    </div>

    <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
      <div className="flex items-center gap-2">
        <UserRound size={14} />
        <span>{task.assignedTo?.name || "Unassigned"}</span>
      </div>
      <div className={`flex items-center gap-2 ${isOverdue(task) ? "text-rose-500" : ""}`}>
        <CalendarClock size={14} />
        <span>{formatDate(task.dueDate)}</span>
      </div>
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{task.projectId?.title}</div>
    </div>

    <div className="mt-4 flex items-center justify-between gap-2">
      <select
        className="input-field max-w-[160px] py-2 text-xs"
        value={task.status}
        onChange={(event) => onStatusChange(task, event.target.value)}
      >
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      {canManage && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(task)}
            className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  </div>
);

export default TaskCard;
