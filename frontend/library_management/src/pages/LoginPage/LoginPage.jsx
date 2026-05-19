import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import './LoginPage.css';

function LoginPage() {
  return (
    <form className="login-page">
      <h1>Login</h1>
      <Input id="email" label="Email" type="email" />
      <Input id="password" label="Password" type="password" />
      <Button type="submit">Login</Button>
    </form>
  );
}

export default LoginPage;
