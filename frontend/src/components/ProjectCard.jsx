import { Trash2, Users } from "lucide-react";

const ProjectCard = ({ project, canManage, onOpen, onDelete, onManageMembers }) => (
  <div className="glass-panel flex h-full flex-col p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{project.title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
      </div>
      {canManage && (
        <button
          type="button"
          onClick={() => onDelete(project)}
          className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>

    <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
      <div className="rounded-lg bg-slate-100 px-4 py-3 dark:bg-slate-800">
        <p className="text-slate-500 dark:text-slate-400">Tasks</p>
        <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{project.totalTasks}</p>
      </div>
      <div className="rounded-lg bg-slate-100 px-4 py-3 dark:bg-slate-800">
        <p className="text-slate-500 dark:text-slate-400">Done</p>
        <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{project.completedTasks}</p>
      </div>
    </div>

    <div className="mt-6 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Users size={16} />
        <span>{project.teamMembers?.length || 0} members</span>
      </div>
      <div className="flex gap-2">
        {canManage && (
          <button type="button" onClick={() => onManageMembers(project)} className="secondary-button px-3 py-2">
            Members
          </button>
        )}
        <button type="button" onClick={() => onOpen(project)} className="primary-button px-3 py-2">
          Open
        </button>
      </div>
    </div>
  </div>
);

export default ProjectCard;

