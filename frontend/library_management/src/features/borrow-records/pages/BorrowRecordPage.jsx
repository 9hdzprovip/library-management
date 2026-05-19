import { useEffect, useMemo, useState } from 'react';
import BorrowTable from '../components/BorrowTable';
import BorrowForm from '../components/BorrowForm';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import * as borrowApi from '../../../api/borrowRecordApi';
import * as userApi from '../../../api/userApi';
import * as bookApi from '../../../api/bookApi';
import '../styles/borrowRecord.css';

function BorrowRecordPage() {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([borrowApi.fetchRecords(), userApi.fetchUsers(), bookApi.fetchBooks()]).then(
      ([r, u, b]) => {
        setRecords(r);
        setUsers(u);
        setBooks(b);
        setLoading(false);
      }
    );
  }, []);

  const enriched = useMemo(() => {
    return records.map((rec) => ({
      ...rec,
      userName: users.find((x) => x.id === rec.userId)?.fullName || '',
      bookTitle: books.find((x) => x.id === rec.bookId)?.title || '',
    }));
  }, [records, users, books]);

  const filtered = useMemo(() => {
    if (!filterStatus) return enriched;
    return enriched.filter((r) => r.status === filterStatus);
  }, [enriched, filterStatus]);

  function openAdd() {
    setEditing(null);
    setIsModalOpen(true);
  }

  function openEdit(rec) {
    setEditing(rec);
    setIsModalOpen(true);
  }

  function closeModal() {
    setEditing(null);
    setIsModalOpen(false);
  }

  async function handleSave(payload) {
    if (editing) {
      const updated = await borrowApi.updateRecord(editing.id, payload);
      setRecords((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await borrowApi.createRecord(payload);
      setRecords((prev) => [created, ...prev]);
    }
    closeModal();
  }

  async function handleReturn(rec) {
    const updated = await borrowApi.returnRecord(rec.id, { returnDate: new Date().toISOString().slice(0, 10) });
    setRecords((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  async function handleDelete(rec) {
    setRecords((prev) => prev.filter((r) => r.id !== rec.id));
    try {
      await borrowApi.deleteRecord(rec.id);
    } catch (e) {
      setRecords((prev) => [rec, ...prev]);
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
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="BORROWED">BORROWED</option>
            <option value="RETURNED">RETURNED</option>
            <option value="OVERDUE">OVERDUE</option>
          </select>
          <Button onClick={openAdd} variant="primary">Tạo phiếu mượn</Button>
        </div>
      </div>

      <BorrowTable records={filtered} loading={loading} onEdit={openEdit} onReturn={handleReturn} onDelete={handleDelete} />

      <Modal title={editing ? 'Sửa phiếu mượn' : 'Tạo phiếu mượn'} isOpen={isModalOpen} onClose={closeModal}>
        <BorrowForm initialData={editing} onSave={handleSave} onCancel={closeModal} users={users} books={books} />
      </Modal>
    </section>
  );
}

export default BorrowRecordPage;
