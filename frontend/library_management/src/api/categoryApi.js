import axiosClient from './axiosClient';

export const getAll = () => {
  return axiosClient.get('/categories');
};

export const getById = (id) => {
  return axiosClient.get(`/categories/${id}`);
};

export const create = (data) => {
  return axiosClient.post('/categories', data);
};

export const update = (id, data) => {
  return axiosClient.put(`/categories/${id}`, data);
};

const remove = (id) => {
  return axiosClient.delete(`/categories/${id}`);
};

export { remove as delete };

export const fetchCategories = getAll;
export const createCategory = create;
export const updateCategory = update;
export const deleteCategory = remove;

const categoryApi = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryApi;
