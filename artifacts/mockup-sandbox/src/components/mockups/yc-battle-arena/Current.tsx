import './_group.css';
import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Info, Loader2, ShieldAlert, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ---------------------------------------------------------------------------
// Static mock data – Airbnb vs Vrbo
// ---------------------------------------------------------------------------

interface BattleParticipant {
  id: string;
  name: string;
  imageUrl: string;
  ycBatch: string;
  shortDescription: string;
}

interface Battle {
  id: string;
  title: string;
  description: string;
  status: 'live' | 'completed';
  participantA: BattleParticipant;
  participantB: BattleParticipant;
  participantAPercentage: number;
  participantBPercentage: number;
  participantAVotes: number;
  participantBVotes: number;
}

const MOCK_BATTLE: Battle = {
  id: 'airbnb-vs-vrbo',
  title: 'Airbnb vs. Vrbo',
  description: 'Which short-term rental platform deserves your community vote?',
  status: 'live',
  participantA: {
    id: 'airbnb',
    name: 'Airbnb',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png',
    ycBatch: 'W09',
    shortDescription:
      'The world\'s largest home-sharing marketplace connecting hosts and guests in 220+ countries.',
  },
  participantB: {
    id: 'vrbo',
    name: 'Vrbo',
    imageUrl: '',
    ycBatch: '',
    shortDescription:
      'Vacation rental platform focused on whole-home rentals for families and groups.',
  },
  participantAPercentage: 62,
  participantBPercentage: 38,
  participantAVotes: 1438,
  participantBVotes: 882,
};

// ---------------------------------------------------------------------------
// Sub-components (inlined from the source)
// ---------------------------------------------------------------------------

function ParticipantView({
  participant,
  percentage,
  votes,
  isCompleted,
  isWinner,
}: {
  participant: BattleParticipant;
  percentage: number;
  votes: number;
  isCompleted: boolean;
  isWinner: boolean;
}) {
  return (
    <>
      <div
        className={`w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 bg-muted mb-6 shadow-xl ${
          isCompleted && isWinner ? 'border-primary shadow-primary/20' : 'border-border'
        }`}
      >
        {participant.imageUrl ? (
          <img
            src={participant.imageUrl}
            alt={participant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-black text-5xl text-muted-foreground bg-muted">
            {participant.name.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <h2 className="text-3xl md:text-4xl font-extrabold mb-3">{participant.name}</h2>
      {participant.ycBatch && (
        <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
          {participant.ycBatch}
        </span>
      )}
      <p className="text-muted-foreground max-w-sm mb-6 text-lg">
        {participant.shortDescription}
      </p>

      {isCompleted ? (
        <div className="mt-auto">
          <div
            className={`text-6xl md:text-8xl font-black tracking-tighter ${
              isWinner ? 'text-primary' : 'text-muted-foreground opacity-50'
            }`}
          >
            {percentage}%
          </div>
          <div className="text-muted-foreground font-mono font-bold mt-2 uppercase tracking-widest">
            {votes} Votes
          </div>
        </div>
      ) : null}
      {!isCompleted ? (
        <div className="mt-auto rounded-xl border bg-card/80 px-5 py-4 shadow-sm">
          <div className="text-4xl font-black tracking-tighter text-foreground">{percentage}%</div>
          <div className="mt-1 text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
            {votes} {votes === 1 ? 'vote' : 'votes'} so far
          </div>
        </div>
      ) : null}
    </>
  );
}

function VoteAction({
  participant,
  battleStatus,
  hasVoted,
  onVote,
}: {
  participant: BattleParticipant;
  battleStatus: string;
  hasVoted: boolean;
  onVote: () => void;
}) {
  if (battleStatus === 'completed') {
    return null;
  }

  if (hasVoted) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-6 py-4 font-bold text-primary">
        <CheckCircle2 className="h-5 w-5" />
        Vote recorded
      </div>
    );
  }

  return (
    <Button
      size="lg"
      onClick={onVote}
      className="h-14 px-8 text-lg font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_hsl(var(--primary))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_hsl(var(--primary))]"
    >
      <Swords className="mr-2 h-5 w-5" />
      Back {participant.name} · $0.99
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function Current() {
  const battle = MOCK_BATTLE;
  const [voteParticipant, setVoteParticipant] = useState<BattleParticipant | null>(null);
  const [disclosureAccepted, setDisclosureAccepted] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCompleted = battle.status === 'completed';
  const aWins = battle.participantAPercentage > battle.participantBPercentage;
  const bWins = battle.participantBPercentage > battle.participantAPercentage;

  const openVoteDialog = (participant: BattleParticipant) => {
    setVoteParticipant(participant);
    setDisclosureAccepted(false);
  };

  const confirmVote = () => {
    if (!voteParticipant || !disclosureAccepted) return;
    setIsSubmitting(true);
    // Simulate checkout redirect with a short delay then mark voted
    setTimeout(() => {
      setIsSubmitting(false);
      setHasVoted(true);
      setVoteParticipant(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--app-font-sans, sans-serif)' }}>
      {/* Header */}
      <header className="border-b bg-zinc-950 text-zinc-50 py-8 px-4">
        <div className="container mx-auto">
          <a
            href="#"
            className="inline-flex items-center text-sm font-bold text-zinc-400 hover:text-zinc-100 transition-colors mb-6 uppercase tracking-wider"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> All Battles
          </a>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              {isCompleted ? 'Completed Battle' : 'Live Battle'}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 leading-tight uppercase">
              {battle.title}
            </h1>
            <p className="text-zinc-400 font-mono text-lg">{battle.description}</p>
          </div>
        </div>
      </header>

      {/* Split Screen Container */}
      <div className="flex-1 flex flex-col md:flex-row relative">

        {/* VS Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="bg-primary text-primary-foreground border-4 border-background h-16 w-16 md:h-24 md:w-24 rounded-full flex items-center justify-center shadow-xl">
            <span className="font-black text-xl md:text-3xl italic">VS</span>
          </div>
          {isCompleted && (
            <div className="mt-4 bg-background border-2 border-border px-4 py-2 rounded-full font-bold shadow-lg whitespace-nowrap">
              Final Results
            </div>
          )}
        </div>

        {/* Participant A */}
        <div
          className={`flex-1 p-6 md:p-12 flex flex-col items-center text-center justify-center min-h-[50vh] transition-colors ${
            isCompleted && aWins ? 'bg-primary/5' : 'bg-background'
          }`}
        >
          <ParticipantView
            participant={battle.participantA}
            percentage={battle.participantAPercentage}
            votes={battle.participantAVotes}
            isCompleted={isCompleted}
            isWinner={aWins}
          />
          <div className="mt-8">
            <VoteAction
              participant={battle.participantA}
              battleStatus={battle.status}
              hasVoted={hasVoted}
              onVote={() => openVoteDialog(battle.participantA)}
            />
          </div>
        </div>

        <div className="h-px w-full md:w-px md:h-full bg-border" />

        {/* Participant B */}
        <div
          className={`flex-1 p-6 md:p-12 flex flex-col items-center text-center justify-center min-h-[50vh] transition-colors ${
            isCompleted && bWins ? 'bg-primary/5' : 'bg-zinc-50 dark:bg-zinc-900/50'
          }`}
        >
          <ParticipantView
            participant={battle.participantB}
            percentage={battle.participantBPercentage}
            votes={battle.participantBVotes}
            isCompleted={isCompleted}
            isWinner={bWins}
          />
          <div className="mt-8">
            <VoteAction
              participant={battle.participantB}
              battleStatus={battle.status}
              hasVoted={hasVoted}
              onVote={() => openVoteDialog(battle.participantB)}
            />
          </div>
        </div>
      </div>

      {/* Vote Dialog */}
      <Dialog open={Boolean(voteParticipant)} onOpenChange={(open) => !open && setVoteParticipant(null)}>
        <DialogContent className="sm:max-w-md border-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
              Back {voteParticipant?.name}
            </DialogTitle>
            <DialogDescription className="text-base">
              Place one paid community vote in {battle.title}.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-3 font-bold text-primary">
              <Info className="h-5 w-5 shrink-0" />
              Before you pay
            </div>
            <ul className="ml-8 list-disc space-y-2 text-sm text-muted-foreground">
              <li>This is a $0.99 community battle vote.</li>
              <li>Votes are non-refundable and limited to one per user per battle.</li>
              <li>
                This is not investment advice, a YC endorsement, a securities transaction, or a
                performance guarantee.
              </li>
            </ul>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-card p-3 text-sm font-medium">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 accent-primary"
              checked={disclosureAccepted}
              onChange={(e) => setDisclosureAccepted(e.target.checked)}
            />
            <span>I accept the disclosure and agree to pay $0.99.</span>
          </label>

          <DialogFooter className="mt-6 flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setVoteParticipant(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmVote}
              disabled={!disclosureAccepted || isSubmitting}
              className="font-bold"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue to secure checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
