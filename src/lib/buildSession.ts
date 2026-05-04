// Builds the canonical ExportSession object from current state.

import { QUESTIONS, SCHEMA_VERSION } from '../config/questionnaire';
import type { Answer, ExportSession, SessionState } from '../types';

export function buildSession(state: SessionState, completedAt: Date): ExportSession {
  const answers: Answer[] = QUESTIONS.map((q) => ({
    id: q.id,
    type: q.type,
    question: q.question,
    answer: state.answers[q.id] ?? null,
  }));

  return {
    schemaVersion: SCHEMA_VERSION,
    participantId: state.participantId,
    scenario: state.scenario,
    startedAt: state.startedAt,
    completedAt: completedAt.toISOString(),
    deviceInfo: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    answers,
  };
}

// Renders an answer value into a single string for flat exports (CSV row,
// XLSX cell, XML body, TXT body). Multi-value answers are joined with `|`
// per spec.
export function answerToCellString(value: Answer['answer']): string {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.join('|');
  return String(value);
}
