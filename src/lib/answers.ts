// Default answer values + validation for each question type.

import type { AnswerValue, Question } from '../types';

export function defaultAnswer(q: Question): AnswerValue {
  switch (q.type) {
    case 'likert5':
    case 'stars10':
    case 'numeric':
      return null; // numeric answers start blank so we can detect "unanswered"
    case 'singleSelect':
    case 'shortText':
    case 'longText':
    case 'yesNoUnsure':
      return '';
    case 'multiSelect':
      return [];
    case 'slider':
      // Start at the midpoint so the slider has a meaningful position.
      return Math.round((q.min + q.max) / 2);
    case 'ranking':
      return [...q.items];
  }
}

// True if the current answer satisfies the question's constraints. Used to
// gate "Next". Optional questions are always considered valid.
export function isAnswerValid(q: Question, value: AnswerValue): boolean {
  if (q.optional) return true;
  switch (q.type) {
    case 'likert5':
      return typeof value === 'number' && value >= 1 && value <= 5;
    case 'stars10':
      return typeof value === 'number' && value >= 1 && value <= 10;
    case 'singleSelect':
      return typeof value === 'string' && value.length > 0;
    case 'multiSelect': {
      if (!Array.isArray(value)) return false;
      const min = q.min ?? 1; // require at least one if not specified
      const max = q.max ?? q.options.length;
      return value.length >= min && value.length <= max;
    }
    case 'slider':
      return typeof value === 'number' && value >= q.min && value <= q.max;
    case 'yesNoUnsure':
      return value === 'yes' || value === 'no' || value === 'unsure';
    case 'shortText':
    case 'longText': {
      if (typeof value !== 'string') return false;
      const trimmed = value.trim();
      if (trimmed.length === 0) return false;
      if (q.maxLength && trimmed.length > q.maxLength) return false;
      return true;
    }
    case 'numeric': {
      if (typeof value !== 'number' || Number.isNaN(value)) return false;
      if (q.min !== undefined && value < q.min) return false;
      if (q.max !== undefined && value > q.max) return false;
      return true;
    }
    case 'ranking':
      return (
        Array.isArray(value) &&
        value.length === q.items.length &&
        q.items.every((it) => value.includes(it))
      );
  }
}

// Human-readable rendering of an answer for review and TXT export.
export function formatAnswer(q: Question, value: AnswerValue): string {
  if (value === null || value === undefined || value === '') return '—';
  switch (q.type) {
    case 'likert5':
      return `${value} / 5`;
    case 'stars10':
      return `${value} / 10`;
    case 'slider':
      return q.unit ? `${value} ${q.unit}` : String(value);
    case 'numeric':
      return q.unit ? `${value} ${q.unit}` : String(value);
    case 'multiSelect':
      return Array.isArray(value) && value.length > 0 ? value.join(', ') : '—';
    case 'ranking':
      return Array.isArray(value)
        ? value.map((item, i) => `${i + 1}. ${item}`).join('\n')
        : '—';
    case 'yesNoUnsure':
      return value === 'yes' ? 'Yes' : value === 'no' ? 'No' : 'Not sure';
    default:
      return String(value);
  }
}
