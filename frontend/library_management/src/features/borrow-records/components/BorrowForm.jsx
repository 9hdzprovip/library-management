import { useEffect, useState } from 'react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

function getLocalDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Tự động định dạng khi người dùng nhập dd/mm/yyyy
function formatDateInput(value) {
  // Giữ lại chỉ các chữ số
  const digits = value.replace(/\D/g, '');
  
  if (digits.length === 0) return '';
  
  let formatted = '';
  if (digits.length <= 2) {
    formatted = digits;
  } else if (digits.length <= 4) {
    formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
  } else {
    formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  }
  return formatted;
}

// Kiểm tra tính hợp lệ của ngày dạng dd/mm/yyyy
function isValidDate(dateStr) {
  if (!dateStr) return true;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return false;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (year < 1000 || year > 9999) return false;
  if (month < 1 || month > 12) return false;
  
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return false;
  
  return true;
}

// Chuyển đổi dd/mm/yyyy -> yyyy-mm-dd
function ddmmyyyyToYyyymmdd(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      return `${year}-${month}-${day}`;
    }
  }
  return '';
}

// Chuyển đổi yyyy-mm-dd (hoặc ISO string) -> dd/mm/yyyy
function yyyymmddToDdmmyyyy(dateStr) {
  if (!dateStr) return '';
  const cleanStr = String(dateStr).slice(0, 10);
  const parts = cleanStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return '';
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
      setBorrowDate(yyyymmddToDdmmyyyy(initialData.borrowDate));
      setDueDate(yyyymmddToDdmmyyyy(initialData.dueDate));
      setReturnDate(yyyymmddToDdmmyyyy(initialData.returnDate));
      setStatus(initialData.status ?? 'BORROWED');
    } else {
      setUserId('');
      setBookId('');
      setBorrowDate(yyyymmddToDdmmyyyy(getLocalDateString()));
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

    // Kiểm tra định dạng/tính hợp lệ ngày tháng dd/mm/yyyy
    if (borrowDate && !isValidDate(borrowDate)) {
      return setError('Ngày mượn không hợp lệ hoặc không đúng định dạng dd/mm/yyyy');
    }
    if (dueDate && !isValidDate(dueDate)) {
      return setError('Ngày đến hạn không hợp lệ hoặc không đúng định dạng dd/mm/yyyy');
    }
    if (returnDate && !isValidDate(returnDate)) {
      return setError('Ngày trả không hợp lệ hoặc không đúng định dạng dd/mm/yyyy');
    }

    const dbBorrowDate = ddmmyyyyToYyyymmdd(borrowDate);
    const dbDueDate = ddmmyyyyToYyyymmdd(dueDate);
    const dbReturnDate = ddmmyyyyToYyyymmdd(returnDate);

    // Kiểm tra việc chuyển đổi có thành công không
    if (borrowDate && !dbBorrowDate) {
      return setError('Ngày mượn không đúng định dạng dd/mm/yyyy');
    }
    if (dueDate && !dbDueDate) {
      return setError('Ngày đến hạn không đúng định dạng dd/mm/yyyy');
    }
    if (returnDate && !dbReturnDate) {
      return setError('Ngày trả không đúng định dạng dd/mm/yyyy');
    }

    if (dbDueDate && dbBorrowDate) {
      const dDate = new Date(dbDueDate).setHours(0, 0, 0, 0);
      const bDate = new Date(dbBorrowDate).setHours(0, 0, 0, 0);
      if (dDate < bDate) {
        return setError('Ngày đến hạn không được trước ngày mượn');
      }
    }

    if (status === 'RETURNED' && !returnDate) {
      return setError('Khi trạng thái là RETURNED, cần nhập ngày trả');
    }

    setError('');
    onSave({
      userId: Number(userId),
      bookId: Number(bookId),
      borrowDate: dbBorrowDate || null,
      dueDate: dbDueDate || null,
      returnDate: dbReturnDate || null,
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
        <Input
          label="Ngày mượn (dd/mm/yyyy)"
          name="borrowDate"
          type="text"
          placeholder="dd/mm/yyyy"
          value={borrowDate}
          onChange={(e) => setBorrowDate(formatDateInput(e.target.value))}
        />
      ) : (
        <Input
          label="Ngày mượn (Tự động - dd/mm/yyyy)"
          name="borrowDate"
          type="text"
          value={borrowDate}
          disabled
        />
      )}

      <Input
        label="Ngày đến hạn (dd/mm/yyyy)"
        name="dueDate"
        type="text"
        placeholder="dd/mm/yyyy"
        value={dueDate}
        onChange={(e) => setDueDate(formatDateInput(e.target.value))}
      />

      {isEditing && (
        <>
          <Input
            label="Ngày trả (dd/mm/yyyy)"
            name="returnDate"
            type="text"
            placeholder="dd/mm/yyyy"
            value={returnDate}
            onChange={(e) => setReturnDate(formatDateInput(e.target.value))}
          />
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
