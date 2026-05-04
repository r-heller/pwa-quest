import type { SliderQuestion } from '../../types';

interface Props {
  question: SliderQuestion;
  value: number;
  onChange: (value: number) => void;
}

export function Slider({ question, value, onChange }: Props) {
  const step = question.step ?? 1;
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-sm text-slate-400">
          {question.min}
          {question.unit ? ` ${question.unit}` : ''}
        </span>
        <span className="text-3xl font-bold tabular-nums text-slate-50">
          {value}
          {question.unit ? <span className="ml-1 text-base text-slate-400">{question.unit}</span> : null}
        </span>
        <span className="text-sm text-slate-400">
          {question.max}
          {question.unit ? ` ${question.unit}` : ''}
        </span>
      </div>
      <input
        type="range"
        min={question.min}
        max={question.max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={question.question}
        aria-valuemin={question.min}
        aria-valuemax={question.max}
        aria-valuenow={value}
        className="h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-brand-500"
      />
    </div>
  );
}
