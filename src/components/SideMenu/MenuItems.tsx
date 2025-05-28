import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faUtensils, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { getUserFromToken } from '../../features/auth/useCurrentUser';

const menuItems = [
  {
    to: 'rooms',
    icon: faDoorOpen,
    label: 'Rooms',
    match: '/dashboard/rooms',
    roles: ['Hotel', 'User'],
  },
  {
    to: 'reservations',
    icon: faClipboardList,
    label: 'Reservations',
    match: '/dashboard/reservations',
    roles: ['Hotel', 'User'],
  },
  {
    to: 'food',
    icon: faUtensils,
    label: 'Food',
    match: '/dashboard/food',
    roles: ['Chef', 'User'],
  },
  {
    to: 'orders',
    icon: faClipboardList,
    label: 'Orders',
    match: '/dashboard/orders',
    roles: ['Chef', 'User'],
  },
];

const MenuItems = () => {
  const location = useLocation();
  const user = getUserFromToken();
  const role = user?.role;

  const isActive = (match: string) => location.pathname.startsWith(match);

  const visibleItems = menuItems.filter(item => !role || item.roles.includes(role));

  return (
    <ul className="space-y-4">
      {visibleItems.map((item) => (
        <li key={item.to}>
          <Link
            to={item.to}
            className={`flex items-center py-2 px-4 rounded transition ${
              isActive(item.match)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-blue-500'
            }`}
          >
            <FontAwesomeIcon icon={item.icon} className="mr-2" />
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuItems;