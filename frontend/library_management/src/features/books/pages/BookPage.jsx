import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutGrid, List, PenTool, Building, Calendar, Layers, BookOpen } from 'lucide-react';
import BookSearch from '../components/BookSearch';
import BookTable from '../components/BookTable';
import BookGrid from '../components/BookGrid';
import BookForm from '../components/BookForm';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import '../styles/book.css';
import bookImage from '../../../assets/images/books.png';
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
  const role = (localStorage.getItem('role') || 'USER').toUpperCase();
  const isAdmin = role === 'ADMIN';

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
  const [detailedBook, setDetailedBook] = useState(null);
  const [borrowingBook, setBorrowingBook] = useState(null);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('bookViewMode') || 'table');

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
          <h1>{isAdmin ? 'Quản lý sách' : 'Danh sách sách'}</h1>
          <p>{isAdmin ? 'Danh sách và quản lý sách trong thư viện.' : 'Danh sách sách trong thư viện.'}</p>
        </div>

        <div className="page-actions">
          <div className="view-toggle">
            <button 
              className={`view-toggle__btn ${viewMode === 'table' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => { setViewMode('table'); localStorage.setItem('bookViewMode', 'table'); }}
              title="Dạng bảng"
            >
              <List size={16} />
            </button>
            <button 
              className={`view-toggle__btn ${viewMode === 'grid' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => { setViewMode('grid'); localStorage.setItem('bookViewMode', 'grid'); }}
              title="Dạng lưới"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
          {isAdmin && (
            <Button onClick={openAdd} variant="primary">Thêm sách</Button>
          )}
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

      {viewMode === 'table' ? (
        <BookTable 
          books={enriched} 
          loading={loading} 
          onEdit={openEdit} 
          onDelete={handleDelete} 
          onViewDetails={setDetailedBook}
          onBorrow={setBorrowingBook}
          isAdmin={isAdmin} 
        />
      ) : (
        <BookGrid 
          books={enriched} 
          loading={loading} 
          onEdit={openEdit} 
          onDelete={handleDelete} 
          onViewDetails={setDetailedBook}
          onBorrow={setBorrowingBook}
          isAdmin={isAdmin} 
        />
      )}

      <Modal title={editingBook ? 'Sửa sách' : 'Thêm sách'} isOpen={isModalOpen} onClose={closeModal}>
        {successMessage && <p className="book-page__success book-page__success--modal">{successMessage}</p>}
        {error && <p className="book-page__error book-page__error--modal">{error}</p>}
        <BookForm initialData={editingBook} onSave={handleSave} onCancel={closeModal} authors={authors} categories={categories} />
      </Modal>

      {/* Book Detail Modal for both table and grid views */}
      {detailedBook && (
        <Modal 
          title="Thông tin chi tiết sách" 
          isOpen={!!detailedBook} 
          onClose={() => setDetailedBook(null)}
        >
          <div className="book-detail-modal">
            <div className="book-detail-modal__header">
              <img src={bookImage} alt="Book cover" className="book-detail-modal__img" />
              <div>
                <h3>{detailedBook.title}</h3>
                <span className="badge badge-primary">{detailedBook.categoryName || 'Tài liệu'}</span>
              </div>
            </div>
            <div className="book-detail-modal__body">
              <p>
                <PenTool size={14} className="book-card-alt__detail-icon" />
                <strong>Tác giả:</strong>
                <span>{detailedBook.authorName || 'Chưa rõ tác giả'}</span>
              </p>
              <p>
                <Building size={14} className="book-card-alt__detail-icon" />
                <strong>Nhà xuất bản:</strong>
                <span>{detailedBook.publisher || 'N/A'}</span>
              </p>
              <p>
                <Calendar size={14} className="book-card-alt__detail-icon" />
                <strong>Năm xuất bản:</strong>
                <span>{detailedBook.publishYear || 'N/A'}</span>
              </p>
              <p>
                <Layers size={14} className="book-card-alt__detail-icon" />
                <strong>Số lượng sách còn:</strong>
                <span>{detailedBook.availableQuantity} / {detailedBook.quantity} cuốn</span>
              </p>
              {detailedBook.description && (
                <div className="book-detail-modal__desc">
                  <strong>Mô tả nội dung:</strong>
                  <p>{detailedBook.description}</p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Custom Borrowing Notification Modal */}
      {borrowingBook && (
        <Modal 
          title="Thông báo mượn sách" 
          isOpen={!!borrowingBook} 
          onClose={() => setBorrowingBook(null)}
        >
          <div className="borrow-info-modal">
            <div className="borrow-info-modal__icon">
              <BookOpen size={36} />
            </div>
            <h3 className="borrow-info-modal__title">Yêu cầu mượn sách:</h3>
            <p className="borrow-info-modal__book">"{borrowingBook.title}"</p>
            <div className="borrow-info-modal__divider" />
            <p className="borrow-info-modal__msg">
              Vui lòng liên hệ trực tiếp với <strong>Thủ thư tại quầy</strong> và cung cấp tên tài khoản của bạn để hoàn tất thủ tục mượn cuốn sách này.
            </p>
            <div className="borrow-info-modal__actions">
              <Button variant="primary" onClick={() => setBorrowingBook(null)}>
                Xác nhận
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}

export default BookPage;
