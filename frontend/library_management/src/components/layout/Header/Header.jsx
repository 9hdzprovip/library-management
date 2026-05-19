import './Header.css';

function Header({ title = 'Dashboard' }) {
  return (
    <header className="header">
      <div>
        <p>Admin</p>
        <h2>{title}</h2>
      </div>
    </header>
  );
}

export default Header;
