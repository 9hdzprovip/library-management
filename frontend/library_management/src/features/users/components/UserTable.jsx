import Table from '../../../components/common/Table/Table';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
];

function UserTable({ users = [] }) {
  return <Table columns={columns} data={users} />;
}

export default UserTable;
