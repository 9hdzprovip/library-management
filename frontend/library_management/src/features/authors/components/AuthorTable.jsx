import Table from '../../../components/common/Table/Table';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'bio', label: 'Bio' },
];

function AuthorTable({ authors = [] }) {
  return <Table columns={columns} data={authors} />;
}

export default AuthorTable;
