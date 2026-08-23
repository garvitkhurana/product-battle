import type { Battle } from "@workspace/api-client-react";

/** Household-name matchups, click-priority first. Keep this list short and famous. */
export const HOUSEHOLD_BATTLE_SLUGS = [
  "airbnb-vs-vrbo",
  "doordash-vs-uber-eats",
  "twitch-vs-youtube",
  "stripe-vs-adyen",
  "coinbase-vs-binance",
  "instacart-vs-amazon-fresh",
  "dropbox-vs-google-drive",
  "gitlab-vs-github",
  "whatnot-vs-tiktok-shop",
  "goat-vs-stockx",
  "gusto-vs-adp",
  "brex-vs-amex",
  "honeylove-vs-skims",
  "zepto-vs-blinkit",
  "scribd-vs-kindle-unlimited",
] as const;

const householdRank = new Map<string, number>(
  HOUSEHOLD_BATTLE_SLUGS.map((slug, index) => [slug, index]),
);

export function rankBattlesForClicks(battles: Battle[]): Battle[] {
  return [...battles].sort((left, right) => {
    const leftRank = householdRank.get(left.slug) ?? Number.POSITIVE_INFINITY;
    const rightRank = householdRank.get(right.slug) ?? Number.POSITIVE_INFINITY;
    if (leftRank !== rightRank) return leftRank - rightRank;
    return right.totalVotes - left.totalVotes || new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

export function nextHouseholdBattles(battles: Battle[], excludeBattleId?: string | null, limit = 3): Battle[] {
  return rankBattlesForClicks(
    battles.filter((battle) => battle.status === "active" && battle.id !== excludeBattleId),
  ).slice(0, limit);
}
