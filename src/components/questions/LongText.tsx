import type { LongTextQuestion } from '../../types';

interface Props {
  question: LongTextQuestion;
  value: string;
  onChange: (value: string) => void;
}

export function LongText({ question, value, onChange }: Props) {
  const maxLength = question.maxLength ?? 100;
  return (
    <div>
      <textarea
        className="field-input min-h-[140px] resize-y"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={question.placeholder}
        aria-label={question.question}
        rows={5}
      />
      <p className="mt-1 text-right text-xs text-slate-500">
        {value.length} / {maxLength}
      </p>
    </div>
  );
}
