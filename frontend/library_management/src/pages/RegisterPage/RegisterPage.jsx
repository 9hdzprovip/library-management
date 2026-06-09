import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hustLogo from '../../assets/images/logo-hust-vector-01.jpg';
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
    <div className="register-card">
      <form className="register-page" onSubmit={handleSubmit}>
        <div className="register-page__brand">
          <div className="register-page__logo">
            <img src={hustLogo} alt="HUST Logo" className="register-page__logo-img" />
          </div>
          <h1>Tạo tài khoản</h1>
          <p className="register-page__subtitle">Đăng ký thành viên Hệ thống thư viện Đại học Bách Khoa Hà Nội</p>
        </div>

        <Input
          label="Tên đăng nhập"
          name="username"
          placeholder="Nhập tên đăng nhập mong muốn"
          value={formData.username}
          onChange={handleChange}
        />
        
        <div className="register-page__row">
          <Input
            label="Mật khẩu"
            name="password"
            type="password"
            placeholder="Mật khẩu bảo mật"
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Họ và tên"
          name="fullName"
          placeholder="Nhập họ và tên đầy đủ"
          value={formData.fullName}
          onChange={handleChange}
        />
        
        <Input
          label="Địa chỉ Email"
          name="email"
          type="email"
          placeholder="Nhập địa chỉ email cá nhân"
          value={formData.email}
          onChange={handleChange}
        />

        {error && <p className="register-page__error">{error}</p>}
        {successMessage && <p className="register-page__success">{successMessage}</p>}

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
        </Button>

        <p className="register-page__switch">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
