import { useCallback, useEffect, useMemo, useState } from 'react';
import BorrowTable from '../components/BorrowTable';
import BorrowForm from '../components/BorrowForm';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import * as borrowApi from '../../../api/borrowRecordApi';
import * as userApi from '../../../api/userApi';
import * as bookApi from '../../../api/bookApi';
import { formatDate } from '../../../utils/formatDate';
import '../styles/borrowRecord.css';

function getErrorMessage(error, fallback) {
  return error?.message || fallback;
}

function sortById(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return [...data].sort((a, b) => Number(a.id) - Number(b.id));
}

function toDateInputValue(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 10);
}

function formatDisplayDate(value) {
  if (!value) {
    return '';
  }

  try {
    return formatDate(value);
  } catch {
    return toDateInputValue(value);
  }
}

function BorrowRecordPage() {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBorrowRecord, setEditingBorrowRecord] = useState(null);

  const loadBorrowRecords = useCallback(async (status = selectedStatus) => {
    try {
      setLoading(true);
      setError('');

      const data = status ? await borrowApi.getByStatus(status) : await borrowApi.getAll();
      setBorrowRecords(sortById(data));
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải danh sách phiếu mượn.'));
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError('');

        const [recordData, userData, bookData] = await Promise.all([
          borrowApi.getAll(),
          userApi.getAll(),
          bookApi.getAll(),
        ]);

        setBorrowRecords(sortById(recordData));
        setUsers(sortById(userData));
        setBooks(sortById(bookData));
      } catch (err) {
        setError(getErrorMessage(err, 'Không thể tải dữ liệu quản lý mượn trả.'));
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const enriched = useMemo(() => {
    return borrowRecords.map((record) => {
      const userId = record.userId ?? record.user?.id;
      const bookId = record.bookId ?? record.book?.id;

      const mappedUser = users.find((user) => Number(user.id) === Number(userId));
      const mappedBook = books.find((book) => Number(book.id) === Number(bookId));

      return {
        ...record,
        userId,
        bookId,
        userName: record.user?.fullName || record.user?.username || mappedUser?.fullName || mappedUser?.username || '',
        bookTitle: record.book?.title || mappedBook?.title || '',
        borrowDateText: formatDisplayDate(record.borrowDate),
        dueDateText: formatDisplayDate(record.dueDate),
        returnDateText: formatDisplayDate(record.returnDate),
      };
    });
  }, [borrowRecords, users, books]);

  async function handleStatusChange(event) {
    const nextStatus = event.target.value;
    setSelectedStatus(nextStatus);
    await loadBorrowRecords(nextStatus);
  }

  function openAdd() {
    setError('');
    setSuccessMessage('');
    setEditingBorrowRecord(null);
    setIsModalOpen(true);
  }

  function openEdit(rec) {
    setError('');
    setSuccessMessage('');
    setEditingBorrowRecord(rec);
    setIsModalOpen(true);
  }

  function closeModal() {
    setEditingBorrowRecord(null);
    setIsModalOpen(false);
  }

  async function handleSave(payload) {
    try {
      setError('');

      if (editingBorrowRecord) {
        const updatePayload = {
          userId: Number(payload.userId),
          bookId: Number(payload.bookId),
          borrowDate: payload.borrowDate || null,
          dueDate: payload.dueDate || null,
          returnDate: payload.returnDate || null,
          status: payload.status,
        };

        const response = await borrowApi.update(editingBorrowRecord.id, updatePayload);
        setSuccessMessage(response?.message || 'Cập nhật phiếu mượn thành công');

        if (response?.updated) {
          closeModal();
          await loadBorrowRecords(selectedStatus);
        }
      } else {
        const createPayload = {
          userId: Number(payload.userId),
          bookId: Number(payload.bookId),
          dueDate: payload.dueDate,
        };

        await borrowApi.borrowBook(createPayload);
        setSuccessMessage('Tạo phiếu mượn thành công');
        closeModal();
        await loadBorrowRecords(selectedStatus);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể lưu phiếu mượn.'));
    }
  }

  async function handleReturn(rec) {
    const confirmed = window.confirm(`Xác nhận trả sách cho phiếu mượn #${rec.id}?`);
    if (!confirmed) {
      return;
    }

    try {
      setError('');
      await borrowApi.returnBook(rec.id);
      await loadBorrowRecords(selectedStatus);
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể cập nhật trạng thái trả sách.'));
    }
  }

  async function handleDelete(rec) {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa phiếu mượn #${rec.id}?`);
    if (!confirmed) {
      return;
    }

    try {
      setError('');
      await borrowApi.delete(rec.id);
      await loadBorrowRecords(selectedStatus);
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể xóa phiếu mượn.'));
    }
  }

  return (
    <section className="borrow-record-page">
      <div className="page-header page-header--space">
        <div>
          <h1>Quản lý mượn trả</h1>
          <p>Danh sách phiếu mượn và trạng thái trả sách.</p>
        </div>

        <div className="page-actions">
          <select value={selectedStatus} onChange={handleStatusChange}>
            <option value="">Tất cả trạng thái</option>
            <option value="BORROWED">BORROWED</option>
            <option value="RETURNED">RETURNED</option>
            <option value="OVERDUE">OVERDUE</option>
          </select>
          <Button onClick={openAdd} variant="primary">Tạo phiếu mượn</Button>
        </div>
      </div>

      {successMessage && !isModalOpen && <p className="borrow-record-page__success">{successMessage}</p>}
      {error && !isModalOpen && <p className="borrow-record-page__error">{error}</p>}

      <BorrowTable records={enriched} loading={loading} onEdit={openEdit} onReturn={handleReturn} onDelete={handleDelete} />

      <Modal title={editingBorrowRecord ? 'Sửa phiếu mượn' : 'Tạo phiếu mượn'} isOpen={isModalOpen} onClose={closeModal}>
        {successMessage && <p className="borrow-record-page__success borrow-record-page__success--modal">{successMessage}</p>}
        {error && <p className="borrow-record-page__error borrow-record-page__error--modal">{error}</p>}
        <BorrowForm initialData={editingBorrowRecord} onSave={handleSave} onCancel={closeModal} users={users} books={books} />
      </Modal>
    </section>
  );
}

export default BorrowRecordPage;
