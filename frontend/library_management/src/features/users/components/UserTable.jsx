import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'username', label: 'Username' },
  { key: 'fullName', label: 'Họ & tên' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'createdAt', label: 'Tạo lúc' },
];

function UserTable({ users = [], loading = false, onEdit, onDelete }) {
  function renderActions(row) {
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" onClick={() => onEdit && onEdit(row)}>Sửa</Button>
        <Button variant="danger" onClick={() => onDelete && onDelete(row)}>Xóa</Button>
      </div>
    );
  }

  return <Table columns={columns} data={users} renderActions={renderActions} />;
}

export default UserTable;
