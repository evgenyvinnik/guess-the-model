/* eslint react/require-default-props: 0 */
import { useEffect, useState, type ReactElement } from 'react';
import svgbutton from '../assets/svgbutton.svg'; // <- tight-fit SVG file

type SvgButtonProps = {
  onClick?: () => void;
  label?: string;
  width?: number | string; // e.g. 400, '320px', '100%'
  className?: string;
  disabled?: boolean;
  title?: string; // tooltip / accessible name if no label
};

function SvgButton({
  onClick,
  label = 'Hello',
  width = 400,
  className = '',
  disabled = false,
  title = undefined,
}: SvgButtonProps): ReactElement {
  const [isSelected, setIsSelected] = useState(false);
  const [blinkColor, setBlinkColor] = useState<string | null>(null);
  const [currentColor, setCurrentColor] = useState<string>('transparent');

  const handleClick = (): void => {
    if (isSelected) return;
    setIsSelected(true);
    setCurrentColor('orange');
    setBlinkColor(Math.random() > 0.5 ? 'green' : 'red');
    onClick?.();
  };

  useEffect(() => {
    if (!isSelected || !blinkColor) return undefined;
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      setCurrentColor((prev) => (prev === 'orange' ? blinkColor : 'orange'));
    }, 500);
    return () => clearInterval(interval);
  }, [isSelected, blinkColor]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isSelected}
      aria-label={label || title || 'button'}
      title={title || label}
      className={`group relative inline-flex items-center justify-center select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-2xl hover:shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-shadow transition-colors ${className}`}
      style={{
        background: currentColor,
        border: 'none',
        padding: 0,
        width,
      }}
    >
      {/* The SVG image (tight viewBox) scales to the button width while preserving aspect ratio */}
      <img
        src={svgbutton}
        alt=""
        draggable={false}
        className="block w-full h-auto pointer-events-none transition-transform duration-200 group-hover:scale-105 active:scale-95"
      />

      {/* Optional centered label on top of the SVG */}
      {label && (
        <span className="absolute inset-0 grid place-items-center text-white font-semibold text-lg tracking-wide pointer-events-none">
          {label}
        </span>
      )}
    </button>
  );
}

export default SvgButton;
