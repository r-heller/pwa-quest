// Global app state. A single Zustand store covers route, session metadata,
// and answers. Route is a tiny enum rather than a router to keep the bundle
// minimal — there are only four screens.

import { create } from 'zustand';
import type { AnswerValue, SessionState } from './types';
import { QUESTIONS } from './config/questionnaire';
import { defaultAnswer } from './lib/answers';
import { clearSession, loadSession, safeSave } from './lib/storage';

export type Route = 'setup' | 'questionnaire' | 'review' | 'export';

interface AppState {
  route: Route;
  session: SessionState | null;
  hydrated: boolean;
  storageError: string | null;

  hydrate: () => Promise<void>;
  startSession: (participantId: string, scenario: string) => Promise<void>;
  setAnswer: (questionId: string, value: AnswerValue) => void;
  setIndex: (idx: number) => void;
  goTo: (route: Route) => void;
  resetSession: () => Promise<void>;
}

function buildBlankSession(participantId: string, scenario: string): SessionState {
  const answers: Record<string, AnswerValue> = {};
  for (const q of QUESTIONS) answers[q.id] = defaultAnswer(q);
  return {
    participantId,
    scenario,
    startedAt: new Date().toISOString(),
    answers,
    currentIndex: 0,
  };
}

// Keep a single in-flight save promise so we don't pile up concurrent writes
// when the participant types quickly.
let pendingSave: Promise<void> | null = null;
function persist(session: SessionState, onError: (msg: string) => void) {
  const run = async () => {
    try {
      await safeSave(session);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to save session.');
    }
  };
  pendingSave = pendingSave ? pendingSave.then(run) : run();
}

export const useApp = create<AppState>((set, get) => ({
  route: 'setup',
  session: null,
  hydrated: false,
  storageError: null,

  async hydrate() {
    const stored = await loadSession();
    if (stored) {
      // Resume into the same screen they were on (questionnaire) so a
      // mid-session reload lands them where they left off.
      set({ session: stored, route: 'questionnaire', hydrated: true });
    } else {
      set({ hydrated: true });
    }
  },

  async startSession(participantId, scenario) {
    const session = buildBlankSession(participantId.trim(), scenario);
    set({ session, route: 'questionnaire', storageError: null });
    persist(session, (msg) => set({ storageError: msg }));
  },

  setAnswer(questionId, value) {
    const cur = get().session;
    if (!cur) return;
    const next: SessionState = {
      ...cur,
      answers: { ...cur.answers, [questionId]: value },
    };
    set({ session: next });
    persist(next, (msg) => set({ storageError: msg }));
  },

  setIndex(idx) {
    const cur = get().session;
    if (!cur) return;
    const next = { ...cur, currentIndex: idx };
    set({ session: next });
    persist(next, (msg) => set({ storageError: msg }));
  },

  goTo(route) {
    set({ route });
  },

  async resetSession() {
    await clearSession();
    set({ session: null, route: 'setup', storageError: null });
  },
}));
