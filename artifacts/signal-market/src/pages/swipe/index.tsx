import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetTasteDna, useListBattles, useRecordPerceptionSwipe } from '@workspace/api-client-react';
import {
  isInvalidPerceptionSessionError,
  isRecordedPerceptionSwipeError,
  useSessionToken,
} from '@/lib/session';
import { Loader2, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { CompanyMark } from '@/components/CompanyMark';
import { WordReactionPrompt } from '@/components/WordReactionPrompt';
import { readExpandedBattles } from '@/lib/expandedQueue';

export default function SwipeFlow() {
  const { sessionToken, sessionError, isCreatingSession, invalidateSession, retrySession } = useSessionToken();
  const { data: battles, isLoading } = useListBattles();
  const { toast } = useToast();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [newlyCompletedBattleIds, setNewlyCompletedBattleIds] = useState<string[]>([]);
  const [wordPrompt, setWordPrompt] = useState<{ participantId: string; participantName: string } | null>(null);
  const expandedBattles = useMemo(() => readExpandedBattles(sessionToken), [sessionToken]);
  const dnaRequestSession = useRef<string | null>(null);
  
  const recordSwipe = useRecordPerceptionSwipe();
  const tasteDna = useGetTasteDna();

  const recoverSession = useCallback(() => {
    tasteDna.reset();
    setCurrentIndex(0);
    setNewlyCompletedBattleIds([]);
    setDirection(null);
    setWordPrompt(null);
    invalidateSession();
  }, [invalidateSession, tasteDna]);

  const loadTasteDna = useCallback(() => {
    if (!sessionToken || tasteDna.isPending) return;
    dnaRequestSession.current = sessionToken;
    tasteDna.mutate(
      { data: { sessionToken } },
      {
        onError: (error) => {
          if (isInvalidPerceptionSessionError(error)) recoverSession();
        },
      },
    );
  }, [recoverSession, sessionToken, tasteDna]);

  useEffect(() => {
    if (
      sessionToken &&
      dnaRequestSession.current !== sessionToken &&
      !tasteDna.data &&
      !tasteDna.isPending &&
      !tasteDna.error
    ) {
      loadTasteDna();
    }
  }, [loadTasteDna, sessionToken, tasteDna.data, tasteDna.error, tasteDna.isPending]);

  const retryTasteDna = useCallback(() => {
    dnaRequestSession.current = null;
    tasteDna.reset();
    loadTasteDna();
  }, [loadTasteDna, tasteDna]);

  const activeBattles = useMemo(
    () => (battles ?? []).filter((battle) => battle.status === 'active'),
    [battles],
  );
  const recordableBattles = useMemo(() => {
    const activeIds = new Set(activeBattles.map((battle) => battle.id));
    return [...activeBattles, ...expandedBattles.filter((battle) => !activeIds.has(battle.id))];
  }, [activeBattles, expandedBattles]);
  const activeBattleIds = useMemo(() => new Set(recordableBattles.map((battle) => battle.id)), [recordableBattles]);
  const completedBattleIds = useMemo(
    () =>
      new Set(
        [...(tasteDna.data?.completedBattleIds ?? []), ...newlyCompletedBattleIds].filter((battleId) =>
          activeBattleIds.has(battleId),
        ),
      ),
    [activeBattleIds, tasteDna.data?.completedBattleIds, newlyCompletedBattleIds],
  );
  const queuedBattles = useMemo(
    () => recordableBattles.filter((battle) => !completedBattleIds.has(battle.id)),
    [recordableBattles, completedBattleIds],
  );
  const activeBattle = queuedBattles[currentIndex];
  const battleCount = recordableBattles.length;
  const completedCount = completedBattleIds.size;
  const remainingCount = queuedBattles.length;
  const currentPosition = battleCount ? Math.min(completedCount + 1, battleCount) : 0;

  const handleChoice = (participantId: string, dir: 'left' | 'right') => {
    if (!sessionToken || !activeBattle) return;

    const selectedBattleId = activeBattle.id;
    const selectedParticipant =
      activeBattle.participantA.id === participantId ? activeBattle.participantA : activeBattle.participantB;
    const nextCompletedCount = completedCount + (completedBattleIds.has(selectedBattleId) ? 0 : 1);
    setDirection(dir);
    setNewlyCompletedBattleIds((ids) => ids.includes(selectedBattleId) ? ids : [...ids, selectedBattleId]);
    window.setTimeout(() => setDirection(null), 250);
    
    recordSwipe.mutate({
      data: {
        sessionToken,
        battleId: selectedBattleId,
        winnerParticipantId: participantId,
        requestId: crypto.randomUUID()
      }
    }, {
      onSuccess: (result) => {
        const comparisonCount =
          result.comparisonCount ?? result.tasteDna?.comparisonCount ?? nextCompletedCount;
        // Unlock at 10, then every 5th vote (10, 15, 20, …) — not after every swipe.
        if (comparisonCount >= 10 && comparisonCount % 5 === 0) {
          setWordPrompt({
            participantId: selectedParticipant.id,
            participantName: selectedParticipant.name,
          });
        }
      },
      onError: (error) => {
        setDirection(null);
        if (isInvalidPerceptionSessionError(error)) {
          setNewlyCompletedBattleIds((ids) => ids.filter((id) => id !== selectedBattleId));
          recoverSession();
          toast({
            title: "Starting a fresh session",
            description: "Your previous private session is no longer available, so the queue has been reset.",
          });
          return;
        }
        if (isRecordedPerceptionSwipeError(error)) {
          toast({
            title: "Choice already recorded",
            description: "That comparison is already part of your private profile, so we moved it out of the queue.",
          });
          return;
        }
        setNewlyCompletedBattleIds((ids) => ids.filter((id) => id !== selectedBattleId));
        toast({
          title: "Choice not recorded",
          description: "Please try that comparison again. If you are adding signals quickly, pause for a moment first.",
          variant: "destructive"
        });
      }
    });
  };

  if (sessionError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f6e5d2] p-5">
        <div className="max-w-lg border-2 border-[#181513] bg-[#fff8ef] p-8 text-center shadow-[6px_6px_0_#181513]">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#ff5038]">Private session unavailable</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Your comparison desk needs a fresh start.</h1>
          <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
            No choices were recorded. Start a new private session and continue comparing.
          </p>
          <button
            type="button"
            onClick={retrySession}
            className="mt-7 bg-[#181513] px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-white transition-transform hover:-translate-y-0.5"
          >
            Start fresh session
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !sessionToken || isCreatingSession) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Calibrating Engine</p>
        </div>
      </div>
    );
  }

  if (tasteDna.error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f6e5d2] p-5">
        <div className="max-w-lg border-2 border-[#181513] bg-[#fff8ef] p-8 text-center shadow-[6px_6px_0_#181513]">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#ff5038]">Queue check unavailable</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Your private session is still safe.</h1>
          <p className="mt-4 font-mono text-sm leading-relaxed text-[#625c55]">
            We could not load the comparisons already recorded in this browser. Reload the queue to continue without duplicating a choice.
          </p>
          <button
            type="button"
            onClick={retryTasteDna}
            className="mt-7 bg-[#181513] px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[#fff8ef] transition-transform hover:-translate-y-0.5"
          >
            Reload my queue
          </button>
        </div>
      </div>
    );
  }

  if (!activeBattle) {
    return (
      <div className="flex-1 bg-[#f6e5d2] px-5 py-8 md:px-8 md:py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col">
          <header className="flex flex-col justify-between gap-5 border-b-2 border-[#181513] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5038]">Signal queue</p>
              <h1 className="mt-1 text-3xl font-bold tracking-[-0.05em] md:text-5xl">Continuous Mode</h1>
            </div>
            <div className="border-2 border-[#181513] bg-[#fff8ef] px-4 py-3 text-left font-mono">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#625c55]">Queue progress</p>
              <p className="mt-1 text-lg font-bold">{completedCount} of {battleCount} compared</p>
            </div>
          </header>

          <div className="flex flex-1 items-center justify-center py-12 md:py-20">
            <div className="w-full max-w-2xl border-2 border-[#181513] bg-[#fff8ef] p-6 text-center shadow-[8px_8px_0_#181513] md:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-[#181513] bg-[#d7ff45]">
                <Activity className="h-8 w-8 text-[#181513]" />
              </div>
              <p className="mt-7 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5038]">Cohort complete</p>
              <h2 className="mt-2 text-4xl font-bold tracking-[-0.05em] md:text-5xl">You finished this queue.</h2>
              <p className="mx-auto mt-4 max-w-lg font-mono text-sm leading-relaxed text-[#625c55]">
                You have compared every active matchup in this cohort. Your private Taste DNA now reflects these signals; public confidence remains separate and anonymous.
              </p>

              <div className="mt-8 grid grid-cols-2 border-2 border-[#181513] text-left">
                <div className="border-r-2 border-[#181513] bg-[#ff5038] p-5">
                  <p className="font-mono text-3xl font-bold">{completedCount}</p>
                  <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">Comparisons completed</p>
                </div>
                <div className="bg-[#d7ff45] p-5">
                  <p className="font-mono text-3xl font-bold">0</p>
                  <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">Remaining in queue</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/dna" className="inline-flex items-center justify-center bg-[#181513] px-7 py-4 font-mono text-xs font-bold uppercase tracking-widest text-[#fff8ef] transition-transform hover:-translate-y-0.5">
                  View Your Taste DNA
                </Link>
                <Link href="/map?next=1" className="inline-flex items-center justify-center border-2 border-[#181513] px-7 py-4 font-mono text-xs font-bold uppercase tracking-widest text-[#181513] transition-colors hover:bg-[#d7ff45]">
                  Add another Ecosystem batch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#f6e5d2] overflow-hidden">
      <header className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 pt-6 sm:flex-row sm:items-end sm:justify-between md:px-8">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5038]">Signal queue</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Continuous Mode</h1>
          <p className="mt-2 font-mono text-xs text-[#625c55]">
            {currentPosition} of {battleCount} · {Math.max(0, remainingCount - 1)} remaining
          </p>
        </div>
        <div className="min-w-36 border-2 border-[#181513] bg-[#fff8ef] px-4 py-3 font-mono text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#625c55]">Queue</p>
          <p className="mt-1 text-lg font-bold">{currentPosition} <span className="text-sm text-[#625c55]">of {battleCount}</span></p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff5038]">{Math.max(0, remainingCount - 1)} remaining</p>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-5 py-8 md:px-8">
        <div className="relative min-h-[842px] w-full max-w-6xl perspective-[1000px] md:min-h-[504px]">
          <div className={`absolute inset-0 flex flex-col md:flex-row transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]
            ${direction === 'left' ? '-translate-x-[120%] rotate-[-8deg] opacity-0' : ''}
            ${direction === 'right' ? 'translate-x-[120%] rotate-[8deg] opacity-0' : ''}
          `}>
            {/* Left Choice */}
            <button
              data-testid="battle-choice-a"
              onClick={() => handleChoice(activeBattle.participantA.id, 'left')}
              disabled={!!direction}
              className="min-h-[420px] flex-1 border-2 border-[#181513] bg-[#ff5038] p-7 text-left text-[#181513] transition-transform duration-200 hover:z-10 hover:-translate-y-1 focus-visible:z-10 focus-visible:outline-none md:min-h-[500px] md:border-r-0 md:p-12"
            >
              <div className="flex items-center justify-between">
                <span className="border border-[#181513] bg-[#fff8ef] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">A / Challenger</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">Choose left</span>
              </div>
              <div className="mt-auto space-y-5">
                <CompanyMark participant={activeBattle.participantA} tone="neutral" size="lg" />
                <h3 className="text-4xl font-bold tracking-[-0.05em] md:text-6xl">
                  {activeBattle.participantA.name}
                </h3>
                <p className="max-w-md font-mono text-sm leading-relaxed md:text-base">
                  {activeBattle.participantA.shortDescription}
                </p>
              </div>
              <div className="mt-10 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em]">
                Select this side <ArrowRight className="h-4 w-4" />
              </div>
            </button>
            
            {/* Center Divider */}
            <div className="relative z-20 flex h-px shrink-0 items-center justify-center border-t-2 border-[#181513] md:h-auto md:w-0 md:border-l-2 md:border-t-0">
              <div className="absolute flex h-12 w-12 items-center justify-center border-2 border-[#181513] bg-[#fff8ef] font-mono text-xs font-bold text-[#181513]">
                VS
              </div>
            </div>

            {/* Right Choice */}
            <button
              data-testid="battle-choice-b"
              onClick={() => handleChoice(activeBattle.participantB.id, 'right')}
              disabled={!!direction}
              className="min-h-[420px] flex-1 border-2 border-[#181513] bg-[#d7ff45] p-7 text-left text-[#181513] transition-transform duration-200 hover:z-10 hover:-translate-y-1 focus-visible:z-10 focus-visible:outline-none md:min-h-[500px] md:border-l-0 md:p-12"
            >
              <div className="flex items-center justify-between">
                <span className="border border-[#181513] bg-[#fff8ef] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">B / Challenger</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">Choose right</span>
              </div>
              <div className="mt-auto space-y-5">
                <CompanyMark participant={activeBattle.participantB} tone="neutral" size="lg" />
                <h3 className="text-4xl font-bold tracking-[-0.05em] md:text-6xl">
                  {activeBattle.participantB.name}
                </h3>
                <p className="max-w-md font-mono text-sm leading-relaxed md:text-base">
                  {activeBattle.participantB.shortDescription}
                </p>
              </div>
              <div className="mt-10 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em]">
                Select this side <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          </div>

        </div>
      </div>
      
      <footer className="pb-6 text-center font-mono text-xs text-muted-foreground">
        Tap a side to record your perception. Keyboard navigation available via Tab & Enter.
      </footer>

      <WordReactionPrompt
        open={!!wordPrompt}
        sessionToken={sessionToken}
        target={wordPrompt}
        onClose={() => setWordPrompt(null)}
        onSessionInvalid={recoverSession}
      />
    </div>
  );
}
