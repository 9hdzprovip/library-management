import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  Tags,
  Users,
  FileText
} from 'lucide-react';
import hustLogo from '../../../assets/images/logo-hust-vector-01.jpg';
import './Sidebar.css';

const navItemsByRole = {
  ADMIN: [
    { label: 'Dashboard', to: '/', icon: LayoutDashboard },
    { label: 'Quản lý sách', to: '/books', icon: BookOpen },
    { label: 'Quản lý tác giả', to: '/authors', icon: PenTool },
    { label: 'Quản lý danh mục', to: '/categories', icon: Tags },
    { label: 'Quản lý người dùng', to: '/users', icon: Users },
    { label: 'Quản lý mượn trả', to: '/borrow-records', icon: FileText },
  ],
  USER: [
    { label: 'Dashboard', to: '/', icon: LayoutDashboard },
    { label: 'Danh sách sách', to: '/books', icon: BookOpen },
    { label: 'Danh sách tác giả', to: '/authors', icon: PenTool },
    { label: 'Danh sách danh mục', to: '/categories', icon: Tags },
    { label: 'Lịch sử mượn sách', to: '/borrow-records', icon: FileText },
  ],
};

function Sidebar() {
  const role = (localStorage.getItem('role') || 'USER').toUpperCase();
  const navItems = navItemsByRole[role] || navItemsByRole.USER;

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">
          <img src={hustLogo} alt="HUST Logo" className="sidebar__logo-img" />
        </span>
        <div>
          <h1>Bách Khoa Hà Nội</h1>
          <p>Hệ thống thư viện</p>
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
            {item.icon && <item.icon className="sidebar__link-icon" size={18} />}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
