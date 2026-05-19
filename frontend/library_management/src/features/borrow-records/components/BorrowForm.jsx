import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

function BorrowForm({ onSubmit }) {
  return (
    <form className="stack" onSubmit={onSubmit}>
      <Input id="borrow-user" label="User ID" name="userId" />
      <Input id="borrow-book" label="Book ID" name="bookId" />
      <Input id="borrow-date" label="Borrow date" name="borrowDate" type="date" />
      <Button type="submit">Save record</Button>
    </form>
  );
}

export default BorrowForm;
