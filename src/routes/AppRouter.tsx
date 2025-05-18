import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import WelcomePage from '../pages/WelcomePage';
import DashboardPage from '../pages/DashboardPage';
import Rooms from '../features/rooms/Rooms';
import Orders from '../features/orders/Orders';
import Foods from '../features/food/Foods';
import Profile from '../features/profile/Profile';
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
          <DashboardPage />
        </PrivateRoute>
      }
    >
      <Route index element={<Navigate to="rooms" />} />
      <Route path="rooms" element={<Rooms />} />
      <Route path="reservations" element={<Reservations />} />
      <Route path="orders" element={<Orders />} />
      <Route path="food" element={<Foods />} />
      <Route path="profile" element={<Profile />} />
    </Route>
  </Routes>
);

export default AppRouter;
