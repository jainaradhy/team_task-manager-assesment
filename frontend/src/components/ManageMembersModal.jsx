import { useEffect, useState } from "react";
import Modal from "./Modal";

const ManageMembersModal = ({ isOpen, onClose, onSubmit, project, users }) => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    if (project) {
      setTeamMembers(project.teamMembers.map((member) => member._id));
    }
  }, [project]);

  const handleToggle = (userId) => {
    setTeamMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ teamMembers });
  };

  return (
    <Modal isOpen={isOpen} title={`Manage Members${project ? `: ${project.title}` : ""}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2">
          {users.map((member) => (
            <label
              key={member._id}
              className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700"
            >
              <span>
                <span className="block text-sm font-semibold">{member.name}</span>
                <span className="text-xs text-slate-500">{member.email}</span>
              </span>
              <input
                type="checkbox"
                checked={teamMembers.includes(member._id)}
                onChange={() => handleToggle(member._id)}
                className="rounded border-slate-300 text-brand-500 focus:ring-brand-500"
              />
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="secondary-button">
            Cancel
          </button>
          <button type="submit" className="primary-button">
            Save Members
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ManageMembersModal;

