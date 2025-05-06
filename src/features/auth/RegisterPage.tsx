import { useState } from 'react';
import { register } from './AuthService';
import { useNavigate, Link } from 'react-router-dom';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import InputField from '../../components/Inputs/InputField';
import ErrorMessage from '../../components/Messages/ErrorMessage';
import SuccessMessage from '../../components/Messages/SuccessMessage';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Uporabnik');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await register({ email, password, role });
      localStorage.setItem('token', res.data.token);
      setSuccess('Registration successful!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <h2 className="text-2xl font-bold">Register</h2>
        <InputField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <InputField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <InputField
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <select
          className="w-full border p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="Uporabnik">User</option>
          <option value="Hotel">Hotel</option>
          <option value="Kuhar">Chef</option>
        </select>
        <PrimaryButton type="submit" color="green" width="full">
          Register
        </PrimaryButton>
        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
