import type { MultiSelectQuestion } from '../../types';

interface Props {
  question: MultiSelectQuestion;
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelect({ question, value, onChange }: Props) {
  const toggle = (opt: string) => {
    const has = value.includes(opt);
    onChange(has ? value.filter((v) => v !== opt) : [...value, opt]);
  };

  const min = question.min ?? 1;
  const max = question.max ?? question.options.length;
  const constraint =
    min === max
      ? `Select exactly ${min}.`
      : `Select between ${min} and ${max}.`;

  return (
    <div role="group" aria-label={question.question} className="space-y-2">
      <p className="text-sm text-slate-400">{constraint}</p>
      {question.options.map((opt) => {
        const selected = value.includes(opt);
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
              type="checkbox"
              checked={selected}
              onChange={() => toggle(opt)}
              className="h-5 w-5 accent-brand-500"
            />
            <span className="text-base text-slate-100">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}
