import { useEffect, useState } from "react";
import Modal from "./Modal";

const ProjectModal = ({ isOpen, onClose, onSubmit, users }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    teamMembers: [],
  });

  useEffect(() => {
    if (!isOpen) {
      setForm({ title: "", description: "", teamMembers: [] });
    }
  }, [isOpen]);

  const handleMemberToggle = (userId) => {
    setForm((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(userId)
        ? prev.teamMembers.filter((id) => id !== userId)
        : [...prev.teamMembers, userId],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <Modal isOpen={isOpen} title="Create Project" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold">Project Title</label>
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Description</label>
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            rows="4"
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="mb-3 block text-sm font-semibold">Team Members</label>
          <div className="grid gap-3 md:grid-cols-2">
            {users.map((member) => (
              <label
                key={member._id}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700"
              >
                <span>
                  <span className="block text-sm font-semibold">{member.name}</span>
                  <span className="text-xs text-slate-500">{member.role}</span>
                </span>
                <input
                  type="checkbox"
                  checked={form.teamMembers.includes(member._id)}
                  onChange={() => handleMemberToggle(member._id)}
                  className="rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="secondary-button">
            Cancel
          </button>
          <button type="submit" className="primary-button">
            Create Project
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;

