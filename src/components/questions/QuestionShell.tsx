import type { ReactNode } from 'react';

interface QuestionShellProps {
  questionNumber: number;
  question: string;
  description?: string;
  optional?: boolean;
  children: ReactNode;
}

export function QuestionShell({
  questionNumber,
  question,
  description,
  optional,
  children,
}: QuestionShellProps) {
  return (
    <section className="card space-y-4" aria-labelledby={`q-${questionNumber}-label`}>
      <div>
        <p className="text-xs uppercase tracking-wide text-brand-300">
          Question {questionNumber}
          {optional && <span className="ml-2 text-slate-400">(optional)</span>}
        </p>
        <h2
          id={`q-${questionNumber}-label`}
          className="mt-1 text-lg font-semibold leading-snug text-slate-50"
        >
          {question}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}
