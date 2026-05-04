import { useApp } from '../store';
import { QUESTIONS } from '../config/questionnaire';
import { SCENARIOS } from '../config/scenarios';
import { formatAnswer, isAnswerValid } from '../lib/answers';

export function Review() {
  const session = useApp((s) => s.session);
  const setIndex = useApp((s) => s.setIndex);
  const goTo = useApp((s) => s.goTo);

  if (!session) return null;

  const allValid = QUESTIONS.every((q) => isAnswerValid(q, session.answers[q.id]));
  const scenarioLabel =
    SCENARIOS.find((s) => s.id === session.scenario)?.label ?? session.scenario;

  return (
    <div className="space-y-5">
      <div className="card">
        <h2 className="mb-2 text-base font-semibold text-slate-100">Review answers</h2>
        <dl className="grid grid-cols-3 gap-1 text-sm">
          <dt className="col-span-1 text-slate-400">Participant</dt>
          <dd className="col-span-2 text-right font-medium text-slate-100">
            {session.participantId}
          </dd>
          <dt className="col-span-1 text-slate-400">Scenario</dt>
          <dd className="col-span-2 text-right font-medium text-slate-100">
            {scenarioLabel}
          </dd>
        </dl>
      </div>

      <ol className="space-y-3">
        {QUESTIONS.map((q, idx) => {
          const value = session.answers[q.id];
          const valid = isAnswerValid(q, value);
          return (
            <li
              key={q.id}
              className="rounded-xl bg-slate-800/70 p-4 ring-1 ring-slate-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wide text-brand-300">
                    Q{idx + 1}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-100">
                    {q.question}
                  </p>
                  <p
                    className={`mt-2 whitespace-pre-line text-sm ${
                      valid ? 'text-slate-200' : 'text-amber-300'
                    }`}
                  >
                    {valid ? formatAnswer(q, value) : 'Not answered'}
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 text-sm text-brand-300 underline-offset-2 hover:underline"
                  onClick={() => {
                    setIndex(idx);
                    goTo('questionnaire');
                  }}
                  aria-label={`Edit question ${idx + 1}`}
                >
                  Edit
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      {!allValid && (
        <p className="rounded-lg bg-amber-900/40 p-3 text-sm text-amber-200" role="alert">
          Some questions are not yet answered. Use “Edit” to complete them before
          submitting.
        </p>
      )}

      <div className="flex justify-between gap-3">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            setIndex(QUESTIONS.length - 1);
            goTo('questionnaire');
          }}
        >
          Back
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={!allValid}
          onClick={() => goTo('export')}
        >
          Submit and export
        </button>
      </div>
    </div>
  );
}
