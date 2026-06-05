import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItemsByRole = {
  ADMIN: [
    { label: 'Dashboard', to: '/' },
    { label: 'Quản lý sách', to: '/books' },
    { label: 'Quản lý tác giả', to: '/authors' },
    { label: 'Quản lý danh mục', to: '/categories' },
    { label: 'Quản lý người dùng', to: '/users' },
    { label: 'Quản lý mượn trả', to: '/borrow-records' },
  ],
  USER: [
    { label: 'Dashboard', to: '/' },
    { label: 'Danh sách sách', to: '/books' },
  ],
};

function Sidebar() {
  const role = (localStorage.getItem('role') || 'USER').toUpperCase();
  const navItems = navItemsByRole[role] || navItemsByRole.USER;

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">LM</span>
        <div>
          <h1>Library</h1>
          <p>Admin dashboard</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            end={item.to === '/'}
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
