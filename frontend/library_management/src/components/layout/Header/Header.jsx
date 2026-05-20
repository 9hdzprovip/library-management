import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'User';
  const avatarText = username.charAt(0).toUpperCase();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  }

  return (
    <header className="header">
      <div className="header__title">
        <h2>Library Management</h2>
        <p>Quản trị hệ thống thư viện</p>
      </div>

      <div className="header__actions">
        <div className="header__user">
          <span className="header__avatar">{avatarText}</span>
          <div>
            <p>{role}</p>
            <strong>{username}</strong>
          </div>
        </div>

        <button className="header__logout" type="button" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
}

export default Header;
