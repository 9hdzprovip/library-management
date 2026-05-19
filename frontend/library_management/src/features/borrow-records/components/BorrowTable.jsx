import Table from '../../../components/common/Table/Table';

const columns = [
  { key: 'userName', label: 'User' },
  { key: 'bookTitle', label: 'Book' },
  { key: 'status', label: 'Status' },
];

function BorrowTable({ records = [] }) {
  return <Table columns={columns} data={records} />;
}

export default BorrowTable;
