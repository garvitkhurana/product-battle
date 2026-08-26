import { useEffect, useRef, useState } from 'react';
import { useRoute } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetBattleQueryKey,
  useGetBattle,
  useGetTasteDna,
  useRecordPerceptionSwipe,
} from '@workspace/api-client-react';
import {
  isInvalidPerceptionSessionError,
  isRecordedPerceptionSwipeError,
  useSessionToken,
} from '@/lib/session';
import { markWordPromptOffered, shouldOfferWordPrompt } from '@/lib/wordPromptEligibility';
import { ArrowLeft, Check, Copy, Link2, Loader2, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { CompanyMark } from '@/components/CompanyMark';
import { WordReactionPrompt } from '@/components/WordReactionPrompt';
import { Seo } from '@/components/Seo';

export default function BattleDetail() {
  const [, params] = useRoute('/battles/:slug');
  const slug = params?.slug || '';
  const {
    sessionToken,
    sessionError,
    isCreatingSession,
    invalidateSession,
    retrySession,
  } = useSessionToken();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: battle, isLoading, error, refetch } = useGetBattle(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetBattleQueryKey(slug),
    },
  });

  const recordSwipe = useRecordPerceptionSwipe();
  const tasteDna = useGetTasteDna();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [alreadyRecorded, setAlreadyRecorded] = useState(false);
  const [checkedVoteHistoryKey, setCheckedVoteHistoryKey] = useState<string | null>(null);
  const voteHistoryRequestKey = useRef<string | null>(null);
  const [wordPrompt, setWordPrompt] = useState<{ participantId: string; participantName: string } | null>(null);
  const [showEntryCue] = useState(() => {
    const entrySlug = sessionStorage.getItem('yc_battle_entry');
    if (entrySlug !== slug) return false;
    sessionStorage.removeItem('yc_battle_entry');
    return true;
  });

  const voteHistoryKey = sessionToken && battle ? `${sessionToken}:${battle.id}` : null;

  useEffect(() => {
    if (!sessionToken || !battle || !voteHistoryKey) return;
    if (voteHistoryRequestKey.current === voteHistoryKey) return;

    voteHistoryRequestKey.current = voteHistoryKey;
    setCheckedVoteHistoryKey(null);
    setSelectedId(null);
    setAlreadyRecorded(false);

    tasteDna.mutate(
      { data: { sessionToken } },
      {
        onSuccess: (dna) => {
          setAlreadyRecorded(dna.completedBattleIds.includes(battle.id));
          setCheckedVoteHistoryKey(voteHistoryKey);
        },
        onError: (error) => {
          if (isInvalidPerceptionSessionError(error)) {
            voteHistoryRequestKey.current = null;
            invalidateSession();
            return;
          }

          // The write endpoint remains authoritative and rejects duplicate votes.
          // Let the page recover instead of trapping visitors behind a loading state.
          setCheckedVoteHistoryKey(voteHistoryKey);
        },
      },
    );
  }, [battle, invalidateSession, sessionToken, tasteDna, voteHistoryKey]);

  const refreshSplit = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetBattleQueryKey(slug) });
    await refetch();
  };

  const handleChoice = (participantId: string) => {
    if (!sessionToken || !battle) return;

    setSelectedId(participantId);
    const selected =
      battle.participantA.id === participantId ? battle.participantA : battle.participantB;

    recordSwipe.mutate(
      {
        data: {
          sessionToken,
          battleId: battle.id,
          winnerParticipantId: participantId,
          requestId: crypto.randomUUID(),
        },
      },
      {
        onSuccess: async (result) => {
          await refreshSplit();
          toast({
            title: 'Signal recorded',
            description: 'Live community split updated for this comparison.',
          });
          if (
            sessionToken &&
            shouldOfferWordPrompt(
              sessionToken,
              result.comparisonCount ?? result.tasteDna?.comparisonCount ?? 0,
            )
          ) {
            markWordPromptOffered(sessionToken);
            setWordPrompt({ participantId: selected.id, participantName: selected.name });
          }
        },
        onError: async (err) => {
          setSelectedId(null);
          if (isInvalidPerceptionSessionError(err)) {
            invalidateSession();
            toast({
              title: 'Starting a fresh session',
              description: 'Your previous private session is no longer available. Please choose again.',
            });
            return;
          }
          if (isRecordedPerceptionSwipeError(err)) {
            setAlreadyRecorded(true);
            await refreshSplit();
            toast({
              title: 'Choice already recorded',
              description: 'You already signaled this comparison. Here is the live community split.',
            });
            return;
          }
          toast({
            title: 'Error',
            description: 'Could not record choice. Please try again.',
            variant: 'destructive',
          });
        },
      },
    );
  };

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/card/battle/${encodeURIComponent(slug)}`
      : `https://ycbattle.com/api/card/battle/${encodeURIComponent(slug)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: 'Link copied', description: 'Comparison URL is on your clipboard.' });
    } catch {
      toast({ title: 'Copy failed', description: 'Copy the URL from your browser bar instead.', variant: 'destructive' });
    }
  };

  const shareText = battle
    ? `${battle.participantA.name} vs ${battle.participantB.name} — who earns your signal?`
    : '';

  const shareComparison = () => {
    if (!battle) return;
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(intent, '_blank', 'noopener,noreferrer');
  };

  const shareOnWhatsApp = () => {
    if (!battle) return;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const seoTitle = battle
    ? `${battle.participantA.name} vs ${battle.participantB.name} — YC Battle`
    : 'Company Comparison — YC Battle';
  const seoDescription = battle
    ? `Compare ${battle.participantA.name} and ${battle.participantB.name} in a private, pairwise perception study on YC Battle.`
    : 'Compare YC companies through fast, private pairwise perception choices.';

  if (sessionError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f6e5d2] p-5">
        <div className="max-w-lg border-2 border-[#181513] bg-[#fff8ef] p-8 text-center shadow-[6px_6px_0_#181513]">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#ff5038]">
            Private session unavailable
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">We could not check your prior signals.</h1>
          <button
            type="button"
            onClick={retrySession}
            className="mt-7 bg-[#181513] px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[#fff8ef]"
          >
            Retry session
          </button>
        </div>
      </div>
    );
  }

  if (
    isLoading ||
    isCreatingSession ||
    !sessionToken ||
    (voteHistoryKey !== null && checkedVoteHistoryKey !== voteHistoryKey)
  ) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !battle) {
    return (
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold">Comparison not found</h2>
          <p className="text-muted-foreground font-mono">This comparison may not exist or has been removed.</p>
          <Link href="/battles" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background font-bold mt-4">
            <ArrowLeft className="w-4 h-4" />
            Return to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const isComplete = selectedId !== null || alreadyRecorded;
  const aPct = battle.participantAPercentage;
  const bPct = battle.participantBPercentage;
  const leader =
    aPct === bPct
      ? null
      : aPct > bPct
        ? battle.participantA
        : battle.participantB;
  const leaderPct = Math.max(aPct, bPct);

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={`/battles/${encodeURIComponent(slug)}`}
        imagePath={`/api/og/battle/${encodeURIComponent(slug)}.png`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: seoTitle,
          description: seoDescription,
          url: `https://ycbattle.com/battles/${encodeURIComponent(slug)}`,
          about: [
            { '@type': 'Organization', name: battle.participantA.name, description: battle.participantA.shortDescription, url: battle.participantA.websiteUrl || undefined },
            { '@type': 'Organization', name: battle.participantB.name, description: battle.participantB.shortDescription, url: battle.participantB.websiteUrl || undefined },
          ],
        }}
      />
      <div className="flex-1 bg-[#f6e5d2] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-3 pb-6">
          <Link href="/battles" className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#625c55] transition-colors hover:text-[#181513]">
            <ArrowLeft className="h-4 w-4" />
            Back to board
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 border border-[#181513] bg-[#fff8ef] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#d7ff45]"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy link
            </button>
            <button
              type="button"
              onClick={shareComparison}
              className="inline-flex items-center gap-2 border border-[#181513] bg-[#181513] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#fff8ef] hover:bg-[#ff5038]"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
            <button
              type="button"
              onClick={shareOnWhatsApp}
              className="inline-flex items-center gap-2 border border-[#181513] bg-[#d7ff45] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#fff8ef]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </button>
            <span className="border border-[#181513] bg-[#fff8ef] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
              {battle.category}
            </span>
          </div>
        </header>

        <section className={showEntryCue ? 'battle-arena-entry' : ''}>
          <div className="border-2 border-[#181513] bg-[#fff8ef]">
            <div className="flex flex-col justify-between gap-4 border-b-2 border-[#181513] p-5 md:flex-row md:items-end md:p-7">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5038]">Head-to-head perception</p>
                <h1 className="mt-2 text-4xl font-bold tracking-[-0.06em] md:text-6xl">
                  {battle.participantA.name} <span className="text-[#ff5038]">vs.</span> {battle.participantB.name}
                </h1>
              </div>
              <p className="max-w-xs font-mono text-xs leading-relaxed text-[#625c55]">
                Pick the company you associate more strongly with this category. Your choice is private and helps calibrate aggregate context.
              </p>
            </div>

            <div className="grid md:grid-cols-[1fr_auto_1fr]">
              <button
                type="button"
                data-testid="battle-choice-a"
                onClick={() => !isComplete && handleChoice(battle.participantA.id)}
                disabled={isComplete || recordSwipe.isPending}
                className={`relative min-h-[390px] bg-[#ff5038] p-7 text-left text-[#181513] transition-all duration-200 md:min-h-[500px] md:p-10 ${
                  selectedId === battle.participantA.id
                    ? 'z-10 outline outline-4 outline-offset-[-4px] outline-[#181513]'
                    : isComplete
                      ? 'brightness-95'
                      : 'hover:z-10 hover:-translate-y-1 focus-visible:z-10 focus-visible:outline-4 focus-visible:outline-[#181513]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="border border-[#181513] bg-[#fff8ef] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em]">A / Side one</span>
                  {selectedId === battle.participantA.id && (
                    <span className="flex h-8 w-8 items-center justify-center border-2 border-[#181513] bg-[#fff8ef]"><Check className="h-4 w-4" /></span>
                  )}
                </div>
                <div className="mt-14 max-w-xl space-y-6">
                  <CompanyMark participant={battle.participantA} tone="neutral" size="lg" />
                  <h2 className="text-5xl font-bold leading-[0.92] tracking-[-0.07em] md:text-7xl">{battle.participantA.name}</h2>
                  <p className="font-mono text-sm leading-relaxed md:text-base">{battle.participantA.shortDescription}</p>
                  {isComplete && (
                    <p className="font-mono text-4xl font-bold tracking-[-0.08em] md:text-5xl">{aPct}%</p>
                  )}
                </div>
                <div className="absolute bottom-7 left-7 right-7 md:bottom-10 md:left-10 md:right-10">
                  <div className="border-t border-[#181513]/50" />
                  <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                    {isComplete
                      ? alreadyRecorded
                        ? 'Already recorded'
                        : selectedId === battle.participantA.id
                          ? 'Your signal'
                          : 'Not selected'
                      : 'Choose this side'}
                  </p>
                </div>
              </button>

              <div className="relative flex h-12 items-center justify-center border-y-2 border-[#181513] bg-[#fff8ef] md:h-auto md:w-0 md:border-x-2 md:border-y-0">
                <span className="absolute z-10 border-2 border-[#181513] bg-[#fff8ef] px-2 py-2 font-mono text-xs font-bold">VS</span>
              </div>

              <button
                type="button"
                data-testid="battle-choice-b"
                onClick={() => !isComplete && handleChoice(battle.participantB.id)}
                disabled={isComplete || recordSwipe.isPending}
                className={`relative min-h-[390px] bg-[#d7ff45] p-7 text-left text-[#181513] transition-all duration-200 md:min-h-[500px] md:p-10 ${
                  selectedId === battle.participantB.id
                    ? 'z-10 outline outline-4 outline-offset-[-4px] outline-[#181513]'
                    : isComplete
                      ? 'brightness-95'
                      : 'hover:z-10 hover:-translate-y-1 focus-visible:z-10 focus-visible:outline-4 focus-visible:outline-[#181513]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="border border-[#181513] bg-[#fff8ef] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em]">B / Side two</span>
                  {selectedId === battle.participantB.id && (
                    <span className="flex h-8 w-8 items-center justify-center border-2 border-[#181513] bg-[#fff8ef]"><Check className="h-4 w-4" /></span>
                  )}
                </div>
                <div className="mt-14 max-w-xl space-y-6">
                  <CompanyMark participant={battle.participantB} tone="neutral" size="lg" />
                  <h2 className="text-5xl font-bold leading-[0.92] tracking-[-0.07em] md:text-7xl">{battle.participantB.name}</h2>
                  <p className="font-mono text-sm leading-relaxed md:text-base">{battle.participantB.shortDescription}</p>
                  {isComplete && (
                    <p className="font-mono text-4xl font-bold tracking-[-0.08em] md:text-5xl">{bPct}%</p>
                  )}
                </div>
                <div className="absolute bottom-7 left-7 right-7 md:bottom-10 md:left-10 md:right-10">
                  <div className="border-t border-[#181513]/50" />
                  <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                    {isComplete
                      ? alreadyRecorded
                        ? 'Already recorded'
                        : selectedId === battle.participantB.id
                          ? 'Your signal'
                          : 'Not selected'
                      : 'Choose this side'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </section>

        {isComplete && (
          <div className="mt-6 space-y-4">
            <div className="border-2 border-[#181513] bg-[#fff8ef] p-5 shadow-[6px_6px_0_#181513]">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff5038]">Live community split</p>
              <p className="mt-2 text-2xl font-bold tracking-[-0.04em] md:text-3xl">
                {battle.comparisonCount === 0
                  ? 'You are first — more signals will sharpen this split.'
                  : leader
                    ? `${leaderPct}% picked ${leader.name}`
                    : `Tied at ${aPct}% · ${battle.comparisonCount} signals`}
              </p>
              <div className="mt-4 flex h-3 overflow-hidden border-2 border-[#181513]">
                <div className="bg-[#ff5038]" style={{ width: `${aPct}%` }} />
                <div className="bg-[#d7ff45]" style={{ width: `${bPct}%` }} />
              </div>
              <div className="mt-3 flex justify-between font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#625c55]">
                <span>{battle.participantA.name} {aPct}%</span>
                <span>{battle.comparisonCount} total</span>
                <span>{battle.participantB.name} {bPct}%</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 border-2 border-[#181513] bg-[#181513] p-5 text-[#fff8ef] sm:flex-row">
              <p className="font-mono text-xs">
                {alreadyRecorded
                  ? 'A signal for this comparison is already recorded in this browser session.'
                  : 'Signal recorded. Continue to add context or inspect your private profile.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 border border-[#fff8ef] px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Copy link
                </button>
                <button
                  type="button"
                  onClick={shareOnWhatsApp}
                  className="inline-flex items-center gap-2 border border-[#fff8ef] px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </button>
                <Link href="/swipe" className="bg-[#d7ff45] px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[#181513]">Continuous mode</Link>
                <Link href="/dna" className="border border-[#fff8ef] px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest">Taste DNA</Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <WordReactionPrompt
        open={!!wordPrompt}
        sessionToken={sessionToken}
        target={wordPrompt}
        onClose={() => setWordPrompt(null)}
        onSessionInvalid={invalidateSession}
      />
      </div>
    </>
  );
}
