import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import ProfileCard from './ProfileCard';
import AllUsersTable from './AllUsersTable';
import EditProfileForm from './EditProfileForm';
import ChangePasswordForm from './ChangePasswordForm';
import { useCurrentUser, User } from '../auth/useCurrentUser';

const Profile = () => {
  const { user, authError, setUser } = useCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (user?.role === 'Hotel') {
      setLoadingUsers(true);
      axios.get('/users')
        .then(res => setUsers(res.data))
        .finally(() => setLoadingUsers(false));
    }
  }, [user]);

  if (authError) {
    return (
      <div className="flex justify-center items-center h-full text-red-600 text-lg">
        Unauthorized. Please log in again.
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-8 p-8">
      <div className="flex flex-col w-full max-w-md">
        <ProfileCard user={user} />
        <EditProfileForm user={user} onUserUpdate={data => setUser && setUser({ ...user!, ...data })} />
        <ChangePasswordForm />
      </div>
      {user?.role === 'Hotel' && (
        <AllUsersTable users={users} loading={loadingUsers} />
      )}
    </div>
  );
};

export default Profile;
