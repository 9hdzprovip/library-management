import Table from '../../../components/common/Table/Table';

const columns = [{ key: 'name', label: 'Name' }];

function CategoryTable({ categories = [] }) {
  return <Table columns={columns} data={categories} />;
}

export default CategoryTable;
