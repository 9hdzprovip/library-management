import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const isAuthRequest = config.url?.startsWith('/auth/');

  if (isAuthRequest) {
    return config;
  }

  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: 'Không kết nối được backend. Vui lòng kiểm tra server hoặc CORS.',
      });
    }

    const status = error.response?.status || 500;
    const backendMessage = error.response?.data?.message;

    const defaultMessages = {
      400: 'Dữ liệu gửi lên không hợp lệ.',
      401: 'Bạn cần đăng nhập để thực hiện thao tác này.',
      403: 'Bạn không có quyền thực hiện thao tác này.',
      404: 'Không tìm thấy dữ liệu.',
      500: 'Máy chủ đang gặp lỗi. Vui lòng thử lại sau.',
    };

    return Promise.reject({
      status,
      message: backendMessage || defaultMessages[status] || 'Có lỗi xảy ra. Vui lòng thử lại.',
    });
  },
);

export default axiosClient;
