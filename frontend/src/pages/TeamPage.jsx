import { useEffect, useState } from "react";
import { Users, UserPlus, Trash2, Shield, ShieldCheck } from "lucide-react";
import AppShell from "../layouts/AppShell";
import LoadingSpinner from "../components/LoadingSpinner";
import { getUsers, addMember, removeMember } from "../services/userService";
import { getErrorMessage } from "../utils/helpers";
import toast from "react-hot-toast";
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

const TeamPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Member");

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      setIsAdding(true);
      await addMember({ email: newMemberEmail, role: newMemberRole });
      toast.success("Member added to workspace");
      setNewMemberEmail("");
      loadUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (userId, name) => {
    if (userId === currentUser.id) return;
    
    const confirmed = window.confirm(`Remove ${name} from the workspace?`);
    if (!confirmed) return;

    try {
      await removeMember(userId);
      toast.success("Member removed");
      loadUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AppShell>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.div variants={item}>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">Administration</p>
            <h1 className="mt-2 text-4xl font-black text-slate-900 dark:text-white tracking-tight">Workspace Team</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">Manage who has access to your workspace and their roles.</p>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          <div className="space-y-6">
            <motion.section variants={item} className="glass-panel overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-indigo-600" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Team Members</h2>
                </div>
              </div>

              {isLoading ? (
                <div className="p-12">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <AnimatePresence mode="popLayout">
                    {users.map((member) => (
                      <motion.div 
                        key={member._id} 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between p-6 transition hover:bg-slate-50/50 dark:hover:bg-slate-900/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 font-black text-lg">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{member.name}</h3>
                            <p className="text-xs font-medium text-slate-500">{member.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-1.5">
                            {member.role === "Admin" ? (
                              <ShieldCheck size={16} className="text-indigo-600" />
                            ) : (
                              <Shield size={16} className="text-slate-400" />
                            )}
                            <span className={`text-[10px] font-black uppercase tracking-widest ${member.role === "Admin" ? "text-indigo-600" : "text-slate-500"}`}>
                              {member.role}
                            </span>
                          </div>

                          {member._id !== currentUser.id && (
                            <button
                              onClick={() => handleRemoveMember(member._id, member.name)}
                              className="rounded-xl p-2.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.section>
          </div>

          <div className="space-y-6">
            <motion.section variants={item} className="glass-panel p-6">
              <div className="mb-8 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <UserPlus size={20} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Add Member</h2>
              </div>
              <form onSubmit={handleAddMember} className="space-y-6">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Enter user email..."
                    className="input-field py-3"
                  />
                  <p className="mt-3 text-[10px] leading-relaxed text-slate-400 font-medium">
                    The user must already have an account on the platform to be added to this workspace.
                  </p>
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Workspace Role</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="input-field py-3"
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isAdding || !newMemberEmail}
                  className="primary-button w-full py-4 shadow-xl shadow-indigo-600/20"
                >
                  {isAdding ? "Processing..." : "Invite to Workspace"}
                </motion.button>
              </form>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
};

export default TeamPage;
