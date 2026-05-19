import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

function BookForm({ onSubmit }) {
  return (
    <form className="stack" onSubmit={onSubmit}>
      <Input id="book-title" label="Title" name="title" />
      <Input id="book-isbn" label="ISBN" name="isbn" />
      <Input id="book-quantity" label="Quantity" name="quantity" type="number" min="0" />
      <Button type="submit">Save book</Button>
    </form>
  );
}

export default BookForm;
