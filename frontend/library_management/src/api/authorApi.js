import axiosClient from './axiosClient';

export const authorApi = {
  getAll: (params) => axiosClient.get('/authors', { params }),
  getById: (id) => axiosClient.get(`/authors/${id}`),
  create: (payload) => axiosClient.post('/authors', payload),
  update: (id, payload) => axiosClient.put(`/authors/${id}`, payload),
  remove: (id) => axiosClient.delete(`/authors/${id}`),
};
