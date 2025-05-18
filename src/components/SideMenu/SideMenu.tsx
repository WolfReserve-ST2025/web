import { useContext } from 'react';
import { AuthContext } from '../../features/auth/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import MenuItems from './MenuItems';

const SideMenu = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    authContext?.setAccessToken(null);
    window.location.href = '/login';
  };

  return (
    <div className="w-64 h-full flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6">Menu</h2>
        <MenuItems />
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded transition"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
