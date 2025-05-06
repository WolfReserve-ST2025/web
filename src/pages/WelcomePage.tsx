import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to WolfReserve</h1>
      <button onClick={() => navigate('/dashboard')} className="bg-stone-700 px-6 py-2 text-white rounded hover:bg-stone-600 transition">
        Enter
      </button>
    </div>
  );
};

export default WelcomePage;
