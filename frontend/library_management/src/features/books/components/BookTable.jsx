import { Edit2, Trash2, Eye, BookOpen } from 'lucide-react';
import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';

const columns = [
  { key: 'index', label: 'STT', render: (_, __, index) => index + 1 },
  { key: 'title', label: 'Tiêu đề' },
  { key: 'description', label: 'Mô tả' },
  { key: 'publisher', label: 'Nhà xuất bản' },
  { key: 'publishYear', label: 'Năm' },
  { key: 'quantity', label: 'Tổng' },
  { key: 'availableQuantity', label: 'Còn' },
  { key: 'authorName', label: 'Tác giả' },
  { key: 'categoryName', label: 'Danh mục' },
];

function BookTable({ books = [], loading = false, onEdit, onDelete, onViewDetails, onBorrow, isAdmin }) {
  function renderActions(row) {
    if (isAdmin) {
      return (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => onEdit && onEdit(row)} title="Sửa thông tin" className="table-action-btn">
            <Edit2 size={14} />
          </Button>
          <Button variant="danger" onClick={() => onDelete && onDelete(row)} title="Xóa sách" className="table-action-btn">
            <Trash2 size={14} />
          </Button>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <Button 
          variant="primary" 
          onClick={() => onBorrow && onBorrow(row)} 
          title="Mượn sách"
          disabled={row.availableQuantity === 0}
          className="table-action-btn"
        >
          <BookOpen size={14} />
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="table-wrap">
        <p className="book-page__loading">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return <Table columns={columns} data={books} renderActions={renderActions} />;
}

export default BookTable;
