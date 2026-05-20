import axiosClient from './axiosClient';

export const getAll = () => {
  return axiosClient.get('/users');
};

export const getById = (id) => {
  return axiosClient.get(`/users/${id}`);
};

export const create = (data) => {
  return axiosClient.post('/users', data);
};

export const update = (id, data) => {
  return axiosClient.put(`/users/${id}`, data);
};

const remove = (id) => {
  return axiosClient.delete(`/users/${id}`);
};

export { remove as delete };

export const fetchUsers = getAll;
export const createUser = create;
export const updateUser = update;
export const deleteUser = remove;

const userApi = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
};

export default userApi;
