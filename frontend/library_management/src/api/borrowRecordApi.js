import axiosClient from './axiosClient';

export const borrowRecordApi = {
  getAll: (params) => axiosClient.get('/borrow-records', { params }),
  getById: (id) => axiosClient.get(`/borrow-records/${id}`),
  create: (payload) => axiosClient.post('/borrow-records', payload),
  update: (id, payload) => axiosClient.put(`/borrow-records/${id}`, payload),
  remove: (id) => axiosClient.delete(`/borrow-records/${id}`),
};
