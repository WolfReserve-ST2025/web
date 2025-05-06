import { useEffect } from 'react';

const SuccessMessage = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-white text-black border border-green-500 p-4 rounded shadow-md">
      <p>{message}</p>
    </div>
  );
};

export default SuccessMessage;

