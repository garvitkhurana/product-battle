import { useEffect, useRef, useState } from "react";
import {
  useCreateBattleCheckout,
  useGetBattle,
  BattleParticipant,
} from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Sword,
  Swords,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function BattleDetail() {
  const { slug } = useParams();
  const { toast } = useToast();
  const { data: battle, isLoading, error } = useGetBattle(slug || "");
  const createCheckout = useCreateBattleCheckout();
  const [voteParticipant, setVoteParticipant] = useState<BattleParticipant | null>(null);
  const [disclosureAccepted, setDisclosureAccepted] = useState(false);
  const [impactParticipantId, setImpactParticipantId] = useState<string | null>(null);
  const [knockedOutParticipantId, setKnockedOutParticipantId] = useState<string | null>(null);
  const impactTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (impactTimer.current) clearTimeout(impactTimer.current);
  }, []);

  const openVoteDialog = (participant: BattleParticipant) => {
    setVoteParticipant(participant);
    setDisclosureAccepted(false);
    setImpactParticipantId(participant.id);
    setKnockedOutParticipantId(
      participant.id === battle?.participantA.id ? battle?.participantB.id ?? null : battle?.participantA.id ?? null,
    );
    if (impactTimer.current) clearTimeout(impactTimer.current);
    impactTimer.current = setTimeout(() => {
      setImpactParticipantId(null);
      setKnockedOutParticipantId(null);
    }, 1100);
  };

  const confirmVote = () => {
    if (!battle || !voteParticipant || !disclosureAccepted) return;
    createCheckout.mutate(
      {
        data: {
          battleId: battle.id,
          participantId: voteParticipant.id,
          disclosureAccepted: true,
        },
      },
      {
        onSuccess: (session) => {
          window.location.href = session.checkoutUrl;
        },
        onError: () => {
          toast({
            title: "Checkout could not start",
            description: "Please try again. Your card will only be charged after Stripe confirms payment.",
            variant: "destructive",
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center space-y-8">
        <Skeleton className="h-12 w-3/4 max-w-lg" />
        <div className="flex gap-4 w-full max-w-4xl h-96">
          <Skeleton className="flex-1 rounded-2xl" />
          <Skeleton className="flex-1 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !battle) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-4">Battle Not Found</h1>
        <Button asChild><Link href="/battles">Back to Battles</Link></Button>
      </div>
    );
  }

  const isCompleted = battle.status === 'completed';
  const aWins = battle.participantAPercentage > battle.participantBPercentage;
  const bWins = battle.participantBPercentage > battle.participantAPercentage;

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-[#f8e9d8] text-[#211b18]">
      <header className="border-b-2 border-[#f8e9d8]/20 bg-[#211b18] px-5 py-5 text-[#f8e9d8] md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/battles"
            className="group inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#f8e9d8]/75 transition-colors hover:text-[#d9f75b] md:text-xs"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            All battles
          </Link>
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
            <span className={`h-2 w-2 rounded-full ${isCompleted ? "bg-[#ff4f32]" : "animate-pulse bg-[#d9f75b]"}`} />
            {isCompleted ? "Final results" : "Live now"}
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-5 pb-4 pt-12 md:px-10 md:pt-16">
        <div className="absolute right-4 top-3 hidden select-none font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-[#211b18]/35 md:block">
          YC BATTLE / FIELD {battle.slug.slice(-2).toUpperCase()}
        </div>
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="mb-5 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#ff4f32]">
              <Zap className="h-4 w-4 fill-current" />
              Head-to-head matchup
            </p>
            <h1 className="max-w-3xl font-sans text-5xl font-extrabold leading-[0.88] tracking-[-0.09em] md:text-8xl">
              {battle.participantA.name} <span className="text-[#ff4f32]">vs.</span>
              <br />
              {battle.participantB.name}
            </h1>
            <p className="mt-7 max-w-xl text-base font-semibold leading-relaxed text-[#211b18]/70 md:text-lg">
              {battle.description}
            </p>
          </div>
          <div className="hidden shrink-0 border-2 border-[#211b18] p-3 md:block">
            <div className="flex h-14 w-14 items-center justify-center bg-[#ff4f32] font-mono text-xl font-bold italic">
              VS
            </div>
          </div>
        </div>
        <div className="mt-12">
          <ScoreRail
            leftName={battle.participantA.name}
            rightName={battle.participantB.name}
            left={battle.participantAPercentage}
            right={battle.participantBPercentage}
            leftVotes={battle.participantAVotes}
            rightVotes={battle.participantBVotes}
            totalVotes={battle.totalVotes}
          />
        </div>
      </div>

      <div className="relative mx-auto mt-5 flex max-w-6xl flex-col border-y-2 border-[#211b18] md:flex-row">
        {impactParticipantId && (
          <ClashImpact
            side={impactParticipantId === battle.participantA.id ? "left" : "right"}
          />
        )}
        <Fighter
          participant={battle.participantA}
          percentage={battle.participantAPercentage}
          votes={battle.participantAVotes}
          side="left"
          isCompleted={isCompleted}
          isWinner={aWins}
           isSelected={voteParticipant?.id === battle.participantA.id}
           isKnockedOut={knockedOutParticipantId === battle.participantA.id}
          onVote={() => openVoteDialog(battle.participantA)}
           onCancelVote={() => setVoteParticipant(null)}
           onConfirm={confirmVote}
           disclosureAccepted={disclosureAccepted}
           onDisclosureChange={setDisclosureAccepted}
           isPending={createCheckout.isPending}
        />
        <div className="relative z-20 -my-5 flex h-10 items-center justify-center self-center border-2 border-[#211b18] bg-[#f8e9d8] px-3 font-mono text-xs font-bold italic md:-mx-5 md:my-0 md:h-auto md:w-10 md:flex-col md:px-0">
          <span className="relative z-10">VS</span>
        </div>
        <Fighter
          participant={battle.participantB}
          percentage={battle.participantBPercentage}
          votes={battle.participantBVotes}
          side="right"
          isCompleted={isCompleted}
          isWinner={bWins}
           isSelected={voteParticipant?.id === battle.participantB.id}
           isKnockedOut={knockedOutParticipantId === battle.participantB.id}
          onVote={() => openVoteDialog(battle.participantB)}
           onCancelVote={() => setVoteParticipant(null)}
           onConfirm={confirmVote}
           disclosureAccepted={disclosureAccepted}
           onDisclosureChange={setDisclosureAccepted}
           isPending={createCheckout.isPending}
        />
      </div>

      <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-[#211b18]/60 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
          <ShieldCheck className="h-4 w-4" />
          Each $0.99 payment adds one community vote · no refunds
        </p>
        <Link
          href="/voting-disclosure"
          className="flex items-center gap-1 self-start font-mono text-[10px] font-bold uppercase tracking-[0.12em] underline underline-offset-4 hover:text-[#ff4f32] md:self-auto"
        >
          How this works <ChevronRight className="h-3 w-3" />
        </Link>
      </footer>

    </div>
  );
}

function ScoreRail({
  leftName,
  rightName,
  left,
  right,
  leftVotes,
  rightVotes,
  totalVotes,
}: {
  leftName: string;
  rightName: string;
  left: number;
  right: number;
  leftVotes: number;
  rightVotes: number;
  totalVotes: number;
}) {
  const leftLeads = left >= right;

  return (
    <div className="relative mx-auto w-full max-w-5xl px-5 md:px-8">
      <div className="flex items-end justify-between gap-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#211b18]/60">
        <span className="min-w-0 truncate">{leftName} <b className="text-[#211b18]">{left}%</b></span>
        <span className="min-w-0 truncate text-right"><b className="text-[#211b18]">{right}%</b> {rightName}</span>
      </div>
      <div className="mt-3 flex h-5 gap-1 overflow-hidden rounded-sm border-2 border-[#211b18] bg-[#211b18]">
        <div className="relative bg-[#ff4f32] transition-[width] duration-700 ease-out" style={{ width: `${left}%` }}>
          {leftLeads && left >= 12 && (
            <span className="absolute inset-y-0 right-3 flex items-center font-mono text-[10px] font-bold text-[#211b18]">LEAD</span>
          )}
        </div>
        <div className="relative bg-[#d9f75b] transition-[width] duration-700 ease-out" style={{ width: `${right}%` }}>
          {!leftLeads && right >= 12 && (
            <span className="absolute inset-y-0 left-3 flex items-center font-mono text-[10px] font-bold text-[#211b18]">LEAD</span>
          )}
        </div>
      </div>
      <div className="mt-2 flex justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-[#211b18]/55">
        <span>{leftVotes.toLocaleString()} votes</span>
        <span>{totalVotes.toLocaleString()} total votes</span>
        <span>{rightVotes.toLocaleString()} votes</span>
      </div>
    </div>
  );
}

function Fighter({
  participant,
  percentage,
  votes,
  side,
  isCompleted,
  isWinner,
  isSelected,
  isKnockedOut,
  onVote,
  onCancelVote,
  onConfirm,
  disclosureAccepted,
  onDisclosureChange,
  isPending,
}: {
  participant: BattleParticipant;
  percentage: number;
  votes: number;
  side: "left" | "right";
  isCompleted: boolean;
  isWinner: boolean;
  isSelected: boolean;
  isKnockedOut: boolean;
  onVote: () => void;
  onCancelVote: () => void;
  onConfirm: () => void;
  disclosureAccepted: boolean;
  onDisclosureChange: (accepted: boolean) => void;
  isPending: boolean;
}) {
  const isLeft = side === "left";
  const initials = participant.name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const descriptor = participant.ycBatch ? `YC ${participant.ycBatch}` : participant.category;

  return (
    <section className={`group relative flex min-h-[500px] flex-1 flex-col justify-between overflow-hidden px-6 pb-8 pt-12 transition-opacity md:min-h-[560px] md:px-12 md:pb-12 ${isLeft ? "battle-fighter-left bg-[#ff4f32] text-[#211b18]" : "battle-fighter-right bg-[#d9f75b] text-[#211b18]"} ${isKnockedOut ? "battle-knocked-out" : ""}`}>
      <div className={`pointer-events-none absolute top-0 h-full w-1/2 border-[#211b18]/10 ${isLeft ? "right-0 border-l" : "left-0 border-r"}`} />
      <div className={`relative z-[1] flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.25em] ${isLeft ? "" : "flex-row-reverse"}`}>
        <span className="border-2 border-[#211b18] px-2 py-1">{isLeft ? "01 / challenger" : "02 / challenger"}</span>
        <span className="max-w-[11rem] truncate opacity-60">{isKnockedOut ? "K.O. / recovering" : descriptor}</span>
      </div>

      <div className={`relative z-[1] mt-12 ${isLeft ? "md:pl-4" : "md:pr-4"}`}>
        <div className={`mb-8 flex h-24 w-24 items-center justify-center overflow-hidden border-2 border-[#211b18] bg-[#f8e9d8] shadow-[7px_7px_0_#211b18] md:h-32 md:w-32 ${isLeft ? "" : "ml-auto"}`}>
          <span className="font-mono text-3xl font-bold tracking-[-0.12em]">{initials}</span>
        </div>
        <div className={isLeft ? "" : "text-right"}>
          <h2 className="font-sans text-6xl font-extrabold leading-[0.85] tracking-[-0.09em] md:text-8xl">{participant.name}</h2>
          <p className={`mt-5 max-w-sm text-sm font-semibold leading-relaxed md:text-base ${isLeft ? "" : "ml-auto"}`}>
            {participant.shortDescription || participant.description}
          </p>
        </div>
      </div>

      <div className={`relative z-[1] mt-10 flex items-end justify-between gap-4 ${isLeft ? "" : "flex-row-reverse"}`}>
        <div className={isLeft ? "" : "text-right"}>
          <div className={`font-mono text-7xl font-bold leading-none tracking-[-0.12em] md:text-8xl ${isCompleted && !isWinner ? "opacity-60" : ""}`}>
            {percentage}%
          </div>
          <div className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] opacity-65">
            {votes.toLocaleString()} votes in the arena
          </div>
        </div>
        {isCompleted ? (
          <div className="border-2 border-[#211b18] bg-[#f8e9d8] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em]">
            {isWinner ? "Winner" : "Final result"}
          </div>
        ) : (
          <VoteAction
            participant={participant}
            isSelected={isSelected}
            disclosureAccepted={disclosureAccepted}
            onDisclosureChange={onDisclosureChange}
            onVote={onVote}
            onCancelVote={onCancelVote}
            onConfirm={onConfirm}
            isPending={isPending}
          />
        )}
      </div>
      {isKnockedOut && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span className="rotate-[-8deg] border-4 border-[#211b18] bg-[#f8e9d8] px-5 py-2 font-mono text-2xl font-black uppercase tracking-[0.2em] shadow-[6px_6px_0_#211b18]">K.O.</span>
        </div>
      )}
    </section>
  );
}

function ClashImpact({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`clash-impact pointer-events-none absolute left-1/2 top-1/2 z-30 flex items-center gap-2 font-mono text-sm font-black uppercase tracking-[0.16em] ${side === "left" ? "clash-from-left" : "clash-from-right"}`}
      aria-hidden="true"
    >
      <span className="clash-hit-burst" />
      <Sword className="clash-sword h-14 w-14 rotate-[-25deg] text-[#f8e9d8] drop-shadow-[4px_4px_0_#211b18]" />
      <span className="border-2 border-[#211b18] bg-[#f8e9d8] px-2 py-1 shadow-[3px_3px_0_#211b18]">K.O.!</span>
    </div>
  );
}

function VoteAction({
  participant,
  isSelected,
  disclosureAccepted,
  onDisclosureChange,
  onVote,
  onCancelVote,
  onConfirm,
  isPending,
}: {
  participant: BattleParticipant;
  isSelected: boolean;
  disclosureAccepted: boolean;
  onDisclosureChange: (accepted: boolean) => void;
  onVote: () => void;
  onCancelVote: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  if (isSelected) {
    return (
      <div className="w-full max-w-[18rem] border-2 border-[#211b18] bg-[#f8e9d8] p-3 text-[#211b18] shadow-[5px_5px_0_rgba(33,27,24,0.3)]" aria-live="polite">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.08em]">Back {participant.name}?</p>
          <span className="font-mono text-xs font-bold">$0.99</span>
        </div>
        <label className="mt-3 flex cursor-pointer items-start gap-2 text-[11px] font-semibold leading-snug">
          <input
            type="checkbox"
            checked={disclosureAccepted}
            onChange={(event) => onDisclosureChange(event.target.checked)}
            className="peer sr-only"
          />
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-[#211b18] bg-transparent font-mono text-xs font-black leading-none text-[#211b18] transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#ff4f32] peer-checked:bg-[#ff4f32] peer-checked:after:content-['✓']" aria-hidden="true" />
          <span>Paid community vote — not an investment or endorsement.</span>
        </label>
        <div className="mt-3 flex gap-2">
          <Button
            type="button"
            onClick={onConfirm}
            disabled={!disclosureAccepted || isPending}
            className="h-9 flex-1 rounded-none border-2 border-[#211b18] bg-[#ff4f32] px-2 font-mono text-[10px] font-bold uppercase text-[#211b18] hover:bg-[#d9f75b]"
          >
            {isPending && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
            Continue
          </Button>
          <Button type="button" variant="outline" onClick={onCancelVote} disabled={isPending} className="h-9 rounded-none border-2 border-[#211b18] bg-transparent px-2 font-mono text-[10px] font-bold uppercase">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={onVote}
      aria-label={`Cast a community vote for ${participant.name} for 99 cents`}
      className="h-auto min-h-14 shrink-0 rounded-none border-2 border-[#211b18] bg-[#211b18] px-4 py-3 text-left font-mono text-[11px] font-bold uppercase leading-tight tracking-wider text-[#f8e9d8] shadow-[5px_5px_0_rgba(33,27,24,0.28)] transition-transform hover:-translate-y-1 hover:bg-[#211b18] hover:text-[#d9f75b] md:px-5"
    >
      <Swords className="mr-2 inline h-4 w-4" />
      Back {participant.name}<br />
      $0.99 · K.O. strike
    </Button>
  );
}
