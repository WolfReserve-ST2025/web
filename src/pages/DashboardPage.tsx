import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import SideMenu from '../components/SideMenu/SideMenu';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <SideMenu />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
