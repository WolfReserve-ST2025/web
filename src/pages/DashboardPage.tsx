import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import SideMenu from '../components/SideMenu/SideMenu';
import { requestNotificationPermission } from '../utils/notifications';
import { useCurrentUser } from '../features/auth/useCurrentUser';

const SIDEBAR_WIDTH = '16rem';
const HEADER_HEIGHT = '4rem';

const DashboardPage = () => {
  const {user} = useCurrentUser();
  const userId = user?._id;  
  
  useEffect(() => {
    if(userId){
      requestNotificationPermission(userId);
    }
  }, [user]);  
  
  return (
    <div>
      <Header />
      <aside
        className="fixed left-0 bg-gray-800 text-white w-64 flex flex-col justify-between z-10"
        style={{ top: HEADER_HEIGHT, height: `calc(100vh - ${HEADER_HEIGHT})` }}
      >
        <SideMenu />
      </aside>
      <div
        className="bg-gray-50"
        style={{
          marginLeft: SIDEBAR_WIDTH,
          marginTop: HEADER_HEIGHT,
          height: `calc(100vh - ${HEADER_HEIGHT})`,
          overflowY: 'auto',
        }}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
