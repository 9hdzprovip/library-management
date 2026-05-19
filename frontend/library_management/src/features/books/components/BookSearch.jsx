import Input from '../../../components/common/Input/Input';

function BookSearch({ value, onChange }) {
  return <Input id="book-search" label="Search books" onChange={onChange} value={value} />;
}

export default BookSearch;
