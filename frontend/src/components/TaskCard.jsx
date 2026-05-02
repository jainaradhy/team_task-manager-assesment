import { CalendarClock, Pencil, Trash2, UserRound } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, isOverdue } from "../utils/helpers";
import { motion } from "framer-motion";

const TaskCard = ({
  task,
  canManage,
  draggable = false,
  onDragStart,
  onStatusChange,
  onEdit,
  onDelete,
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
    draggable={draggable}
    onDragStart={(event) => onDragStart?.(task, event)}
    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow dark:border-slate-800 dark:bg-slate-950 cursor-grab active:cursor-grabbing"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{task.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{task.description}</p>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <StatusBadge status={task.status} />
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${task.priority === "High" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" : task.priority === "Low" ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"}`}>
          {task.priority || "Medium"}
        </span>
      </div>
    </div>

    <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
      <div className="flex items-center gap-1.5">
        <UserRound size={14} className="text-indigo-500" />
        <span className="text-slate-600 dark:text-slate-300">{task.assignedTo?.name || "Unassigned"}</span>
      </div>
      <div className={`flex items-center gap-1.5 ${isOverdue(task) ? "text-rose-500" : ""}`}>
        <CalendarClock size={14} />
        <span>{formatDate(task.dueDate)}</span>
      </div>
    </div>

    <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-slate-50 dark:border-slate-900">
      <select
        className="input-field py-1.5 text-[11px] font-bold uppercase tracking-wider bg-slate-50 border-none dark:bg-slate-900"
        value={task.status}
        onChange={(event) => onStatusChange(task, event.target.value)}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      {canManage && (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(task)}
            className="rounded-lg p-2 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  </motion.div>
);

export default TaskCard;
