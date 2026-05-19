import { useEffect, useMemo, useState } from 'react';
import AuthorTable from '../components/AuthorTable';
import AuthorForm from '../components/AuthorForm';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import * as authorApi from '../../../api/authorApi';
import '../styles/author.css';

function AuthorPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    authorApi.fetchAuthors().then((data) => {
      setAuthors(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return authors;
    return authors.filter((a) => a.name.toLowerCase().includes(q));
  }, [authors, search]);

  function openAdd() {
    setEditing(null);
    setIsModalOpen(true);
  }

  function openEdit(author) {
    setEditing(author);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditing(null);
  }

  async function handleSave(authorData) {
    if (editing) {
      const updated = await authorApi.updateAuthor(editing.id, authorData);
      setAuthors((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await authorApi.createAuthor(authorData);
      setAuthors((prev) => [created, ...prev]);
    }
    closeModal();
  }

  async function handleDelete(author) {
    // optimistic update
    setAuthors((prev) => prev.filter((a) => a.id !== author.id));
    try {
      await authorApi.deleteAuthor(author.id);
    } catch (e) {
      // rollback on error
      setAuthors((prev) => [author, ...prev]);
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={openAdd} variant="primary">Thêm tác giả</Button>
        </div>
      </div>

      <AuthorTable
        authors={filtered}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal title={editing ? 'Sửa tác giả' : 'Thêm tác giả'} isOpen={isModalOpen} onClose={closeModal}>
        <AuthorForm initialData={editing} onCancel={closeModal} onSave={handleSave} />
      </Modal>
    </section>
  );
}

export default AuthorPage;
