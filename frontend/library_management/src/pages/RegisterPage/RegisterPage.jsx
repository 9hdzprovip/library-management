import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import './RegisterPage.css';
import * as authApi from '../../api/authApi';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerErrorMessages = {
  0: 'Không kết nối được backend. Vui lòng kiểm tra backend đang chạy và cấu hình CORS.',
  400: 'Thông tin đăng ký không hợp lệ hoặc tài khoản đã tồn tại.',
  409: 'Username hoặc email đã tồn tại.',
  500: 'Máy chủ đang gặp lỗi. Vui lòng thử lại sau.',
};

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateForm() {
    if (!formData.username.trim()) return 'Username không được để trống';
    if (!formData.password) return 'Password không được để trống';
    if (!formData.confirmPassword) return 'Confirm password không được để trống';
    if (formData.password !== formData.confirmPassword) return 'Password và confirm password phải giống nhau';
    if (!formData.fullName.trim()) return 'Họ tên không được để trống';
    if (!formData.email.trim()) return 'Email không được để trống';
    if (!emailPattern.test(formData.email.trim())) return 'Email không đúng định dạng';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      username: formData.username.trim(),
      password: formData.password,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      role: 'USER',
    };

    try {
      setIsLoading(true);
      await authApi.register(payload);
      setSuccessMessage('Đăng ký tài khoản thành công');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (err) {
      setError(registerErrorMessages[err?.status] || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="register-page" onSubmit={handleSubmit}>
      <div className="register-page__brand">
        <h1>Library Management System</h1>
        <p className="register-page__subtitle">Tạo tài khoản thư viện</p>
      </div>

      <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
      <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      <Input label="Full name" name="fullName" value={formData.fullName} onChange={handleChange} />
      <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />

      {error && <p className="register-page__error">{error}</p>}
      {successMessage && <p className="register-page__success">{successMessage}</p>}

      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
      </Button>

      <p className="register-page__switch">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </form>
  );
}

export default RegisterPage;
