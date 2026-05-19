import { useEffect, useMemo, useState } from 'react';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import * as userApi from '../../../api/userApi';
import '../styles/user.css';

function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setLoading(true);
    userApi.fetchUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => (u.username || '').toLowerCase().includes(q) || (u.fullName || '').toLowerCase().includes(q));
  }, [users, query]);

  function openAdd() {
    setEditing(null);
    setIsModalOpen(true);
  }

  function openEdit(user) {
    setEditing(user);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditing(null);
  }

  async function handleSave(payload) {
    if (editing) {
      const updated = await userApi.updateUser(editing.id, payload);
      setUsers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await userApi.createUser(payload);
      setUsers((prev) => [created, ...prev]);
    }
    closeModal();
  }

  async function handleDelete(user) {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    try {
      await userApi.deleteUser(user.id);
    } catch (e) {
      setUsers((prev) => [user, ...prev]);
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
          <Input placeholder="Tìm theo username hoặc họ tên..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button onClick={openAdd} variant="primary">Thêm người dùng</Button>
        </div>
      </div>

      <UserTable users={filtered} loading={loading} onEdit={openEdit} onDelete={handleDelete} />

      <Modal title={editing ? 'Sửa người dùng' : 'Thêm người dùng'} isOpen={isModalOpen} onClose={closeModal}>
        <UserForm initialData={editing} onSave={handleSave} onCancel={closeModal} />
      </Modal>
    </section>
  );
}

export default UserPage;
