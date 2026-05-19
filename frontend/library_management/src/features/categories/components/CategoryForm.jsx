import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

function CategoryForm({ onSubmit }) {
  return (
    <form className="stack" onSubmit={onSubmit}>
      <Input id="category-name" label="Name" name="name" />
      <Button type="submit">Save category</Button>
    </form>
  );
}

export default CategoryForm;
