import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import * as userApi from '../../../api/userApi';
import '../styles/user.css';

function getErrorMessage(error, fallback) {
  return error?.message || fallback;
}

function sortById(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return [...data].sort((a, b) => Number(a.id) - Number(b.id));
}

function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userApi.getAll();
      setUsers(sortById(data));
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải danh sách người dùng.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => (u.username || '').toLowerCase().includes(q) || (u.fullName || '').toLowerCase().includes(q));
  }, [users, searchTerm]);

  function openAdd() {
    setError('');
    setSuccessMessage('');
    setEditingUser(null);
    setIsModalOpen(true);
  }

  function openEdit(user) {
    setError('');
    setSuccessMessage('');
    setEditingUser(user);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingUser(null);
  }

  async function handleSave(payload) {
    try {
      setError('');

      if (editingUser) {
        const response = await userApi.update(editingUser.id, payload);
        setSuccessMessage(response?.message || 'Cập nhật người dùng thành công');

        if (response?.updated) {
          closeModal();
          await loadUsers();
        }
      } else {
        await userApi.create(payload);
        setSuccessMessage('Thêm người dùng thành công');
        closeModal();
        await loadUsers();
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể lưu thông tin người dùng.'));
    }
  }

  async function handleDelete(user) {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa người dùng "${user.username}"?`);
    if (!confirmed) {
      return;
    }

    try {
      setError('');
      await userApi.delete(user.id);
      await loadUsers();
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể xóa người dùng.'));
    }
  }

  return (
    <section className="user-page">
      <div className="page-header page-header--space">
        <div>
          <h1>Quản lý người dùng</h1>
          <p>Danh sách và quản lý tài khoản người dùng.</p>
        </div>

        <div className="page-actions">
          <Button onClick={openAdd} variant="primary">Thêm người dùng</Button>
        </div>
      </div>

      <div className="search-card">
        <Input
          icon={Search}
          placeholder="Tìm theo username hoặc họ tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {successMessage && !isModalOpen && <p className="user-page__success">{successMessage}</p>}
      {error && !isModalOpen && <p className="user-page__error">{error}</p>}

      <UserTable users={filtered} loading={loading} onEdit={openEdit} onDelete={handleDelete} />

      <Modal title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng'} isOpen={isModalOpen} onClose={closeModal}>
        {successMessage && <p className="user-page__success user-page__success--modal">{successMessage}</p>}
        {error && <p className="user-page__error user-page__error--modal">{error}</p>}
        <UserForm initialData={editingUser} onSave={handleSave} onCancel={closeModal} />
      </Modal>
    </section>
  );
}

export default UserPage;
