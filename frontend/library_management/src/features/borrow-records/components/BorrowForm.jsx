import { useEffect, useState } from 'react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

function toDateInputValue(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 10);
}

function getLocalDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function BorrowForm({ initialData = null, onSave, onCancel, users = [], books = [] }) {
  const isEditing = Boolean(initialData);
  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');
  const [borrowDate, setBorrowDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [status, setStatus] = useState('BORROWED');
  const [userSearch, setUserSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setUserId(String(initialData.userId ?? initialData.user?.id ?? ''));
      setBookId(String(initialData.bookId ?? initialData.book?.id ?? ''));
      setBorrowDate(toDateInputValue(initialData.borrowDate));
      setDueDate(toDateInputValue(initialData.dueDate));
      setReturnDate(toDateInputValue(initialData.returnDate));
      setStatus(initialData.status ?? 'BORROWED');
    } else {
      setUserId('');
      setBookId('');
      setBorrowDate(getLocalDateString());
      setDueDate('');
      setReturnDate('');
      setStatus('BORROWED');
    }
    setUserSearch('');
    setBookSearch('');
    setError('');
  }, [initialData]);

  const filteredUsers = users.filter((u) => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return true;
    return (
      (u.fullName || '').toLowerCase().includes(query) ||
      (u.username || '').toLowerCase().includes(query) ||
      String(u.id).includes(query)
    );
  });

  const filteredBooks = books.filter((b) => {
    const query = bookSearch.trim().toLowerCase();
    if (!query) return true;
    return (
      (b.title || '').toLowerCase().includes(query) ||
      (b.publisher || '').toLowerCase().includes(query) ||
      String(b.id).includes(query)
    );
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!userId) return setError('Vui lòng chọn người dùng');
    if (!bookId) return setError('Vui lòng chọn sách');
    if (!isEditing && !dueDate) return setError('Ngày đến hạn là bắt buộc');
    if (dueDate && Number.isNaN(new Date(dueDate).getTime())) return setError('Ngày đến hạn không hợp lệ');
    if (returnDate && Number.isNaN(new Date(returnDate).getTime())) return setError('Ngày trả không hợp lệ');

    if (dueDate && borrowDate) {
      const dDate = new Date(dueDate).setHours(0, 0, 0, 0);
      const bDate = new Date(borrowDate).setHours(0, 0, 0, 0);
      if (dDate < bDate) {
        return setError('Ngày đến hạn không được trước ngày mượn');
      }
    }

    if (status === 'RETURNED' && !returnDate) return setError('Khi trạng thái là RETURNED, cần nhập ngày trả');

    setError('');
    onSave({
      userId: Number(userId),
      bookId: Number(bookId),
      borrowDate: borrowDate || null,
      dueDate: dueDate || null,
      returnDate: returnDate || null,
      status,
    });
  }

  return (
    <form className="borrow-form" onSubmit={handleSubmit}>
      <label>Người dùng</label>
      <div className="borrow-form__search-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <Input
          placeholder="🔍 Tìm nhanh người dùng theo tên hoặc username..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">
            {userSearch ? `Kết quả tìm kiếm (${filteredUsers.length})` : 'Chọn người dùng'}
          </option>
          {filteredUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName ? `${u.fullName} (${u.username})` : u.username}
            </option>
          ))}
        </select>
      </div>

      <label>Sách</label>
      <div className="borrow-form__search-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <Input
          placeholder="🔍 Tìm nhanh sách theo tiêu đề..."
          value={bookSearch}
          onChange={(e) => setBookSearch(e.target.value)}
        />
        <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
          <option value="">
            {bookSearch ? `Kết quả tìm kiếm (${filteredBooks.length})` : 'Chọn sách'}
          </option>
          {filteredBooks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} {b.availableQuantity !== undefined ? `(Còn ${b.availableQuantity} cuốn)` : ''}
            </option>
          ))}
        </select>
      </div>

      {isEditing ? (
        <Input label="Ngày mượn" name="borrowDate" type="date" value={borrowDate} onChange={(e) => setBorrowDate(e.target.value)} />
      ) : (
        <Input label="Ngày mượn (Tự động)" name="borrowDate" type="date" value={borrowDate} disabled />
      )}

      <Input label="Ngày đến hạn" name="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

      {isEditing && (
        <>
          <Input label="Ngày trả" name="returnDate" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          <label>Trạng thái</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="BORROWED">BORROWED</option>
            <option value="RETURNED">RETURNED</option>
            <option value="OVERDUE">OVERDUE</option>
          </select>
        </>
      )}

      {error && <p className="input-field__error">{error}</p>}

      <div className="borrow-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="primary">Lưu</Button>
      </div>
    </form>
  );
}

export default BorrowForm;
