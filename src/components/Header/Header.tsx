import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../api/axios';

const Header = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/users/me');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
      <Link to="/dashboard" className="text-2xl font-bold">
        WolfReserve
      </Link>
      <div>
        {user ? <span>Welcome, {user.name}</span> : <span>Loading...</span>}
      </div>
    </header>
  );
};

export default Header;