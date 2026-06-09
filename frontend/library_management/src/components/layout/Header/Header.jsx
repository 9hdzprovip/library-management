import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
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
        <h2>Thư Viện Bách Khoa Hà Nội</h2>
        <p>Hệ thống thư viện Đại học Bách Khoa Hà Nội</p>
      </div>

      <div className="header__actions">
        <div className="header__user">
          <span className="header__avatar">{avatarText}</span>
          <div className="header__user-info">
            <strong>{username}</strong>
            <span className="header__user-role">{role}</span>
          </div>
        </div>

        <button className="header__logout" type="button" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
