import { useNavigate } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import * as notificationApi from '../../../api/notificationApi';
import * as borrowApi from '../../../api/borrowRecordApi';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'User';
  const avatarText = username.charAt(0).toUpperCase();

  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnedBookTitle, setReturnedBookTitle] = useState('');
  const dropdownRef = useRef(null);

  const loadNotifications = async () => {
    try {
      if (role.toUpperCase() !== 'ADMIN') {
        const data = await notificationApi.getMyNotifications();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Không thể tải thông báo từ backend:", err);
    }
  };

  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('mock_notifications_updated', handleUpdate);
    window.addEventListener('notifications_updated', handleUpdate);

    // Close dropdown on outside click
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('mock_notifications_updated', handleUpdate);
      window.removeEventListener('notifications_updated', handleUpdate);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [username, role]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      const unreadNotifs = notifications.filter((n) => !n.read);
      if (unreadNotifs.length > 0) {
        await Promise.all(unreadNotifs.map((n) => notificationApi.markAsRead(n.id)));
        loadNotifications();
      }
    } catch (err) {
      console.error("Không thể đánh dấu đọc tất cả thông báo:", err);
    }
  };

  const handleNotificationClick = async (item) => {
    try {
      if (!item.read) {
        await notificationApi.markAsRead(item.id);
        loadNotifications();
      }

      // Check if the book has been returned by parsing the borrow record ID from the message
      const match = item.message.match(/phiếu mượn #(\d+)/);
      if (match) {
        const borrowRecordId = Number(match[1]);
        try {
          const records = await borrowApi.getMyRecords();
          const record = records.find((r) => Number(r.id) === borrowRecordId);
          if (record && record.status === 'RETURNED') {
            setReturnedBookTitle(record.bookTitle || 'cuốn sách này');
            setShowReturnModal(true);
            setIsDropdownOpen(false);
            return;
          }
        } catch (apiErr) {
          console.error("Không thể kiểm tra trạng thái trả sách:", apiErr);
        }
      }

      setIsDropdownOpen(false);
      navigate('/borrow-records');
    } catch (err) {
      console.error("Không thể xử lý click thông báo:", err);
      setIsDropdownOpen(false);
      navigate('/borrow-records');
    }
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
                        onClick={() => handleNotificationClick(item)}
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

      {showReturnModal && (
        <Modal 
          title="Thông báo hệ thống" 
          isOpen={showReturnModal} 
          onClose={() => setShowReturnModal(false)}
        >
          <div className="header__returned-modal">
            <div className="header__returned-modal-icon">
              <span style={{ fontSize: '32px', fontWeight: 'bold' }}>✓</span>
            </div>
            <h3 className="header__returned-modal-title">Đã trả sách thành công</h3>
            <div className="header__returned-modal-divider" />
            <p className="header__returned-modal-msg">
              Bạn đã hoàn tất việc trả cuốn sách <strong>"{returnedBookTitle}"</strong> cho thư viện. Trạng thái phiếu mượn hiện tại là đã trả sách.
            </p>
            <div className="header__returned-modal-actions">
              <Button variant="primary" onClick={() => setShowReturnModal(false)}>
                Đồng ý
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </header>
  );
}

export default Header;
