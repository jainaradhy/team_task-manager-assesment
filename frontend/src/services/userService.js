import api from "./api";

export const getUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const addMember = async (payload) => {
  const { data } = await api.post("/users", payload);
  return data;
};

export const removeMember = async (userId) => {
  const { data } = await api.delete(`/users/${userId}`);
  return data;
};

