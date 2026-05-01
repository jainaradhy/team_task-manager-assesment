import { useEffect, useState } from "react";
import Modal from "./Modal";
import { TASK_STATUSES } from "../utils/constants";

const initialState = {
  title: "",
  description: "",
  projectId: "",
  assignedTo: "",
  dueDate: "",
  status: "Todo",
  priority: "Medium",
};

const TaskModal = ({ isOpen, onClose, onSubmit, projects, users, task, isEditing = false }) => {
  const [form, setForm] = useState(initialState);
  const selectedProject = projects.find((project) => project._id === form.projectId);
  const availableMembers = selectedProject?.teamMembers || users;

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        projectId: task.projectId?._id || task.projectId,
        assignedTo: task.assignedTo?._id || task.assignedTo,
        dueDate: new Date(task.dueDate).toISOString().slice(0, 10),
        status: task.status,
        priority: task.priority || "Medium",
      });
      return;
    }

    setForm(initialState);
  }, [task, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "projectId" ? { assignedTo: "" } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <Modal isOpen={isOpen} title={isEditing ? "Edit Task" : "Create Task"} onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="input-field" required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Project</label>
            <select name="projectId" value={form.projectId} onChange={handleChange} className="input-field" required>
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Assign To</label>
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className="input-field" required>
              <option value="">Select a member</option>
              {availableMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Due Date</label>
            <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input-field">
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="secondary-button">
            Cancel
          </button>
          <button type="submit" className="primary-button">
            {isEditing ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;

