interface ProgressProps {
  current: number; // 1-based
  total: number;
}

export function Progress({ current, total }: ProgressProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-6">
      <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
        <span>
          Question {current} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-700"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
      >
        <div
          className="h-full bg-brand-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
