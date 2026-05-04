// EXAMPLE QUESTIONNAIRE
// =====================
// This is a sample 10-question instrument on the theme of
// "subjective experience after a guided task" — replace freely.
//
// To customize: edit the QUESTIONS array. Question IDs (q1..q10) are stable
// keys used in exports, so changing them invalidates any in-progress sessions
// stored locally on devices. Bump SCHEMA_VERSION below if you change the
// shape of an answer in a way external consumers care about.

import type { Question } from '../types';

export const SCHEMA_VERSION = 1 as const;

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'likert5',
    question: 'Overall, the task was easy to complete.',
    lowLabel: 'Strongly disagree',
    highLabel: 'Strongly agree',
  },
  {
    id: 'q2',
    type: 'stars10',
    question: 'How would you rate the experience overall? (1 = poor, 10 = excellent)',
  },
  {
    id: 'q3',
    type: 'singleSelect',
    question: 'Which part of the task felt most demanding?',
    options: [
      'Understanding the instructions',
      'Performing the steps',
      'Tracking my progress',
      'Recovering from a mistake',
      'Nothing felt particularly demanding',
    ],
  },
  {
    id: 'q4',
    type: 'multiSelect',
    question: 'Which of the following did you experience during the task? (select all that apply)',
    options: [
      'Felt confident',
      'Felt confused',
      'Felt rushed',
      'Felt distracted',
      'Felt focused',
      'Felt frustrated',
    ],
    min: 0,
    max: 6,
  },
  {
    id: 'q5',
    type: 'slider',
    question: 'How mentally demanding was the task?',
    description: '0 = not at all demanding, 100 = extremely demanding',
    min: 0,
    max: 100,
    step: 1,
  },
  {
    id: 'q6',
    type: 'yesNoUnsure',
    question: 'Would you be willing to perform this task again under similar conditions?',
  },
  {
    id: 'q7',
    type: 'shortText',
    question: 'In one phrase, how would you describe the task?',
    maxLength: 80,
    placeholder: 'e.g. "straightforward but tiring"',
  },
  {
    id: 'q8',
    type: 'longText',
    question: 'Anything else you would like the researchers to know? (optional)',
    optional: true,
    maxLength: 100,
    placeholder: 'Optional comments…',
  },
  {
    id: 'q9',
    type: 'numeric',
    question: 'What is your age?',
    min: 18,
    max: 120,
    unit: 'years',
  },
  {
    id: 'q10',
    type: 'ranking',
    question: 'Rank the following aspects of the task from most to least important to you.',
    items: ['Speed', 'Accuracy', 'Comfort', 'Clarity of instructions', 'Sense of control'],
  },
];

if (QUESTIONS.length !== 10) {
  // This is a build-time invariant — keep the demo at exactly 10 questions
  // so the UI copy ("Question N of 10") stays in sync with the config.
  throw new Error(`questionnaire.ts: expected 10 questions, got ${QUESTIONS.length}`);
}
