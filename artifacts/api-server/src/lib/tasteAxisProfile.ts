export type TasteAxisComparison = {
  winnerParticipantId: string;
  loserParticipantId: string;
};

export type TasteAxisScore = {
  participantId: string;
  axisKey: string;
  score: number;
};

export type CalculatedTasteAxis = {
  key: string;
  score: number;
  confidence: number;
};

export function calculateTasteAxes(
  axisKeys: string[],
  comparisons: TasteAxisComparison[],
  scoreRows: TasteAxisScore[],
  evidenceTarget = 5,
): CalculatedTasteAxis[] {
  const scoresByParticipant = new Map<string, Map<string, number>>();
  for (const row of scoreRows) {
    const participantScores =
      scoresByParticipant.get(row.participantId) ?? new Map<string, number>();
    participantScores.set(row.axisKey, row.score);
    scoresByParticipant.set(row.participantId, participantScores);
  }

  return axisKeys.map((key) => {
    const directionalVotes = comparisons.flatMap((comparison) => {
      const winnerScore = scoresByParticipant
        .get(comparison.winnerParticipantId)
        ?.get(key);
      const loserScore = scoresByParticipant
        .get(comparison.loserParticipantId)
        ?.get(key);
      if (
        winnerScore === undefined ||
        loserScore === undefined ||
        winnerScore === loserScore
      ) {
        return [];
      }
      return [winnerScore > loserScore ? 1 : -1];
    });

    if (!directionalVotes.length) {
      return { key, score: 3, confidence: 0 };
    }

    const netPreference = directionalVotes.reduce(
      (sum, direction) => sum + direction,
      0,
    );
    return {
      key,
      score:
        Math.round(
          (3 + (netPreference / directionalVotes.length) * 2) * 10,
        ) / 10,
      confidence: Math.min(
        100,
        Math.round((directionalVotes.length / evidenceTarget) * 100),
      ),
    };
  });
}
