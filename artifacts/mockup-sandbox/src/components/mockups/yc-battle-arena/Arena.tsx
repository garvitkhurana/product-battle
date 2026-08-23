import './_group.css';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Sword,
  Swords,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Participant {
  id: string;
  name: string;
  imageUrl?: string;
  batch?: string;
  description: string;
}

const airbnb: Participant = {
  id: 'airbnb',
  name: 'Airbnb',
  batch: 'W09',
  description: "The world's largest home-sharing marketplace connecting hosts and guests in 220+ countries.",
};

const vrbo: Participant = {
  id: 'vrbo',
  name: 'Vrbo',
  batch: 'EST. 1995',
  description: 'Vacation rental platform focused on whole-home stays for families and groups.',
};

function ScoreRail({ left, right }: { left: number; right: number }) {
  return (
    <div className="relative mx-auto w-full max-w-5xl px-5 md:px-8">
      <div className="flex items-end justify-between font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#211b18]/60">
        <span>Airbnb <b className="text-[#211b18]">{left}%</b></span>
        <span><b className="text-[#211b18]">{right}%</b> Vrbo</span>
      </div>
      <div className="mt-3 flex h-5 gap-1 overflow-hidden rounded-sm border-2 border-[#211b18] bg-[#211b18]">
        <div className="relative bg-[#ff4f32] transition-[width] duration-700 ease-out" style={{ width: `${left}%` }}>
          <span className="absolute inset-y-0 right-3 flex items-center font-mono text-[10px] font-bold text-[#211b18]">LEAD</span>
        </div>
        <div className="bg-[#d9f75b] transition-[width] duration-700 ease-out" style={{ width: `${right}%` }} />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-[#211b18]/55">
        <span>1,438 votes</span>
        <span>2,320 total votes</span>
        <span>882 votes</span>
      </div>
    </div>
  );
}

function Fighter({
  participant,
  percentage,
  votes,
  side,
  onVote,
  hasVoted,
  isSelected,
  isKnockedOut,
  accepted,
  submitting,
  onAccept,
  onCancel,
  onConfirm,
}: {
  participant: Participant;
  percentage: number;
  votes: number;
  side: 'left' | 'right';
  onVote: () => void;
  hasVoted: boolean;
  isSelected: boolean;
  isKnockedOut: boolean;
  accepted: boolean;
  submitting: boolean;
  onAccept: (accepted: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const isLeft = side === 'left';
  return (
    <section className={`group relative flex min-h-[500px] flex-1 flex-col justify-between overflow-hidden px-6 pb-8 pt-12 transition-opacity md:min-h-[560px] md:px-12 md:pb-12 ${isLeft ? 'arena-fighter-left bg-[#ff4f32] text-[#211b18]' : 'arena-fighter-right bg-[#d9f75b] text-[#211b18]'} ${isKnockedOut ? 'arena-knocked-out' : ''}`}>
      <div className={`pointer-events-none absolute top-0 h-full w-1/2 border-[#211b18]/10 ${isLeft ? 'right-0 border-l' : 'left-0 border-r'}`} />
      <div className={`relative z-[1] flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.25em] ${isLeft ? '' : 'flex-row-reverse'}`}>
        <span className="border-2 border-[#211b18] px-2 py-1">{isLeft ? '01 / challenger' : '02 / challenger'}</span>
        <span className="opacity-60">{isKnockedOut ? 'Eliminated' : isLeft ? 'Founded 2008' : 'Founded 1995'}</span>
      </div>

      <div className={`relative z-[1] mt-12 ${isLeft ? 'md:pl-4' : 'md:pr-4'}`}>
        <div className={`mb-8 flex h-24 w-24 items-center justify-center overflow-hidden border-2 border-[#211b18] bg-[#f8e9d8] shadow-[7px_7px_0_#211b18] md:h-32 md:w-32 ${isLeft ? '' : 'ml-auto'}`}>
          <span className="arena-mark font-mono text-3xl font-bold tracking-[-0.12em]">
            {participant.name === 'Airbnb' ? 'A' : 'VR'}
          </span>
        </div>
        <div className={isLeft ? '' : 'text-right'}>
          <h2 className="font-['Plus_Jakarta_Sans'] text-6xl font-extrabold leading-[0.85] tracking-[-0.09em] md:text-8xl">{participant.name}</h2>
          <p className="mt-5 max-w-sm text-sm font-semibold leading-relaxed md:text-base">{participant.description}</p>
        </div>
      </div>

      <div className={`relative z-[1] mt-10 flex items-end justify-between gap-4 ${isLeft ? '' : 'flex-row-reverse'}`}>
        <div className={isLeft ? '' : 'text-right'}>
          <div className="font-['Space_Mono'] text-7xl font-bold leading-none tracking-[-0.12em] md:text-8xl">{percentage}%</div>
          <div className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] opacity-65">{votes.toLocaleString()} votes in the arena</div>
        </div>
        {isSelected ? (
          <VoteConfirm
            participant={participant}
            accepted={accepted}
            submitting={submitting}
            onAccept={onAccept}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        ) : (
          <Button
            onClick={onVote}
            disabled={hasVoted}
            aria-label={`Back ${participant.name} for 99 cents`}
            className="h-auto min-h-14 shrink-0 rounded-none border-2 border-[#211b18] bg-[#211b18] px-4 py-3 text-left font-mono text-[11px] font-bold uppercase leading-tight tracking-wider text-[#f8e9d8] shadow-[5px_5px_0_rgba(33,27,24,0.28)] transition-transform hover:-translate-y-1 hover:bg-[#211b18] hover:text-[#d9f75b] disabled:opacity-100 md:px-5"
          >
            {hasVoted ? <Check className="mr-2 inline h-4 w-4" /> : <Swords className="mr-2 inline h-4 w-4" />}
            {hasVoted ? 'Vote placed' : <>Back {participant.name}<br />$0.99 / one vote</>}
          </Button>
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

function VoteConfirm({
  participant,
  accepted,
  submitting,
  onAccept,
  onCancel,
  onConfirm,
}: {
  participant: Participant;
  accepted: boolean;
  submitting: boolean;
  onAccept: (accepted: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="w-full max-w-[18rem] border-2 border-[#211b18] bg-[#f8e9d8] p-3 text-[#211b18] shadow-[5px_5px_0_rgba(33,27,24,0.3)]" aria-live="polite">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.08em]">Back {participant.name}?</p>
        <span className="font-mono text-xs font-bold">$0.99</span>
      </div>
      <label className="mt-2 flex cursor-pointer items-start gap-2 text-[10px] font-semibold leading-snug">
        <input type="checkbox" checked={accepted} onChange={(event) => onAccept(event.target.checked)} className="peer sr-only" />
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-[#211b18] bg-transparent font-mono text-xs font-black leading-none text-[#211b18] transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#ff4f32] peer-checked:bg-[#ff4f32] peer-checked:after:content-['✓']" aria-hidden="true" />
        <span>Paid community vote — not an investment or endorsement.</span>
      </label>
      <div className="mt-3 flex gap-2">
        <Button type="button" onClick={onConfirm} disabled={!accepted || submitting} className="h-8 flex-1 rounded-none border-2 border-[#211b18] bg-[#ff4f32] px-2 font-mono text-[9px] font-bold uppercase text-[#211b18] hover:bg-[#d9f75b]">
          {submitting && <Loader2 className="mr-1 h-3 w-3 animate-spin" />} Continue
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting} className="h-8 rounded-none border-2 border-[#211b18] bg-transparent px-2 font-mono text-[9px] font-bold uppercase">Cancel</Button>
      </div>
    </div>
  );
}

function ClashImpact({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`arena-clash pointer-events-none absolute left-1/2 top-1/2 z-30 flex items-center gap-2 font-mono text-sm font-black uppercase tracking-[0.16em] ${side === 'left' ? 'arena-clash-from-left' : 'arena-clash-from-right'}`} aria-hidden="true">
      <span className="arena-hit-burst" />
      <Sword className="arena-clash-sword h-14 w-14 rotate-[-25deg] text-[#f8e9d8] drop-shadow-[4px_4px_0_#211b18]" />
      <span className="border-2 border-[#211b18] bg-[#f8e9d8] px-2 py-1 shadow-[3px_3px_0_#211b18]">K.O.!</span>
    </div>
  );
}

export function Arena() {
  const [voteParticipant, setVoteParticipant] = useState<Participant | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [votedParticipantId, setVotedParticipantId] = useState<string | null>(null);
  const [impactParticipantId, setImpactParticipantId] = useState<string | null>(null);
  const [knockedOutParticipantId, setKnockedOutParticipantId] = useState<string | null>(null);
  const impactTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (impactTimer.current) window.clearTimeout(impactTimer.current);
  }, []);

  const confirmVote = () => {
    if (!voteParticipant || !accepted) return;
    setSubmitting(true);
    const opponent = voteParticipant.id === airbnb.id ? vrbo.id : airbnb.id;
    setImpactParticipantId(voteParticipant.id);
    setKnockedOutParticipantId(opponent);
    window.setTimeout(() => {
      setSubmitting(false);
      setVotedParticipantId(voteParticipant.id);
      setVoteParticipant(null);
      impactTimer.current = window.setTimeout(() => {
        setImpactParticipantId(null);
      }, 900);
    }, 1100);
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#f8e9d8] text-[#211b18]" style={{ fontFamily: 'var(--app-font-sans, sans-serif)' }}>
      <header className="border-b-2 border-[#f8e9d8]/20 bg-[#211b18] px-5 py-5 text-[#f8e9d8] md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button onClick={() => window.history.back()} className="group inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f8e9d8]/65 transition-colors hover:text-[#d9f75b]">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> All battles
          </button>
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#d9f75b]" /> Live now
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-5 pb-4 pt-12 md:px-10 md:pt-16">
        <div className="absolute right-4 top-3 hidden select-none font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-[#211b18]/35 md:block">YC BATTLE / FIELD 07</div>
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="mb-5 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#ff4f32]"><Zap className="h-4 w-4 fill-current" /> Head-to-head matchup</p>
            <h1 className="max-w-3xl font-['Plus_Jakarta_Sans'] text-5xl font-extrabold leading-[0.88] tracking-[-0.09em] md:text-8xl">Airbnb <span className="text-[#ff4f32]">vs.</span><br /> Vrbo</h1>
            <p className="mt-7 max-w-xl text-base font-semibold leading-relaxed text-[#211b18]/70 md:text-lg">Which short-term rental platform deserves your community vote?</p>
          </div>
          <div className="hidden shrink-0 border-2 border-[#211b18] p-3 md:block">
            <div className="flex h-14 w-14 items-center justify-center bg-[#ff4f32] font-mono text-xl font-bold italic">VS</div>
          </div>
        </div>
        <div className="mt-12"><ScoreRail left={62} right={38} /></div>
      </div>

      <div className="relative mx-auto mt-5 flex max-w-6xl flex-col border-y-2 border-[#211b18] md:flex-row">
        {impactParticipantId && <ClashImpact side={impactParticipantId === airbnb.id ? 'left' : 'right'} />}
        <Fighter participant={airbnb} percentage={62} votes={1438} side="left" onVote={() => { setAccepted(false); setVoteParticipant(airbnb); }} hasVoted={votedParticipantId === airbnb.id} isSelected={voteParticipant?.id === airbnb.id} isKnockedOut={knockedOutParticipantId === airbnb.id} accepted={accepted} submitting={submitting} onAccept={setAccepted} onCancel={() => setVoteParticipant(null)} onConfirm={confirmVote} />
        <div className="relative z-20 -my-5 flex h-10 items-center justify-center self-center border-2 border-[#211b18] bg-[#f8e9d8] px-3 font-mono text-xs font-bold italic md:-mx-5 md:my-0 md:h-auto md:w-10 md:flex-col md:px-0">
          <span className="relative z-10">VS</span>
          <svg className="arena-energy pointer-events-none absolute -inset-x-7 top-1/2 h-44 w-20 -translate-y-1/2 overflow-visible md:-inset-x-8 md:h-64 md:w-24" viewBox="0 0 80 240" fill="none" aria-hidden="true">
            <path d="M39 2 29 39l17 8-20 44 14 7-21 51 19 10-12 45 15 34" stroke="#ff4f32" strokeWidth="3" strokeLinecap="round" />
            <path d="m42 4 10 36-14 12 17 35-14 11 17 42-13 9 10 42-16 42" stroke="#d9f75b" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="arena-spark absolute -left-5 top-1/2 h-2 w-2 rounded-full bg-[#ff4f32]" aria-hidden="true" />
          <span className="arena-spark arena-spark-delay absolute -right-5 top-1/2 h-2 w-2 rounded-full bg-[#d9f75b]" aria-hidden="true" />
        </div>
        <Fighter participant={vrbo} percentage={38} votes={882} side="right" onVote={() => { setAccepted(false); setVoteParticipant(vrbo); }} hasVoted={votedParticipantId === vrbo.id} isSelected={voteParticipant?.id === vrbo.id} isKnockedOut={knockedOutParticipantId === vrbo.id} accepted={accepted} submitting={submitting} onAccept={setAccepted} onCancel={() => setVoteParticipant(null)} onConfirm={confirmVote} />
      </div>

      <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-[#211b18]/60 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em]"><ShieldCheck className="h-4 w-4" /> One vote per payment · $0.99 · no refunds</p>
        <button onClick={() => window.alert('Votes are community sentiment, not investment advice.')} className="flex items-center gap-1 self-start font-mono text-[10px] font-bold uppercase tracking-[0.12em] underline underline-offset-4 hover:text-[#ff4f32] md:self-auto">How this works <ChevronRight className="h-3 w-3" /></button>
      </footer>

    </main>
  );
}