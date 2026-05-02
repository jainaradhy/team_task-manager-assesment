import { Trash2, Users } from "lucide-react";
import { motion } from "framer-motion";

const ProjectCard = ({ project, canManage, onOpen, onDelete, onManageMembers }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5 }}
    className="glass-panel flex h-full flex-col p-6 transition-shadow hover:shadow-xl cursor-default"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{project.title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{project.description}</p>
      </div>
      {canManage && (
        <button
          type="button"
          onClick={() => onDelete(project)}
          className="rounded-xl p-2.5 text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>

    <div className="mt-8 grid grid-cols-2 gap-4">
      <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tasks</p>
        <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{project.totalTasks}</p>
      </div>
      <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Progress</p>
        <p className="mt-2 text-2xl font-black text-emerald-600">
          {project.totalTasks > 0 ? Math.round((project.completedTasks / project.totalTasks) * 100) : 0}%
        </p>
      </div>
    </div>

    <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
        <Users size={16} className="text-indigo-500" />
        <span>{project.teamMembers?.length || 0} Members</span>
      </div>
      <div className="flex gap-3">
        {canManage && (
          <button type="button" onClick={() => onManageMembers(project)} className="secondary-button px-4 py-2 text-xs">
            Manage
          </button>
        )}
        <button type="button" onClick={() => onOpen(project)} className="primary-button px-5 py-2 text-xs shadow-lg shadow-indigo-600/20">
          Launch
        </button>
      </div>
    </div>
  </motion.div>
);

export default ProjectCard;

