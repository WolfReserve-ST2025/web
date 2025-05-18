import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
