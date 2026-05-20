import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthorTable from '../components/AuthorTable';
import AuthorForm from '../components/AuthorForm';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import * as authorApi from '../../../api/authorApi';
import '../styles/author.css';

function getErrorMessage(error, fallback) {
  return error?.message || fallback;
}

function AuthorPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);

  const loadAuthors = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await authorApi.getAll();
      setAuthors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải danh sách tác giả.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuthors();
  }, [loadAuthors]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return authors;
    return authors.filter((author) => author.name?.toLowerCase().includes(q));
  }, [authors, searchTerm]);

  function openAdd() {
    setError('');
    setEditingAuthor(null);
    setIsModalOpen(true);
  }

  function openEdit(author) {
    setError('');
    setEditingAuthor(author);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingAuthor(null);
  }

  async function handleSave(authorData) {
    try {
      setError('');

      if (editingAuthor) {
        await authorApi.update(editingAuthor.id, authorData);
      } else {
        await authorApi.create(authorData);
      }

      closeModal();
      await loadAuthors();
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể lưu thông tin tác giả.'));
    }
  }

  async function handleDelete(author) {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa tác giả "${author.name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      setError('');
      await authorApi.delete(author.id);
      await loadAuthors();
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể xóa tác giả.'));
    }
  }

  return (
    <section className="author-page">
      <div className="page-header page-header--space">
        <div>
          <h1>Quản lý tác giả</h1>
          <p>Danh sách và quản lý thông tin tác giả.</p>
        </div>

        <div className="page-actions">
          <Input
            placeholder="Tìm theo tên tác giả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={openAdd} variant="primary">Thêm tác giả</Button>
        </div>
      </div>

      {error && !isModalOpen && <p className="author-page__error">{error}</p>}

      <AuthorTable
        authors={filtered}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal title={editingAuthor ? 'Sửa tác giả' : 'Thêm tác giả'} isOpen={isModalOpen} onClose={closeModal}>
        {error && <p className="author-page__error author-page__error--modal">{error}</p>}
        <AuthorForm initialData={editingAuthor} onCancel={closeModal} onSave={handleSave} />
      </Modal>
    </section>
  );
}

export default AuthorPage;
