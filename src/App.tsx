import AppRouter from './routes/AppRouter';

function App() {



  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto">
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
