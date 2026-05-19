import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header__title">
        <h2>Library Management</h2>
        <p>Quản trị hệ thống thư viện</p>
      </div>

      <div className="header__user">
        <span className="header__avatar">A</span>
        <div>
          <p>User</p>
          <strong>Admin</strong>
        </div>
      </div>
    </header>
  );
}

export default Header;
