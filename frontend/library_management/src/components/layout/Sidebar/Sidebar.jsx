import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Books', to: '/books' },
  { label: 'Authors', to: '/authors' },
  { label: 'Categories', to: '/categories' },
  { label: 'Users', to: '/users' },
  { label: 'Borrow Records', to: '/borrow-records' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>Library</h1>
      <nav>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
