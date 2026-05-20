import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Tiêu đề' },
  { key: 'description', label: 'Mô tả' },
  { key: 'publisher', label: 'Nhà xuất bản' },
  { key: 'publishYear', label: 'Năm' },
  { key: 'quantity', label: 'Tổng' },
  { key: 'availableQuantity', label: 'Còn' },
  { key: 'authorName', label: 'Tác giả' },
  { key: 'categoryName', label: 'Danh mục' },
];

function BookTable({ books = [], loading = false, onEdit, onDelete }) {
  function renderActions(row) {
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" onClick={() => onEdit && onEdit(row)}>Sửa</Button>
        <Button variant="danger" onClick={() => onDelete && onDelete(row)}>Xóa</Button>
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
