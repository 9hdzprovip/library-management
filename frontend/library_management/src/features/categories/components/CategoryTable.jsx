import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Tên' },
  { key: 'description', label: 'Mô tả' },
  { key: 'createdAt', label: 'Tạo lúc' },
];

function CategoryTable({ categories = [], loading = false, onEdit, onDelete }) {
  function renderActions(row) {
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" onClick={() => onEdit && onEdit(row)}>Sửa</Button>
        <Button variant="danger" onClick={() => onDelete && onDelete(row)}>Xóa</Button>
      </div>
    );
  }

  return <Table columns={columns} data={categories} renderActions={renderActions} />;
}

export default CategoryTable;
