import { Link, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../features/auth/AuthProvider';

const DashboardLayout = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    authContext?.setAccessToken(null);
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul className="space-y-2">
          <li><Link to="rooms" className="block hover:underline">Rooms</Link></li>
          <li><Link to="food" className="block hover:underline">Food</Link></li>
          <li><Link to="orders" className="block hover:underline">Orders</Link></li>
          <li>
            <button onClick={handleLogout} className="block hover:underline text-left w-full">
              Logout
            </button>
          </li>
        </ul>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
