import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell } from 'lucide-react';
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

function sortByBorrowDateDescending(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return [...data].sort((a, b) => {
    const timeA = a.borrowDate ? new Date(a.borrowDate).getTime() : 0;
    const timeB = b.borrowDate ? new Date(b.borrowDate).getTime() : 0;
    if (timeA !== timeB) {
      return timeB - timeA;
    }
    return Number(b.id || 0) - Number(a.id || 0);
  });
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
  const role = (localStorage.getItem('role') || 'USER').toUpperCase();
  const isAdmin = role === 'ADMIN';

  const [borrowRecords, setBorrowRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBorrowRecord, setEditingBorrowRecord] = useState(null);
  const [notifiedRecord, setNotifiedRecord] = useState(null);

  const loadBorrowRecords = useCallback(async (status = selectedStatus) => {
    try {
      setLoading(true);
      setError('');

      let data;
      if (isAdmin) {
        data = status ? await borrowApi.getByStatus(status) : await borrowApi.getAll();
      } else {
        data = await borrowApi.getMyRecords();
        if (status) {
          data = data.filter(r => r.status === status);
        }
      }
      setBorrowRecords(sortByBorrowDateDescending(data));
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải danh sách phiếu mượn.'));
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, isAdmin]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError('');

        if (isAdmin) {
          const [recordData, userData, bookData] = await Promise.all([
            borrowApi.getAll(),
            userApi.getAll(),
            bookApi.getAll(),
          ]);

          setBorrowRecords(sortByBorrowDateDescending(recordData));
          setUsers(sortById(userData));
          setBooks(sortById(bookData));
        } else {
          const [recordData, bookData] = await Promise.all([
            borrowApi.getMyRecords(),
            bookApi.getAll(),
          ]);

          setBorrowRecords(sortByBorrowDateDescending(recordData));
          setUsers([]);
          setBooks(sortById(bookData));
        }
      } catch (err) {
        setError(getErrorMessage(err, 'Không thể tải dữ liệu quản lý mượn trả.'));
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [isAdmin]);

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
        userName: record.fullName || record.user?.fullName || record.user?.username || mappedUser?.fullName || mappedUser?.username || '',
        bookTitle: record.bookTitle || record.book?.title || mappedBook?.title || '',
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

  function handleNotify(rec) {
    // Determine student username
    const mappedUser = users.find(u => Number(u.id) === Number(rec.userId));
    const studentUsername = rec.user?.username || mappedUser?.username || rec.userName || 'user';

    const allNotifs = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    const newNotification = {
      id: Date.now(),
      studentUsername: studentUsername,
      title: 'Cảnh báo sách quá hạn!',
      message: `Bạn đang mượn cuốn sách "${rec.bookTitle}" (phiếu mượn #${rec.id}) và đã quá hạn kể từ ngày ${rec.dueDateText}. Vui lòng mang sách trả hoặc gia hạn sớm.`,
      date: new Date().toISOString(),
      read: false
    };

    localStorage.setItem('mock_notifications', JSON.stringify([newNotification, ...allNotifs]));
    
    // Dispatch custom event to notify Header if active
    window.dispatchEvent(new Event('mock_notifications_updated'));

    setNotifiedRecord(rec);
  }

  return (
    <section className="borrow-record-page">
      <div className="page-header page-header--space">
        <div>
          <h1>{isAdmin ? 'Quản lý mượn trả' : 'Lịch sử mượn sách'}</h1>
          <p>{isAdmin ? 'Danh sách phiếu mượn và trạng thái trả sách.' : 'Danh sách phiếu mượn của bạn.'}</p>
        </div>

        {isAdmin && (
          <div className="page-actions">
            <Button onClick={openAdd} variant="primary">Tạo phiếu mượn</Button>
          </div>
        )}
      </div>

      <div className="search-card borrow-search">
        <label className="borrow-search__label">Lọc theo trạng thái:</label>
        <select value={selectedStatus} onChange={handleStatusChange}>
          <option value="">Tất cả trạng thái</option>
          <option value="BORROWED">BORROWED (Đang mượn)</option>
          <option value="RETURNED">RETURNED (Đã trả)</option>
          <option value="OVERDUE">OVERDUE (Quá hạn)</option>
        </select>
      </div>

      {successMessage && !isModalOpen && <p className="borrow-record-page__success">{successMessage}</p>}
      {error && !isModalOpen && <p className="borrow-record-page__error">{error}</p>}

      <BorrowTable 
        records={enriched} 
        loading={loading} 
        onEdit={openEdit} 
        onReturn={handleReturn} 
        onDelete={handleDelete} 
        onNotify={handleNotify} 
        isAdmin={isAdmin} 
      />

      <Modal title={editingBorrowRecord ? 'Sửa phiếu mượn' : 'Tạo phiếu mượn'} isOpen={isModalOpen} onClose={closeModal}>
        {successMessage && <p className="borrow-record-page__success borrow-record-page__success--modal">{successMessage}</p>}
        {error && <p className="borrow-record-page__error borrow-record-page__error--modal">{error}</p>}
        <BorrowForm initialData={editingBorrowRecord} onSave={handleSave} onCancel={closeModal} users={users} books={books} />
      </Modal>

      {/* Overdue Notification Modal */}
      {notifiedRecord && (
        <Modal 
          title="Gửi thông báo nhắc nhở" 
          isOpen={!!notifiedRecord} 
          onClose={() => setNotifiedRecord(null)}
        >
          <div className="borrow-info-modal">
            <div className="borrow-info-modal__icon" style={{ background: 'var(--color-warning-soft)', color: 'var(--color-warning)' }}>
              <Bell size={36} />
            </div>
            <h3 className="borrow-info-modal__title">Thông báo quá hạn:</h3>
            <p className="borrow-info-modal__book" style={{ color: 'var(--color-danger)' }}>
              Gửi sinh viên: {notifiedRecord.userName}
            </p>
            <div className="borrow-info-modal__divider" />
            <div className="borrow-info-modal__msg" style={{ textAlign: 'left', background: 'var(--color-background-light)', padding: '14px', borderRadius: 'var(--radius-md)', fontStyle: 'italic', marginBottom: 'var(--space-4)', width: '100%', boxSizing: 'border-box' }}>
              Chào <strong>{notifiedRecord.userName}</strong>,<br/><br/>
              Bạn đang mượn cuốn sách <strong>{notifiedRecord.bookTitle}</strong> (phiếu mượn #{notifiedRecord.id}) và đã quá hạn kể từ ngày <strong>{notifiedRecord.dueDateText}</strong>.<br/><br/>
              Vui lòng mang sách đến quầy thủ thư để trả hoặc gia hạn trong thời gian sớm nhất.
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 var(--space-4) 0' }}>
              <span style={{ fontSize: '16px' }}>✓</span> Đã gửi thông báo nhắc nhở thành công!
            </p>
            <div className="borrow-info-modal__actions">
              <Button variant="primary" onClick={() => setNotifiedRecord(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}

export default BorrowRecordPage;
