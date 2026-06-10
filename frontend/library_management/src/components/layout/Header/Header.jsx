import { useNavigate } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'User';
  const avatarText = username.charAt(0).toUpperCase();

  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loadNotifications = () => {
    const allNotifs = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    // Filter by logged-in user's username
    const myNotifs = allNotifs.filter((n) => n.studentUsername?.toLowerCase() === username.toLowerCase());
    setNotifications(myNotifs);
  };

  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('mock_notifications_updated', handleUpdate);

    // Close dropdown on outside click
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('mock_notifications_updated', handleUpdate);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [username]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    const allNotifs = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    const updated = allNotifs.map((n) => {
      if (n.studentUsername?.toLowerCase() === username.toLowerCase()) {
        return { ...n, read: true };
      }
      return n;
    });
    localStorage.setItem('mock_notifications', JSON.stringify(updated));
    loadNotifications();
  };

  const handleNotificationClick = (id) => {
    const allNotifs = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
    const updated = allNotifs.map((n) => {
      if (n.id === id) {
        return { ...n, read: true };
      }
      return n;
    });
    localStorage.setItem('mock_notifications', JSON.stringify(updated));
    loadNotifications();
  };

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  }

  function formatRelativeTime(dateString) {
    try {
      const now = new Date();
      const past = new Date(dateString);
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} giờ trước`;
      return past.toLocaleDateString('vi-VN');
    } catch {
      return '';
    }
  }

  return (
    <header className="header">
      <div className="header__title">
        <h2>Thư Viện Bách Khoa Hà Nội</h2>
        <p>Hệ thống thư viện Đại học Bách Khoa Hà Nội</p>
      </div>

      <div className="header__actions">
        {/* Notifications Icon & Dropdown */}
        {role.toUpperCase() !== 'ADMIN' && (
          <div className="header__notifications" ref={dropdownRef}>
            <button 
              className="header__bell-btn" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title="Thông báo"
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="header__bell-badge">{unreadCount}</span>}
            </button>
            
            {isDropdownOpen && (
              <div className="header__notifications-dropdown">
                <div className="header__notifications-header">
                  <h4>Thông báo</h4>
                  {unreadCount > 0 && (
                    <button className="header__notifications-clear" onClick={handleMarkAllAsRead}>
                      Đọc tất cả
                    </button>
                  )}
                </div>
                <div className="header__notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map((item) => (
                      <div 
                        key={item.id} 
                        className={`header__notification-item ${!item.read ? 'header__notification-item--unread' : ''}`}
                        onClick={() => handleNotificationClick(item.id)}
                      >
                        <span className="header__notification-title">{item.title}</span>
                        <p className="header__notification-msg">{item.message}</p>
                        <span className="header__notification-date">{formatRelativeTime(item.date)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="header__notifications-empty">
                      Không có thông báo nào.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

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
