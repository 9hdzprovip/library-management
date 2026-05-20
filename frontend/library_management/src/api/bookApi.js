import axiosClient from './axiosClient';

export const getAll = () => {
  return axiosClient.get('/books');
};

export const getById = (id) => {
  return axiosClient.get(`/books/${id}`);
};

export const searchByTitle = (title) => {
  return axiosClient.get('/books/search', {
    params: { title },
  });
};

export const getByAuthor = (authorId) => {
  return axiosClient.get(`/books/author/${authorId}`);
};

export const getByCategory = (categoryId) => {
  return axiosClient.get(`/books/category/${categoryId}`);
};

export const create = (data) => {
  return axiosClient.post('/books', data);
};

export const update = (id, data) => {
  return axiosClient.put(`/books/${id}`, data);
};

const remove = (id) => {
  return axiosClient.delete(`/books/${id}`);
};

export { remove as delete };

export const fetchBooks = getAll;
export const createBook = create;
export const updateBook = update;
export const deleteBook = remove;

const bookApi = {
  getAll,
  getById,
  searchByTitle,
  getByAuthor,
  getByCategory,
  create,
  update,
  delete: remove,
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
};

export default bookApi;
