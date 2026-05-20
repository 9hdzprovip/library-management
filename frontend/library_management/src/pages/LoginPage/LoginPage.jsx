import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import './LoginPage.css';
import * as authApi from '../../api/authApi';

const loginErrorMessages = {
  0: 'Không kết nối được backend. Vui lòng kiểm tra backend đang chạy và cấu hình CORS.',
  400: 'Thông tin đăng nhập không hợp lệ.',
  401: 'Tên đăng nhập hoặc mật khẩu không đúng.',
  403: 'Tài khoản không có quyền truy cập.',
  500: 'Máy chủ đang gặp lỗi. Vui lòng thử lại sau.',
};

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim()) return setError('Username không được để trống');
    if (!password) return setError('Password không được để trống');

    const payload = { username: username.trim(), password };

    try {
      setIsLoading(true);
      const res = await authApi.login(payload);
      const loginData = res?.data || res;

      if (!loginData?.token) {
        setError('Đăng nhập thất bại. Backend không trả về token.');
        return;
      }

      localStorage.setItem('token', loginData.token);
      localStorage.setItem('username', loginData.username || payload.username);
      localStorage.setItem('role', loginData.role || '');

      navigate('/', { replace: true });
    } catch (err) {
      setError(loginErrorMessages[err?.status] || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="login-page" onSubmit={handleSubmit}>
      <div className="login-page__brand">
        <h1>Library Management System</h1>
        <p className="login-page__subtitle">Hệ thống quản lý thư viện</p>
      </div>

      <Input label="Username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      {error && <p className="login-page__error">{error}</p>}

      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>

      <p className="login-page__switch">
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </form>
  );
}

export default LoginPage;
