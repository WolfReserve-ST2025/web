import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCurrentUser } from '../../features/auth/useCurrentUser';

const Header = () => {
  const { user, loading } = useCurrentUser();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-gray-900 text-white p-4 flex items-center justify-between h-16">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="text-2xl font-bold">
          WolfReserve
        </Link>


      </div>

      <div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'
                }`}
            />
            {!isOnline && (
              <span className="text-red-400 text-sm font-medium">
                Offline
              </span>
            )}
          </div>

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
        </div>
      </div>
    </header>
  );
};

export default Header;