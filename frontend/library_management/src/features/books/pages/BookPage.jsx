import { useEffect, useMemo, useState } from 'react';
import BookSearch from '../components/BookSearch';
import BookTable from '../components/BookTable';
import BookForm from '../components/BookForm';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import '../styles/book.css';
import * as bookApi from '../../../api/bookApi';
import * as authorApi from '../../../api/authorApi';
import * as categoryApi from '../../../api/categoryApi';

function BookPage() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ title: '', authorId: '', categoryId: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([bookApi.fetchBooks(), authorApi.fetchAuthors(), categoryApi.fetchCategories()]).then(
      ([b, a, c]) => {
        setBooks(b);
        setAuthors(a);
        setCategories(c);
        setLoading(false);
      }
    );
  }, []);

  const enriched = useMemo(() => {
    return books.map((b) => ({
      ...b,
      authorName: authors.find((x) => x.id === b.authorId)?.name || '',
      categoryName: categories.find((x) => x.id === b.categoryId)?.name || '',
    }));
  }, [books, authors, categories]);

  const filtered = useMemo(() => {
    const q = (filters.title || '').trim().toLowerCase();
    return enriched.filter((b) => {
      if (q && !b.title.toLowerCase().includes(q)) return false;
      if (filters.authorId && Number(filters.authorId) !== Number(b.authorId)) return false;
      if (filters.categoryId && Number(filters.categoryId) !== Number(b.categoryId)) return false;
      return true;
    });
  }, [enriched, filters]);

  function handleSearchChange(next) {
    setFilters(next);
  }

  function openAdd() {
    setEditing(null);
    setIsModalOpen(true);
  }

  function openEdit(book) {
    setEditing(book);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditing(null);
  }

  async function handleSave(payload) {
    if (editing) {
      const updated = await bookApi.updateBook(editing.id, payload);
      setBooks((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await bookApi.createBook(payload);
      setBooks((prev) => [created, ...prev]);
    }
    closeModal();
  }

  async function handleDelete(book) {
    setBooks((prev) => prev.filter((b) => b.id !== book.id));
    try {
      await bookApi.deleteBook(book.id);
    } catch (e) {
      setBooks((prev) => [book, ...prev]);
    }
  }

  return (
    <section className="book-page">
      <div className="page-header page-header--space">
        <div>
          <h1>Quản lý sách</h1>
          <p>Danh sách và quản lý sách trong thư viện.</p>
        </div>

        <div className="page-actions">
          <Button onClick={openAdd} variant="primary">Thêm sách</Button>
        </div>
      </div>

      <BookSearch filters={filters} onChange={handleSearchChange} authors={authors} categories={categories} />

      <BookTable books={filtered} loading={loading} onEdit={openEdit} onDelete={handleDelete} />

      <Modal title={editing ? 'Sửa sách' : 'Thêm sách'} isOpen={isModalOpen} onClose={closeModal}>
        <BookForm initialData={editing} onSave={handleSave} onCancel={closeModal} authors={authors} categories={categories} />
      </Modal>
    </section>
  );
}

export default BookPage;
