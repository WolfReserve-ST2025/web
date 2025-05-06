import { useState } from 'react';
import { login } from './AuthService';
import { useNavigate, Link } from 'react-router-dom';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import InputField from '../../components/Inputs/InputField';
import ErrorMessage from '../../components/Messages/ErrorMessage';
import SuccessMessage from '../../components/Messages/SuccessMessage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      setSuccess('Login successful!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <h2 className="text-2xl font-bold">Login</h2>
        <InputField type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <InputField type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <PrimaryButton type="submit" width="full">Login</PrimaryButton>
        <p className="text-sm text-center">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
