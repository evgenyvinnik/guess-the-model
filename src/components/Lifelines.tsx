import type { ReactElement } from 'react';
import { Lifeline, type LifelineUsage } from '../lifelines.ts';

type LifelinesProps = {
  used: LifelineUsage;
  disabled: boolean;
  onUse: (lifeline: Lifeline) => void;
};

function PhoneIcon(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.25 1z" />
    </svg>
  );
}

function AudienceIcon(): ReactElement {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M12 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm-6.5 1a2.5 2.5 0 1 0-2.5-2.5A2.5 2.5 0 0 0 5.5 13zm13 0a2.5 2.5 0 1 0-2.5-2.5 2.5 2.5 0 0 0 2.5 2.5zM12 14c-2.7 0-5 1.4-5 3.2V20h10v-2.8c0-1.8-2.3-3.2-5-3.2zM5.5 14.5c-2.2 0-4 1.1-4 2.6V20h4v-2.8a3.7 3.7 0 0 1 1.1-2.5 7.7 7.7 0 0 0-1.1-.2zm13 0a7.7 7.7 0 0 0-1.1.2 3.7 3.7 0 0 1 1.1 2.5V20h4v-2.9c0-1.5-1.8-2.6-4-2.6z" />
    </svg>
  );
}

const LIFELINES: { id: Lifeline; label: string; content: ReactElement }[] = [
  {
    id: Lifeline.FiftyFifty,
    label: 'Fifty fifty: remove two wrong answers',
    content: <span className="text-base font-bold tracking-tight">50:50</span>,
  },
  {
    id: Lifeline.PhoneAFriend,
    label: 'Phone a friend',
    content: <PhoneIcon />,
  },
  {
    id: Lifeline.AskTheAudience,
    label: 'Ask the audience',
    content: <AudienceIcon />,
  },
];

function Lifelines({ used, disabled, onUse }: LifelinesProps): ReactElement {
  return (
    <div className="flex items-center gap-3">
      {LIFELINES.map(({ id, label, content }) => (
        <button
          key={id}
          type="button"
          title={label}
          aria-label={label}
          data-testid={`lifeline-${id}`}
          disabled={disabled || used[id]}
          onClick={() => onUse(id)}
          className={`mil-lifeline ${used[id] ? 'mil-lifeline-used' : ''}`}
        >
          <span>{content}</span>
        </button>
      ))}
    </div>
  );
}

export default Lifelines;
