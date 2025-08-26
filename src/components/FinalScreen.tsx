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
  children: ReactNode;
};

function FinalScreen({ children }: FinalScreenProps): ReactElement {
  const { width, height } = useWindowSize();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 text-white">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        className="pointer-events-none"
      />
      {children}
    </div>
  );
}

export default FinalScreen;
