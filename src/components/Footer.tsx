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
    <footer className="bg-[#0b1444] text-white">
      <ul className="millionaire-menu menu flex w-full justify-center gap-4 p-2">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/stats">Stats</Link>
        </li>
        <li>
          <button type="button" onClick={toggleMusic} className="px-4 py-2 text-sm">
            Music: {musicOn ? 'On' : 'Off'}
          </button>
        </li>
        <li>
          <button type="button" onClick={toggleSfx} className="px-4 py-2 text-sm">
            SFX: {sfxOn ? 'On' : 'Off'}
          </button>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
