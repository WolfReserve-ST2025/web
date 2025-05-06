import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthProvider';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import WelcomePage from '../pages/WelcomePage';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import DashboardLayout from '../Layouts/DashboardLayout';
import Rooms from '../features/rooms/Rooms';
import Orders from '../features/orders/Orders';
import Foods from '../features/food/Foods';

const AppRouter = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="rooms" element={<Rooms />} />
        <Route path="orders" element={<Orders />} />
        <Route path="food" element={<Foods />} />
      </Route>

    </Routes>
  </AuthProvider>
);

export default AppRouter;
