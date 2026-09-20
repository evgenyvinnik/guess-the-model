import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';

interface FooterProps {
  musicOn: boolean;
  sfxOn: boolean;
  toggleMusic: () => void;
  toggleSfx: () => void;
}

function Footer({
  musicOn,
  sfxOn,
  toggleMusic,
  toggleSfx,
}: FooterProps): ReactElement {
  return (
    <footer className="border-t border-sky-400/40 bg-[#050b30]/90 text-white">
      <ul className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-1 p-2 text-sm">
        <li><Link to="/" className="hover:text-amber-300">Home</Link></li>
        <li><Link to="/stats" className="hover:text-amber-300">Stats</Link></li>
        <li><Link to="/about" className="hover:text-amber-300">About</Link></li>
        <li>
          <button type="button" onClick={toggleMusic} className="hover:text-amber-300">
            Music:
            {' '}
            {musicOn ? 'On' : 'Off'}
          </button>
        </li>
        <li>
          <button type="button" onClick={toggleSfx} className="hover:text-amber-300">
            SFX:
            {' '}
            {sfxOn ? 'On' : 'Off'}
          </button>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
