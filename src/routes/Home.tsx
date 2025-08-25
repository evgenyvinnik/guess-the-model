import { Link } from 'react-router-dom';
import { type ReactElement } from 'react';
import logo from '../assets/logo.png';

function Home(): ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center text-white">
      <div className="logo-animation mb-4 w-96">
        <img src={logo} alt="Logo" className="w-full" />
      </div>
      <div className="flex justify-center gap-4">
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
