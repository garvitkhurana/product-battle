const ELIGIBILITY_PREFIX = 'yc_battle_word_prompt_eligible';
const SHOWN_PREFIX = 'yc_battle_word_prompt_shown';

function sessionStore() {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function hashSessionToken(sessionToken: string): number {
  let hash = 0;
  for (let i = 0; i < sessionToken.length; i++) {
    hash = (hash * 31 + sessionToken.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Stable ~2% eligibility bucket for the lifetime of this session token. */
export function isWordPromptEligible(sessionToken: string | null): boolean {
  if (!sessionToken) return false;

  const store = sessionStore();
  const cacheKey = `${ELIGIBILITY_PREFIX}:${sessionToken}`;
  const cached = store?.getItem(cacheKey);
  if (cached === '1') return true;
  if (cached === '0') return false;

  const eligible = hashSessionToken(sessionToken) % 50 === 0;
  store?.setItem(cacheKey, eligible ? '1' : '0');
  return eligible;
}

function hasWordPromptBeenOffered(sessionToken: string): boolean {
  return sessionStore()?.getItem(`${SHOWN_PREFIX}:${sessionToken}`) === '1';
}

export function markWordPromptOffered(sessionToken: string): void {
  sessionStore()?.setItem(`${SHOWN_PREFIX}:${sessionToken}`, '1');
}

/** Eligible sessions see the prompt once when they first reach 10 comparisons. */
export function shouldOfferWordPrompt(sessionToken: string | null, comparisonCount: number): boolean {
  if (!sessionToken || comparisonCount < 10) return false;
  if (!isWordPromptEligible(sessionToken)) return false;
  return !hasWordPromptBeenOffered(sessionToken);
}
