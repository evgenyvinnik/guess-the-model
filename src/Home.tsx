import { Link } from 'react-router-dom';
import logo from './assets/logo.png';

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-white">
      <img src={logo} alt="Logo" className="mb-4 w-32" />
      <h1 className="mb-4 text-2xl">Choose a mode</h1>
      <Link to="/classic" className="millionaire-button">
        Classic
      </Link>
      <Link to="/quiz" className="millionaire-button">
        Quiz
      </Link>
    </div>
  );
}

export default Home;
