import { Edit2, Trash2, CheckSquare, Bell } from 'lucide-react';
import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';

const columns = [
  { key: 'index', label: 'STT', render: (_, __, index) => index + 1 },
  { key: 'userName', label: 'Người dùng' },
  { key: 'bookTitle', label: 'Sách mượn' },
  { key: 'borrowDateText', label: 'Ngày mượn' },
  { key: 'dueDateText', label: 'Ngày đến hạn' },
  { key: 'returnDateText', label: 'Ngày trả' },
  {
    key: 'status',
    label: 'Trạng thái',
    render: (value) => {
      let badgeClass = 'badge-primary';
      let statusText = value;

      if (value === 'BORROWED') {
        badgeClass = 'badge-primary';
        statusText = 'Đang mượn';
      } else if (value === 'RETURNED') {
        badgeClass = 'badge-success';
        statusText = 'Đã trả';
      } else if (value === 'OVERDUE') {
        badgeClass = 'badge-danger';
        statusText = 'Quá hạn';
      }

      return <span className={`badge ${badgeClass}`}>{statusText}</span>;
    }
  },
];

function BorrowTable({ records = [], loading = false, onEdit, onReturn, onDelete, onNotify, isAdmin }) {
  function renderActions(row) {
    return (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        {row.status === 'OVERDUE' && (
          <Button variant="warning" onClick={() => onNotify && onNotify(row)} title="Gửi thông báo nhắc nhở" className="table-action-btn">
            <Bell size={14} />
          </Button>
        )}
        <Button variant="secondary" onClick={() => onEdit && onEdit(row)} title="Sửa thông tin phiếu" className="table-action-btn">
          <Edit2 size={14} />
        </Button>
        {(row.status === 'BORROWED' || row.status === 'OVERDUE') && (
          <Button variant="success" onClick={() => onReturn && onReturn(row)} title="Xác nhận trả sách" className="table-action-btn">
            <CheckSquare size={14} />
          </Button>
        )}
        <Button variant="danger" onClick={() => onDelete && onDelete(row)} title="Xóa phiếu mượn" className="table-action-btn">
          <Trash2 size={14} />
        </Button>
      </div>
    );
  }

  if (loading) {
    return <p className="borrow-table__loading">Đang tải danh sách phiếu mượn...</p>;
  }

  return <Table columns={columns} data={records} renderActions={isAdmin ? renderActions : undefined} />;
}

export default BorrowTable;
