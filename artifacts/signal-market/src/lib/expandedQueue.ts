import type { Battle } from '@workspace/api-client-react';

const EXPANDED_QUEUE_KEY = 'signal_market_expanded_queue';

type NextBatchResponse = {
  battles: Battle[];
  batchNumber: number;
  hasMore: boolean;
};

export class NextComparisonBatchError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'NextComparisonBatchError';
  }
}

type StoredExpandedQueue = {
  sessionToken: string;
  battles: Battle[];
};

function storage() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isBattleParticipant(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const participant = value as Record<string, unknown>;
  return (
    typeof participant.id === 'string' &&
    typeof participant.slug === 'string' &&
    typeof participant.name === 'string' &&
    typeof participant.shortDescription === 'string' &&
    typeof participant.description === 'string' &&
    typeof participant.imageUrl === 'string' &&
    typeof participant.websiteUrl === 'string' &&
    (typeof participant.productId === 'string' || participant.productId === null) &&
    (typeof participant.ycBatch === 'string' || participant.ycBatch === null || participant.ycBatch === undefined) &&
    typeof participant.category === 'string' &&
    typeof participant.location === 'string' &&
    typeof participant.isYcCompany === 'boolean'
  );
}

function isBattle(value: unknown): value is Battle {
  if (!value || typeof value !== 'object') return false;
  const battle = value as Record<string, unknown>;
  return (
    typeof battle.id === 'string' &&
    typeof battle.slug === 'string' &&
    typeof battle.title === 'string' &&
    typeof battle.description === 'string' &&
    typeof battle.category === 'string' &&
    isBattleParticipant(battle.participantA) &&
    isBattleParticipant(battle.participantB) &&
    typeof battle.comparisonCount === 'number' &&
    typeof battle.participantAPercentage === 'number' &&
    typeof battle.participantBPercentage === 'number' &&
    typeof battle.participantARating === 'number' &&
    typeof battle.participantBRating === 'number' &&
    typeof battle.participantAConfidence === 'number' &&
    typeof battle.participantBConfidence === 'number' &&
    battle.status === 'active' &&
    (typeof battle.winnerParticipantId === 'string' || battle.winnerParticipantId === null) &&
    typeof battle.createdAt === 'string'
  );
}

export function readExpandedBattles(sessionToken: string | null): Battle[] {
  if (!sessionToken) return [];
  const raw = storage()?.getItem(EXPANDED_QUEUE_KEY);
  if (!raw) return [];
  try {
    const value = JSON.parse(raw) as Partial<StoredExpandedQueue>;
    if (value.sessionToken !== sessionToken || !Array.isArray(value.battles) || !value.battles.every(isBattle)) {
      storage()?.removeItem(EXPANDED_QUEUE_KEY);
      return [];
    }
    return value.battles;
  } catch {
    storage()?.removeItem(EXPANDED_QUEUE_KEY);
    return [];
  }
}

export function addExpandedBattles(sessionToken: string, nextBatch: Battle[]): void {
  const byId = new Map(readExpandedBattles(sessionToken).map((battle) => [battle.id, battle]));
  nextBatch.forEach((battle) => byId.set(battle.id, battle));
  storage()?.setItem(EXPANDED_QUEUE_KEY, JSON.stringify({ sessionToken, battles: [...byId.values()] }));
}

export function clearExpandedBattles(): void {
  storage()?.removeItem(EXPANDED_QUEUE_KEY);
}

export async function getNextComparisonBatch(sessionToken: string): Promise<NextBatchResponse> {
  const response = await fetch('/api/perception/next-batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionToken }),
  });
  const payload = (await response.json()) as NextBatchResponse | { error?: string };
  if (!response.ok) {
    throw new NextComparisonBatchError(
      'error' in payload && payload.error ? payload.error : 'We could not prepare another comparison batch.',
      response.status,
    );
  }
  return payload as NextBatchResponse;
}