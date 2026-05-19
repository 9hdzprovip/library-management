import { useEffect, useState } from 'react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

function isEmail(value) {
  if (!value) return true;
  // simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function UserForm({ initialData = null, onSave, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username || '');
      setPassword(''); // empty means no change
      setFullName(initialData.fullName || '');
      setEmail(initialData.email || '');
      setRole(initialData.role || 'USER');
    } else {
      setUsername('');
      setPassword('');
      setFullName('');
      setEmail('');
      setRole('USER');
    }
    setError('');
  }, [initialData]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) return setError('Username không được để trống');
    if (!fullName.trim()) return setError('Họ tên không được để trống');
    if (email && !isEmail(email)) return setError('Email không hợp lệ');
    if (!role) return setError('Role là bắt buộc');

    const payload = { username: username.trim(), fullName: fullName.trim(), email: email.trim(), role };
    if (password) payload.password = password;
    onSave(payload);
  }

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <Input label="Username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={initialData ? 'Để trống nếu không đổi' : ''} />
      <Input label="Họ và tên" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <Input label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Role</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="ADMIN">ADMIN</option>
        <option value="USER">USER</option>
      </select>

      {error && <p className="input-field__error">{error}</p>}

      <div className="user-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="primary">Lưu</Button>
      </div>
    </form>
  );
}

export default UserForm;
