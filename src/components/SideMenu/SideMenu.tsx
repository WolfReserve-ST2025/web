import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../features/auth/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faUtensils, faClipboardList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const SideMenu = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    authContext?.setAccessToken(null);
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6">Menu</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="rooms"
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
            >
              <FontAwesomeIcon icon={faDoorOpen} className="mr-2" />
              Rooms
            </Link>
          </li>
          <li>
            <Link
              to="food"
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
            >
              <FontAwesomeIcon icon={faUtensils} className="mr-2" />
              Food
            </Link>
          </li>
          <li>
            <Link
              to="orders"
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
            >
              <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
              Orders
            </Link>
          </li>
        </ul>
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
    </aside>
  );
};

export default SideMenu;
