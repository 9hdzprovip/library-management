import { Edit2, Trash2 } from 'lucide-react';
import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';

const columns = [
  { key: 'index', label: 'STT', render: (_, __, index) => index + 1 },
  { key: 'username', label: 'Tên tài khoản' },
  { key: 'fullName', label: 'Họ & tên' },
  { key: 'email', label: 'Email' },
  {
    key: 'role',
    label: 'Vai trò',
    render: (value) => {
      const isAdmin = String(value).toUpperCase() === 'ADMIN';
      return (
        <span className={`badge ${isAdmin ? 'badge-danger' : 'badge-primary'}`}>
          {value}
        </span>
      );
    }
  },
];

function UserTable({ users = [], loading = false, onEdit, onDelete, highlightedId }) {
  function renderActions(row) {
    return (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={() => onEdit && onEdit(row)} title="Sửa thông tin" className="table-action-btn">
          <Edit2 size={14} />
        </Button>
        <Button variant="danger" onClick={() => onDelete && onDelete(row)} title="Xóa người dùng" className="table-action-btn">
          <Trash2 size={14} />
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="table-wrap">
        <p className="user-page__loading">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return <Table columns={columns} data={users} renderActions={renderActions} highlightedId={highlightedId} />;
}

export default UserTable;
