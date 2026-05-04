// Filename-safe helpers and a YYYYMMDD-HHmm formatter for export filenames.

export function sanitizeForFilename(input: string): string {
  // Replace anything outside [a-zA-Z0-9_-] with '-', collapse runs, trim.
  const cleaned = input
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned || 'untitled';
}

export function formatTimestamp(date: Date): string {
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${y}${m}${d}-${hh}${mm}`;
}

export function buildFilename(
  participantId: string,
  scenario: string,
  ext: string,
  date: Date = new Date(),
): string {
  const p = sanitizeForFilename(participantId);
  const s = sanitizeForFilename(scenario);
  const ts = formatTimestamp(date);
  return `questionnaire_${p}_${s}_${ts}.${ext}`;
}
