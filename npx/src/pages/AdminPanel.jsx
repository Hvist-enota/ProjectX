import AdminSidebar from '../components/admin/AdminSidebar'; // Бічне меню
import { Outlet } from 'react-router-dom';

export default function AdminPanel() {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-3">
        <Outlet />
      </div>
    </div>
  );
}