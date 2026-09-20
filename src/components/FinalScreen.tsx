import {
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import Confetti from 'react-confetti';

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
}

type FinalScreenProps = {
  celebrate?: boolean;
  children: ReactNode;
};

function FinalScreen({ celebrate = true, children }: FinalScreenProps): ReactElement {
  const { width, height } = useWindowSize();

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-6 p-6 text-white">
      {celebrate && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          className="pointer-events-none"
          // Pinned to the viewport so the canvas never adds scrollbars.
          style={{ position: 'fixed', inset: 0, zIndex: 1 }}
        />
      )}
      <div className="mil-enter mil-panel z-10 flex w-full max-w-xl flex-col items-center gap-5 rounded-2xl p-8 text-center">
        {children}
      </div>
    </div>
  );
}

export default FinalScreen;
