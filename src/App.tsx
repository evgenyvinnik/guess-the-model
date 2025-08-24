import { Link, Route, Routes } from 'react-router-dom';
import Home from './Home.tsx';
import StatsPage from './StatsPage.tsx';

function App() {
  return (
    <div className="min-h-screen bg-[#242424] text-white">
      <nav className="p-4">
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/stats">Stats</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </div>
  );
}

export default App;
