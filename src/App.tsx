import { useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import { requestNotificationPermission } from './utils/notifications';

function App() {

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto">
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
