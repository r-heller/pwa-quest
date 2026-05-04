import type { Likert5Question } from '../../types';

interface Props {
  question: Likert5Question;
  value: number | null;
  onChange: (value: number) => void;
}

export function Likert5({ question, value, onChange }: Props) {
  const options = [1, 2, 3, 4, 5] as const;
  return (
    <div role="radiogroup" aria-label={question.question}>
      <div className="flex justify-between gap-2">
        {options.map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(n)}
              className={`flex h-14 flex-1 items-center justify-center rounded-lg text-lg font-semibold ring-1 transition-colors ${
                selected
                  ? 'bg-brand-500 text-white ring-brand-400'
                  : 'bg-slate-700 text-slate-100 ring-slate-600 hover:bg-slate-600'
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>{question.lowLabel}</span>
        <span>{question.highLabel}</span>
      </div>
    </div>
  );
}
