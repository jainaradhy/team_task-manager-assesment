const toPlain = (doc) => {
  if (!doc) return null;
  if (typeof doc.toObject === "function") {
    return doc.toObject({ virtuals: true });
  }
  return doc;
};

export const idOf = (value) => {
  if (!value) return value;
  if (value._id) return value._id.toString();
  return value.toString();
};

export const formatUser = (user) => {
  const plain = toPlain(user);
  if (!plain) return null;

  return {
    id: idOf(plain),
    _id: idOf(plain),
    name: plain.name,
    email: plain.email,
    createdAt: plain.createdAt,
  };
};

export const formatTask = (task) => {
  const plain = toPlain(task);
  const assignee = toPlain(plain.assignedTo);
  const project = toPlain(plain.projectId);

  return {
    ...plain,
    id: idOf(plain),
    _id: idOf(plain),
    workspaceId: idOf(plain.workspaceId),
    assignedTo: assignee
      ? formatUser(assignee)
      : idOf(plain.assignedTo),
    projectId: project
      ? { title: project.title, _id: idOf(project), id: idOf(project) }
      : idOf(plain.projectId),
  };
};

export const formatActivity = (activity) => {
  const plain = toPlain(activity);
  const user = toPlain(plain.performedBy);

  return {
    ...plain,
    id: idOf(plain),
    _id: idOf(plain),
    workspaceId: idOf(plain.workspaceId),
    projectId: plain.projectId ? idOf(plain.projectId) : null,
    performedBy: user ? { ...formatUser(user), role: "Member" } : idOf(plain.performedBy),
  };
};
