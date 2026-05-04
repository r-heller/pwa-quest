// Tiny IndexedDB wrapper for persisting the in-progress session.
//
// We deliberately avoid pulling in idb / dexie — there's a single key/value
// pair to persist, and the native API is small enough that the dependency
// isn't worth it.

import type { SessionState } from '../types';

const DB_NAME = 'pwa-quest';
const DB_VERSION = 1;
const STORE = 'kv';
const SESSION_KEY = 'session';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const store = tx.objectStore(STORE);
    const req = fn(store);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function loadSession(): Promise<SessionState | null> {
  try {
    const value = await withStore('readonly', (s) => s.get(SESSION_KEY));
    return (value as SessionState | undefined) ?? null;
  } catch {
    // IndexedDB can be unavailable in private mode on some browsers — degrade
    // gracefully so the app is still usable, just without resume.
    return null;
  }
}

export async function saveSession(session: SessionState): Promise<void> {
  await withStore('readwrite', (s) => s.put(session, SESSION_KEY));
}

export async function clearSession(): Promise<void> {
  try {
    await withStore('readwrite', (s) => s.delete(SESSION_KEY));
  } catch {
    /* swallow — clearing best-effort */
  }
}

export class StorageQuotaError extends Error {
  constructor() {
    super('Storage quota exceeded — please free up space and try again.');
    this.name = 'StorageQuotaError';
  }
}

// Small helper used by the store to surface friendlier error messages when
// the browser refuses a write because the quota is full.
export async function safeSave(session: SessionState): Promise<void> {
  try {
    await saveSession(session);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      throw new StorageQuotaError();
    }
    throw err;
  }
}
