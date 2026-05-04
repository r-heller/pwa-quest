import type { Stars10Question } from '../../types';

interface Props {
  question: Stars10Question;
  value: number | null;
  onChange: (value: number) => void;
}

export function Stars10({ question, value, onChange }: Props) {
  const stars = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <div role="radiogroup" aria-label={question.question}>
      <div className="grid grid-cols-10 gap-1">
        {stars.map((n) => {
          const filled = value !== null && n <= value;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} out of 10`}
              onClick={() => onChange(n)}
              className={`flex h-11 items-center justify-center rounded-md text-xl ring-1 transition-colors ${
                filled
                  ? 'bg-amber-400 text-slate-900 ring-amber-300'
                  : 'bg-slate-700 text-slate-400 ring-slate-600 hover:bg-slate-600'
              }`}
            >
              <span aria-hidden="true">★</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-sm text-slate-300">
        {value !== null ? <>Selected: <strong>{value}</strong> / 10</> : 'Tap a star to rate.'}
      </p>
    </div>
  );
}
