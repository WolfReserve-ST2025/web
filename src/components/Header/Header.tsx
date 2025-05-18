import { Link } from 'react-router-dom';
import { useCurrentUser } from '../../features/auth/useCurrentUser';

const Header = () => {
  const { user, loading } = useCurrentUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-gray-900 text-white p-4 flex items-center justify-between h-16">
      <Link to="/dashboard" className="text-2xl font-bold">
        WolfReserve
      </Link>
      <div>
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            Welcome,{' '}
            <Link
              to="/dashboard/profile"
              className="hover:underline cursor-pointer"
              title="View profile"
            >
              {user.name}
            </Link>
          </>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
    </header>
  );
};

export default Header;