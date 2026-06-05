import { useCallback, useEffect, useMemo, useState } from 'react';
import BookSearch from '../components/BookSearch';
import BookTable from '../components/BookTable';
import BookForm from '../components/BookForm';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import '../styles/book.css';
import * as bookApi from '../../../api/bookApi';
import * as authorApi from '../../../api/authorApi';
import * as categoryApi from '../../../api/categoryApi';

function getErrorMessage(error, fallback) {
  return error?.message || fallback;
}

function sortById(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return [...data].sort((a, b) => Number(a.id) - Number(b.id));
}

function BookPage() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const loadBooks = useCallback(async (filters = {}) => {
    const title = (filters.searchTitle ?? searchTitle).trim();
    const authorId = filters.selectedAuthorId ?? selectedAuthorId;
    const categoryId = filters.selectedCategoryId ?? selectedCategoryId;

    try {
      setLoading(true);
      setError('');

      let data;
      if (title) {
        data = await bookApi.searchByTitle(title);
      } else if (authorId) {
        data = await bookApi.getByAuthor(authorId);
      } else if (categoryId) {
        data = await bookApi.getByCategory(categoryId);
      } else {
        data = await bookApi.getAll();
      }

      setBooks(sortById(data));
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải danh sách sách.'));
    } finally {
      setLoading(false);
    }
  }, [searchTitle, selectedAuthorId, selectedCategoryId]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError('');
        const [bookData, authorData, categoryData] = await Promise.all([
          bookApi.getAll(),
          authorApi.getAll(),
          categoryApi.getAll(),
        ]);

        setBooks(sortById(bookData));
        setAuthors(sortById(authorData));
        setCategories(sortById(categoryData));
      } catch (err) {
        setError(getErrorMessage(err, 'Không thể tải dữ liệu quản lý sách.'));
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const enriched = useMemo(() => {
    return books.map((b) => ({
      ...b,
      authorName: b.authorName || authors.find((x) => Number(x.id) === Number(b.authorId))?.name || '',
      categoryName: b.categoryName || categories.find((x) => Number(x.id) === Number(b.categoryId))?.name || '',
    }));
  }, [books, authors, categories]);

  function handleSearchChange(next) {
    const nextSearchTitle = next.title || '';
    const nextAuthorId = next.authorId || '';
    const nextCategoryId = next.categoryId || '';

    setSearchTitle(nextSearchTitle);
    setSelectedAuthorId(nextAuthorId);
    setSelectedCategoryId(nextCategoryId);
    loadBooks({
      searchTitle: nextSearchTitle,
      selectedAuthorId: nextAuthorId,
      selectedCategoryId: nextCategoryId,
    });
  }

  function openAdd() {
    setError('');
    setSuccessMessage('');
    setEditingBook(null);
    setIsModalOpen(true);
  }

  function openEdit(book) {
    setError('');
    setSuccessMessage('');
    setEditingBook(book);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingBook(null);
  }

  async function handleSave(payload) {
    try {
      setError('');

      if (editingBook) {
        const response = await bookApi.update(editingBook.id, payload);
        setSuccessMessage(response?.message || 'Cập nhật sách thành công');

        if (response?.updated) {
          closeModal();
          await loadBooks();
        }
      } else {
        await bookApi.create(payload);
        setSuccessMessage('Thêm sách thành công');
        closeModal();
        await loadBooks();
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể lưu thông tin sách.'));
    }
  }

  async function handleDelete(book) {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa sách "${book.title}"?`);
    if (!confirmed) {
      return;
    }

    try {
      setError('');
      await bookApi.delete(book.id);
      await loadBooks();
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể xóa sách.'));
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

      <BookSearch
        filters={{ title: searchTitle, authorId: selectedAuthorId, categoryId: selectedCategoryId }}
        onChange={handleSearchChange}
        authors={authors}
        categories={categories}
      />

      {successMessage && !isModalOpen && <p className="book-page__success">{successMessage}</p>}
      {error && !isModalOpen && <p className="book-page__error">{error}</p>}

      <BookTable books={enriched} loading={loading} onEdit={openEdit} onDelete={handleDelete} />

      <Modal title={editingBook ? 'Sửa sách' : 'Thêm sách'} isOpen={isModalOpen} onClose={closeModal}>
        {successMessage && <p className="book-page__success book-page__success--modal">{successMessage}</p>}
        {error && <p className="book-page__error book-page__error--modal">{error}</p>}
        <BookForm initialData={editingBook} onSave={handleSave} onCancel={closeModal} authors={authors} categories={categories} />
      </Modal>
    </section>
  );
}

export default BookPage;
