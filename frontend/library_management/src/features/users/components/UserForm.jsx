import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

function UserForm({ onSubmit }) {
  return (
    <form className="stack" onSubmit={onSubmit}>
      <Input id="user-name" label="Name" name="name" />
      <Input id="user-email" label="Email" name="email" type="email" />
      <Button type="submit">Save user</Button>
    </form>
  );
}

export default UserForm;
