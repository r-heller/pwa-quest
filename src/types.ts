// Shared types for questions, answers, and exported sessions.

export type QuestionType =
  | 'likert5'
  | 'stars10'
  | 'singleSelect'
  | 'multiSelect'
  | 'slider'
  | 'yesNoUnsure'
  | 'shortText'
  | 'longText'
  | 'numeric'
  | 'ranking';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  description?: string;
  optional?: boolean;
}

export interface Likert5Question extends BaseQuestion {
  type: 'likert5';
  lowLabel: string;
  highLabel: string;
}

export interface Stars10Question extends BaseQuestion {
  type: 'stars10';
}

export interface SingleSelectQuestion extends BaseQuestion {
  type: 'singleSelect';
  options: string[];
}

export interface MultiSelectQuestion extends BaseQuestion {
  type: 'multiSelect';
  options: string[];
  min?: number;
  max?: number;
}

export interface SliderQuestion extends BaseQuestion {
  type: 'slider';
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export interface YesNoUnsureQuestion extends BaseQuestion {
  type: 'yesNoUnsure';
}

export interface ShortTextQuestion extends BaseQuestion {
  type: 'shortText';
  maxLength?: number;
  placeholder?: string;
}

export interface LongTextQuestion extends BaseQuestion {
  type: 'longText';
  maxLength?: number;
  placeholder?: string;
}

export interface NumericQuestion extends BaseQuestion {
  type: 'numeric';
  min?: number;
  max?: number;
  unit?: string;
}

export interface RankingQuestion extends BaseQuestion {
  type: 'ranking';
  items: string[];
}

export type Question =
  | Likert5Question
  | Stars10Question
  | SingleSelectQuestion
  | MultiSelectQuestion
  | SliderQuestion
  | YesNoUnsureQuestion
  | ShortTextQuestion
  | LongTextQuestion
  | NumericQuestion
  | RankingQuestion;

// Per-question answer value shapes.
export type AnswerValue =
  | number
  | string
  | string[]
  | 'yes'
  | 'no'
  | 'unsure'
  | null;

export interface Answer {
  id: string;
  type: QuestionType;
  question: string;
  answer: AnswerValue;
}

export interface SessionMeta {
  participantId: string;
  scenario: string;
  startedAt: string;
}

export interface SessionState extends SessionMeta {
  answers: Record<string, AnswerValue>;
  // Index of the question being viewed (0-based). Persisted so resume lands
  // the participant where they left off.
  currentIndex: number;
}

export interface DeviceInfo {
  userAgent: string;
  language: string;
  timezone: string;
}

export interface ExportSession {
  schemaVersion: 1;
  participantId: string;
  scenario: string;
  startedAt: string;
  completedAt: string;
  deviceInfo: DeviceInfo;
  answers: Answer[];
}
