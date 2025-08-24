/* eslint-disable react/require-default-props */
import svgbutton from './assets/svgbutton.svg'; // <- tight-fit SVG file

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
  title,
}: SvgButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label || title || 'button'}
      title={title || label}
      className={`relative inline-flex items-center justify-center select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-2xl ${className}`}
      style={{
        background: 'transparent',
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
