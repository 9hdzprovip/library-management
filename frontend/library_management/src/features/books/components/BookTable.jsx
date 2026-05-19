import Table from '../../../components/common/Table/Table';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'isbn', label: 'ISBN' },
  { key: 'quantity', label: 'Quantity' },
];

function BookTable({ books = [] }) {
  return <Table columns={columns} data={books} />;
}

export default BookTable;
