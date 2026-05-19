import { useState } from 'react';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import './LoginPage.css';
import * as authApi from '../../api/authApi';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) return setError('Username không được để trống');
    if (!password) return setError('Password không được để trống');

    const payload = { username: username.trim(), password };
    console.log('Login submit:', payload);

    // prepared for real API call
    try {
      const res = await authApi.login(payload);
      console.log('authApi.login ->', res);
    } catch (err) {
      console.error(err);
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

      <Button type="submit" variant="primary">Đăng nhập</Button>
    </form>
  );
}

export default LoginPage;
