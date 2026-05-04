import type { ShortTextQuestion } from '../../types';

interface Props {
  question: ShortTextQuestion;
  value: string;
  onChange: (value: string) => void;
}

export function ShortText({ question, value, onChange }: Props) {
  const maxLength = question.maxLength ?? 200;
  return (
    <div>
      <input
        type="text"
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={question.placeholder}
        aria-label={question.question}
        autoComplete="off"
      />
      <p className="mt-1 text-right text-xs text-slate-500">
        {value.length} / {maxLength}
      </p>
    </div>
  );
}
