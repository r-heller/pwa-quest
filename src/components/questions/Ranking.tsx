// Up/down arrow ranking. Drag-and-drop on touch devices is fiddly enough that
// keyboard-friendly arrows are a better default for a research-grade form.

import type { RankingQuestion } from '../../types';

interface Props {
  question: RankingQuestion;
  value: string[];
  onChange: (value: string[]) => void;
}

function move(arr: string[], from: number, to: number): string[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function Ranking({ question, value, onChange }: Props) {
  return (
    <ol
      className="space-y-2"
      aria-label={question.question}
    >
      {value.map((item, idx) => (
        <li
          key={item}
          className="flex items-center gap-3 rounded-lg bg-slate-700/60 p-2 ring-1 ring-slate-600"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-md bg-slate-900 text-sm font-semibold text-brand-300"
          >
            {idx + 1}
          </span>
          <span className="flex-1 text-base text-slate-100">{item}</span>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              aria-label={`Move "${item}" up`}
              disabled={idx === 0}
              onClick={() => onChange(move(value, idx, idx - 1))}
              className="grid h-7 w-9 place-items-center rounded-md bg-slate-800 text-slate-200 ring-1 ring-slate-600 disabled:opacity-40"
            >
              <span aria-hidden="true">▲</span>
            </button>
            <button
              type="button"
              aria-label={`Move "${item}" down`}
              disabled={idx === value.length - 1}
              onClick={() => onChange(move(value, idx, idx + 1))}
              className="grid h-7 w-9 place-items-center rounded-md bg-slate-800 text-slate-200 ring-1 ring-slate-600 disabled:opacity-40"
            >
              <span aria-hidden="true">▼</span>
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
}
