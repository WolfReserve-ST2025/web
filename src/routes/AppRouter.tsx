import { Routes, Route } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import WelcomePage from '../pages/WelcomePage';
import DashboardLayout from '../pages/DashboardPage';
import Rooms from '../features/rooms/Rooms';
import Orders from '../features/orders/Orders';
import Foods from '../features/food/Foods';
import Reservations from '../features/reservations/Rerservations';

const AppRouter = () => (
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
      <Route path="reservations" element={<Reservations />} />
      <Route path="orders" element={<Orders />} />
      <Route path="food" element={<Foods />} />
    </Route>
  </Routes>
);

export default AppRouter;
