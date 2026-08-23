import {
  createContext,
  createElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPerceptionSession } from '@workspace/api-client-react';
import { clearExpandedBattles } from './expandedQueue';

const SESSION_KEY = 'signal_market_session';

type StoredSession = {
  sessionToken: string;
  expiresAt: string;
};

let pendingSessionCreation: Promise<StoredSession> | null = null;

function storage() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isUsableSession(value: unknown): value is StoredSession {
  if (!value || typeof value !== 'object') return false;
  const { sessionToken, expiresAt } = value as Partial<StoredSession>;
  return (
    typeof sessionToken === 'string' &&
    sessionToken.length > 0 &&
    typeof expiresAt === 'string' &&
    Number.isFinite(new Date(expiresAt).getTime()) &&
    new Date(expiresAt).getTime() > Date.now()
  );
}

function readStoredSession(): StoredSession | null {
  const stored = storage()?.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    const session = JSON.parse(stored) as unknown;
    if (!isUsableSession(session)) {
      storage()?.removeItem(SESSION_KEY);
      clearExpandedBattles();
      return null;
    }
    return session;
  } catch {
    storage()?.removeItem(SESSION_KEY);
    clearExpandedBattles();
    return null;
  }
}

function writeStoredSession(session: StoredSession): void {
  storage()?.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearStoredSession(): void {
  storage()?.removeItem(SESSION_KEY);
}

function createSessionOnce(): Promise<StoredSession> {
  if (!pendingSessionCreation) {
    pendingSessionCreation = createPerceptionSession()
      .then((createdSession) => {
        const raw = createdSession as unknown as { sessionToken?: unknown; expiresAt?: unknown };
        const expiresAt =
          raw.expiresAt instanceof Date
            ? raw.expiresAt.toISOString()
            : typeof raw.expiresAt === 'string'
              ? raw.expiresAt
              : '';
        const session = {
          sessionToken: typeof raw.sessionToken === 'string' ? raw.sessionToken : '',
          expiresAt,
        };
        if (!isUsableSession(session)) {
          throw new Error('The private session response was incomplete. Please try again.');
        }
        return session;
      })
      .finally(() => {
        pendingSessionCreation = null;
      });
  }
  return pendingSessionCreation;
}

type PerceptionSessionContextValue = {
  sessionToken: string | null;
  sessionError: unknown | null;
  isCreatingSession: boolean;
  invalidateSession: () => void;
  retrySession: () => void;
  ensureSession: () => void;
};

const PerceptionSessionContext = createContext<PerceptionSessionContextValue | null>(null);

export function PerceptionSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(readStoredSession);
  const [sessionError, setSessionError] = useState<unknown | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const sessionRef = useRef(session);
  const creationInFlight = useRef<Promise<StoredSession> | null>(null);

  const startSession = useCallback(async (): Promise<StoredSession | null> => {
    if (sessionRef.current) return sessionRef.current;
    if (creationInFlight.current) return creationInFlight.current;

    setIsCreatingSession(true);
    const request = createSessionOnce();
    creationInFlight.current = request;

    try {
      const nextSession = await request;
      writeStoredSession(nextSession);
      sessionRef.current = nextSession;
      setSessionError(null);
      setSession(nextSession);
      return nextSession;
    } catch (error) {
      setSessionError(error);
      return null;
    } finally {
      creationInFlight.current = null;
      setIsCreatingSession(false);
    }
  }, []);

  const ensureSession = useCallback(() => {
    void startSession();
  }, [startSession]);

  const invalidateSession = useCallback(() => {
    clearStoredSession();
    clearExpandedBattles();
    setSessionError(null);
    sessionRef.current = null;
    setSession(null);
  }, []);

  const retrySession = useCallback(() => {
    invalidateSession();
    void startSession();
  }, [invalidateSession, startSession]);

  const value: PerceptionSessionContextValue = {
    sessionToken: session?.sessionToken ?? null,
    sessionError,
    isCreatingSession,
    invalidateSession,
    retrySession,
    ensureSession,
  };

  return createElement(PerceptionSessionContext.Provider, { value }, children);
}

export function useSessionToken() {
  const session = useContext(PerceptionSessionContext);
  if (!session) throw new Error('useSessionToken must be used inside PerceptionSessionProvider.');

  useEffect(() => {
    if (!session.sessionToken && !session.sessionError) session.ensureSession();
  }, [session.ensureSession, session.sessionError, session.sessionToken]);

  return session;
}

export function isInvalidPerceptionSessionError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'status' in error &&
      (error as { status?: unknown }).status === 404,
  );
}

export function isRecordedPerceptionSwipeError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'status' in error &&
      (error as { status?: unknown }).status === 409,
  );
}
