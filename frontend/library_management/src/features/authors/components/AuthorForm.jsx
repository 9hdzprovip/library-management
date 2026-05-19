import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

function AuthorForm({ onSubmit }) {
  return (
    <form className="stack" onSubmit={onSubmit}>
      <Input id="author-name" label="Name" name="name" />
      <Input id="author-bio" label="Bio" name="bio" />
      <Button type="submit">Save author</Button>
    </form>
  );
}

export default AuthorForm;
