import type { SingleSelectQuestion } from '../../types';

interface Props {
  question: SingleSelectQuestion;
  value: string;
  onChange: (value: string) => void;
}

export function SingleSelect({ question, value, onChange }: Props) {
  return (
    <div role="radiogroup" aria-label={question.question} className="space-y-2">
      {question.options.map((opt) => {
        const selected = value === opt;
        return (
          <label
            key={opt}
            className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg p-3 ring-1 transition-colors ${
              selected
                ? 'bg-brand-500/20 ring-brand-400'
                : 'bg-slate-700/60 ring-slate-600 hover:bg-slate-700'
            }`}
          >
            <input
              type="radio"
              name={`single-${question.id}`}
              value={opt}
              checked={selected}
              onChange={() => onChange(opt)}
              className="h-5 w-5 accent-brand-500"
            />
            <span className="text-base text-slate-100">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}
