import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header/Header';
import Sidebar from '../components/layout/Sidebar/Sidebar';
import './AdminLayout.css';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout__main">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
