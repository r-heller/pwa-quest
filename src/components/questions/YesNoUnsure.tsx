import type { YesNoUnsureQuestion } from '../../types';

interface Props {
  question: YesNoUnsureQuestion;
  value: 'yes' | 'no' | 'unsure' | '';
  onChange: (value: 'yes' | 'no' | 'unsure') => void;
}

const OPTIONS: { id: 'yes' | 'no' | 'unsure'; label: string }[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
  { id: 'unsure', label: 'Not sure' },
];

export function YesNoUnsure({ question, value, onChange }: Props) {
  return (
    <div role="radiogroup" aria-label={question.question} className="grid grid-cols-3 gap-2">
      {OPTIONS.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.id)}
            className={`min-h-[56px] rounded-lg text-base font-semibold ring-1 transition-colors ${
              selected
                ? 'bg-brand-500 text-white ring-brand-400'
                : 'bg-slate-700 text-slate-100 ring-slate-600 hover:bg-slate-600'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
