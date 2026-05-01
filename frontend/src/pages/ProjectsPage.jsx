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
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">Projects</p>
              <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Team delivery hub</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Track progress, manage membership, and jump into project-specific execution from a single view.
              </p>
            </div>
            {canManage && (
              <button type="button" onClick={() => setIsProjectModalOpen(true)} className="primary-button gap-2">
                <Plus size={18} />
                New Project
              </button>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                canManage={canManage}
                onOpen={() => navigate(`/tasks?projectId=${project._id}`)}
                onDelete={handleDeleteProject}
                onManageMembers={(projectItem) => {
                  setSelectedProject(projectItem);
                  setIsMembersModalOpen(true);
                }}
              />
            ))}
          </div>

          {!projects.length && (
            <div className="glass-panel p-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No projects yet. {canManage ? "Create your first project to get started." : "Ask an admin to add you to a project."}
            </div>
          )}
        </div>
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

