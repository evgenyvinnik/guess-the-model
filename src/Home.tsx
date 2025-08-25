import { Link } from 'react-router-dom';
import logo from './assets/logo.png';

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-white">
      <div className="logo-animation mb-4 w-96">
        <img src={logo} alt="Logo" className="w-full" />
      </div>
      <div className="flex gap-4">
        <Link to="/classic" className="millionaire-button">
          Classic
        </Link>
        <Link to="/quiz" className="millionaire-button">
          Quiz
        </Link>
      </div>
    </div>
  );
}

export default Home;
