import axiosClient from './axiosClient';

export const getAll = () => {
  return axiosClient.get('/borrow-records');
};

export const getById = (id) => {
  return axiosClient.get(`/borrow-records/${id}`);
};

export const getByStatus = (status) => {
  return axiosClient.get(`/borrow-records/status/${status}`);
};

export const getByUser = (userId) => {
  return axiosClient.get(`/borrow-records/user/${userId}`);
};

export const getMyRecords = () => {
  return axiosClient.get('/borrow-records/my');
};

export const borrowBook = (data) => {
  return axiosClient.post('/borrow-records/borrow', data);
};

export const returnBook = (id) => {
  return axiosClient.put(`/borrow-records/${id}/return`);
};

export const updateOverdue = () => {
  return axiosClient.put('/borrow-records/update-overdue');
};

export const update = (id, data) => {
  return axiosClient.put(`/borrow-records/${id}`, data);
};

const remove = (id) => {
  return axiosClient.delete(`/borrow-records/${id}`);
};

export { remove as delete };

export const fetchRecords = getAll;
export const createRecord = borrowBook;
export const updateRecord = update;
export const returnRecord = returnBook;
export const deleteRecord = remove;

const borrowRecordApi = {
  getAll,
  getById,
  getByStatus,
  getByUser,
  getMyRecords,
  borrowBook,
  returnBook,
  updateOverdue,
  update,
  delete: remove,
  fetchRecords,
  createRecord,
  updateRecord,
  returnRecord,
  deleteRecord,
};

export default borrowRecordApi;
