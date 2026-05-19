import axiosClient from './axiosClient';

export const bookApi = {
  getAll: (params) => axiosClient.get('/books', { params }),
  getById: (id) => axiosClient.get(`/books/${id}`),
  create: (payload) => axiosClient.post('/books', payload),
  update: (id, payload) => axiosClient.put(`/books/${id}`, payload),
  remove: (id) => axiosClient.delete(`/books/${id}`),
};
