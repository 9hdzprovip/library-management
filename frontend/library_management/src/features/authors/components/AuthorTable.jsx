import { Edit2, Trash2 } from 'lucide-react';
import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';

const columns = [
  { key: 'index', label: 'STT', render: (_, __, index) => index + 1 },
  { key: 'name', label: 'Tên tác giả' },
  { key: 'biography', label: 'Tiểu sử' },
];

function AuthorTable({ authors = [], loading = false, onEdit, onDelete, isAdmin }) {
  function renderActions(row) {
    return (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={() => onEdit && onEdit(row)} title="Sửa thông tin" className="table-action-btn">
          <Edit2 size={14} />
        </Button>
        <Button variant="danger" onClick={() => onDelete && onDelete(row)} title="Xóa tác giả" className="table-action-btn">
          <Trash2 size={14} />
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="table-wrap">
        <p className="author-page__loading">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return <Table columns={columns} data={authors} renderActions={isAdmin ? renderActions : undefined} />;
}

export default AuthorTable;
