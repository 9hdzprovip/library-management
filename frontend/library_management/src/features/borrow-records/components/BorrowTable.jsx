import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'userName', label: 'Người dùng' },
  { key: 'bookTitle', label: 'Sách' },
  { key: 'borrowDate', label: 'Ngày mượn' },
  { key: 'dueDate', label: 'Ngày đến hạn' },
  { key: 'returnDate', label: 'Ngày trả' },
  { key: 'status', label: 'Trạng thái' },
];

function BorrowTable({ records = [], loading = false, onEdit, onReturn, onDelete }) {
  function renderActions(row) {
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" onClick={() => onEdit && onEdit(row)}>Sửa</Button>
        {(row.status === 'BORROWED' || row.status === 'OVERDUE') && (
          <Button variant="success" onClick={() => onReturn && onReturn(row)}>Trả sách</Button>
        )}
        <Button variant="danger" onClick={() => onDelete && onDelete(row)}>Xóa</Button>
      </div>
    );
  }

  return <Table columns={columns} data={records} renderActions={renderActions} />;
}

export default BorrowTable;
