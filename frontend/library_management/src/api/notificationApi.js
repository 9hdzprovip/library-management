import axiosClient from './axiosClient';

export const create = (data) => {
  return axiosClient.post('/notifications', data);
};

export const getMyNotifications = () => {
  return axiosClient.get('/notifications/my');
};

export const markAsRead = (id) => {
  return axiosClient.put(`/notifications/${id}/read`);
};

const notificationApi = {
  create,
  getMyNotifications,
  markAsRead,
};

export default notificationApi;
