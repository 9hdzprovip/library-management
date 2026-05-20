import axiosClient from './axiosClient';

export const getAll = () => {
  return axiosClient.get('/authors');
};

export const getById = (id) => {
  return axiosClient.get(`/authors/${id}`);
};

export const create = (data) => {
  return axiosClient.post('/authors', data);
};

export const update = (id, data) => {
  return axiosClient.put(`/authors/${id}`, data);
};

const remove = (id) => {
  return axiosClient.delete(`/authors/${id}`);
};

export { remove as delete };

export const fetchAuthors = getAll;
export const createAuthor = create;
export const updateAuthor = update;
export const deleteAuthor = remove;

const authorApi = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
  fetchAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};

export default authorApi;
