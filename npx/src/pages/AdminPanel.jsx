import AdminSidebar from '../components/admin/AdminSidebar';
import { Outlet } from 'react-router-dom';
import '../styles/admin.css';

export default function AdminPanel() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}