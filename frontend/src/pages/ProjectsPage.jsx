import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import AppShell from "../layouts/AppShell";
import LoadingSpinner from "../components/LoadingSpinner";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import ManageMembersModal from "../components/ManageMembersModal";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProjectMembers,
} from "../services/projectService";
import { getUsers } from "../services/userService";
import { getErrorMessage } from "../utils/helpers";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = user?.role === "Admin";
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [projectsData, usersData] = await Promise.all([
        getProjects(),
        canManage ? getUsers() : Promise.resolve([]),
      ]);
      setProjects(projectsData);
      setUsers(usersData);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = async (payload) => {
    try {
      await createProject(payload);
      toast.success("Project created");
      setIsProjectModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteProject = async (project) => {
    const confirmed = window.confirm(`Delete "${project.title}"? This also removes its tasks.`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(project._id);
      toast.success("Project deleted");
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSaveMembers = async (payload) => {
    try {
      await updateProjectMembers(selectedProject._id, payload);
      toast.success("Project members updated");
      setIsMembersModalOpen(false);
      setSelectedProject(null);
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AppShell>
      {isLoading ? (
        <LoadingSpinner label="Loading projects..." />
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <motion.div variants={item}>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">Projects</p>
              <h1 className="mt-2 text-4xl font-black text-slate-900 dark:text-white tracking-tight">Team Hub</h1>
              <p className="mt-3 max-w-2xl text-sm font-medium text-slate-500 dark:text-slate-400">
                Manage your workspace delivery channels and team membership from one central dashboard.
              </p>
            </motion.div>
            {canManage && (
              <motion.button 
                variants={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button" 
                onClick={() => setIsProjectModalOpen(true)} 
                className="primary-button gap-2 py-4 px-8 shadow-xl shadow-indigo-600/20"
              >
                <Plus size={20} strokeWidth={3} />
                New Project
              </motion.button>
            )}
          </div>

          <motion.div 
            variants={container}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {projects.map((project) => (
                <motion.div key={project._id} variants={item} layout>
                  <ProjectCard
                    project={project}
                    canManage={canManage}
                    onOpen={() => navigate(`/tasks?projectId=${project._id}`)}
                    onDelete={handleDeleteProject}
                    onManageMembers={(projectItem) => {
                      setSelectedProject(projectItem);
                      setIsMembersModalOpen(true);
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {!projects.length && (
            <motion.div variants={item} className="glass-panel p-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 mb-6">
                <Plus size={32} />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">No projects found</p>
              <p className="mt-2 text-sm text-slate-500">
                {canManage ? "Ready to start shipping? Create your first project." : "Ask an admin to assign you to a project."}
              </p>
              {canManage && (
                <button onClick={() => setIsProjectModalOpen(true)} className="mt-8 secondary-button mx-auto">
                  Get Started
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
        users={users}
      />

      <ManageMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => {
          setIsMembersModalOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleSaveMembers}
        project={selectedProject}
        users={users}
      />
    </AppShell>
  );
};

export default ProjectsPage;

