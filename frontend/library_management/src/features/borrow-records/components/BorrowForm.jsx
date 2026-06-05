import { useEffect, useState } from 'react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

function toDateInputValue(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 10);
}

function BorrowForm({ initialData = null, onSave, onCancel, users = [], books = [] }) {
  const isEditing = Boolean(initialData);
  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');
  const [borrowDate, setBorrowDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [status, setStatus] = useState('BORROWED');
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
      setBorrowDate('');
      setDueDate('');
      setReturnDate('');
      setStatus('BORROWED');
    }
    setError('');
  }, [initialData]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!userId) return setError('Vui lòng chọn người dùng');
    if (!bookId) return setError('Vui lòng chọn sách');
    if (!isEditing && !dueDate) return setError('Ngày đến hạn là bắt buộc');
    if (dueDate && Number.isNaN(new Date(dueDate).getTime())) return setError('Ngày đến hạn không hợp lệ');
    if (returnDate && Number.isNaN(new Date(returnDate).getTime())) return setError('Ngày trả không hợp lệ');
    if (dueDate && borrowDate && new Date(dueDate) <= new Date(borrowDate)) return setError('Ngày đến hạn phải sau ngày mượn');
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
      <select value={userId} onChange={(e) => setUserId(e.target.value)}>
        <option value="">Chọn người dùng</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.fullName || u.username}</option>
        ))}
      </select>

      <label>Sách</label>
      <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
        <option value="">Chọn sách</option>
        {books.map((b) => (
          <option key={b.id} value={b.id}>{b.title}</option>
        ))}
      </select>

      <Input label="Ngày mượn" name="borrowDate" type="date" value={borrowDate} onChange={(e) => setBorrowDate(e.target.value)} />
      <Input label="Ngày đến hạn" name="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <Input label="Ngày trả" name="returnDate" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />

      <label>Trạng thái</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="BORROWED">BORROWED</option>
        <option value="RETURNED">RETURNED</option>
        <option value="OVERDUE">OVERDUE</option>
      </select>

      {error && <p className="input-field__error">{error}</p>}

      <div className="borrow-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="primary">Lưu</Button>
      </div>
    </form>
  );
}

export default BorrowForm;
