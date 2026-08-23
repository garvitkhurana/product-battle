import { useState } from 'react';
import { useGetPerceptionMap, useListBattles } from '@workspace/api-client-react';
import { Loader2, Map as MapIcon, Maximize2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { addExpandedBattles, getNextComparisonBatch } from '@/lib/expandedQueue';
import { isInvalidPerceptionSessionError, useSessionToken } from '@/lib/session';

export default function EcosystemMap() {
  const [location, setLocation] = useLocation();
  const { data: points, isLoading, error } = useGetPerceptionMap();
  const { data: battles } = useListBattles();
  const { sessionToken, isCreatingSession, retrySession } = useSessionToken();
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [batchMessage, setBatchMessage] = useState<string | null>(null);
  const hasNextBatchIntent = new URLSearchParams(location.split('?')[1] ?? '').get('next') === '1';

  const handleAddBatch = async () => {
    if (!sessionToken || isAddingBatch) return;
    setIsAddingBatch(true);
    setBatchError(null);
    setBatchMessage(null);
    try {
      const nextBatch = await getNextComparisonBatch(sessionToken);
      if (!nextBatch.battles.length) {
        setBatchMessage('You have completed every currently curated comparison. More matchups can be added from the repository next.');
        return;
      }
      addExpandedBattles(sessionToken, nextBatch.battles);
      setLocation('/swipe');
    } catch (error) {
      if (isInvalidPerceptionSessionError(error)) {
        retrySession();
        setBatchError('Your private session expired, so we started a fresh one. Finish its launch queue to add another batch.');
        return;
      }
      setBatchError(error instanceof Error ? error.message : 'We could not prepare another comparison batch.');
    } finally {
      setIsAddingBatch(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-[#f6e5d2]">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff5038]" />
        <p className="font-mono text-sm text-[#625c55] uppercase tracking-widest">Plotting Clusters</p>
      </div>
    );
  }

  if (error || !points) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f6e5d2] p-4">
        <div className="p-8 border-2 border-[#181513] bg-[#fff8ef] text-center space-y-2 shadow-[6px_6px_0_#181513]">
          <p className="font-bold text-[#ff5038]">Topology Error</p>
          <p className="font-mono text-sm text-[#625c55]">Failed to render ecosystem map.</p>
        </div>
      </div>
    );
  }

  // Normalize map bounds based on data
  const minX = Math.min(...points.map(p => p.x)) - 10;
  const maxX = Math.max(...points.map(p => p.x)) + 10;
  const minY = Math.min(...points.map(p => p.y)) - 10;
  const maxY = Math.max(...points.map(p => p.y)) + 10;

  const width = maxX - minX || 100;
  const height = maxY - minY || 100;
  const plottedPoints = points.map((point) => {
    const group = points
      .filter((candidate) => candidate.x === point.x && candidate.y === point.y)
      .sort((a, b) => a.participant.name.localeCompare(b.participant.name));
    const groupIndex = group.findIndex((candidate) => candidate.participant.id === point.participant.id);
    const angle = group.length > 1 ? (Math.PI * 2 * groupIndex) / group.length : 0;
    const radius = group.length > 1 ? Math.min(4.5, 1.8 + group.length * 0.38) : 0;
    const left = ((point.x - minX) / width) * 100 + Math.cos(angle) * radius;
    const top = ((point.y - minY) / height) * 100 + Math.sin(angle) * radius;
    return { point, left, top };
  });
  const pointPositions = new Map(
    plottedPoints.map(({ point, left, top }) => [point.participant.id, { left, top }]),
  );
  const activeBattles = (battles ?? []).filter((battle) => battle.status === 'active');
  const comparisonNumberByParticipantId = new Map(
    activeBattles.flatMap((battle, index) => [
      [battle.participantA.id, index + 1] as const,
      [battle.participantB.id, index + 1] as const,
    ]),
  );

  return (
    <div className="flex-1 bg-[#f6e5d2] px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col">
        <header className="flex flex-col justify-between gap-5 border-b-2 border-[#181513] pb-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5038]">Public context / launch cohort</p>
            <h1 className="mt-2 flex items-center gap-2 text-4xl font-bold tracking-[-0.05em] md:text-6xl">
              <MapIcon className="h-7 w-7 text-[#181513] md:h-9 md:w-9" /> Ecosystem Map
            </h1>
            <p className="mt-4 font-mono text-xs leading-relaxed text-[#625c55]">
              Context from curated company descriptions. These coordinates are not community rankings; confidence emerges only from independent comparisons.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-[#625c55]">Point color = sector context</p>
            <div className="flex flex-wrap justify-end gap-2">
              <div className="flex items-center gap-2 border-2 border-[#181513] bg-[#ff5038] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.13em]">
                <span className="h-2 w-2 bg-[#181513]" /> Infrastructure / B2B
              </div>
              <div className="flex items-center gap-2 border-2 border-[#181513] bg-[#d7ff45] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.13em]">
                <span className="h-2 w-2 bg-[#181513]" /> Consumer / marketplace
              </div>
            </div>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-4 border-2 border-[#181513] bg-[#fff8ef] p-4 md:p-6">
          <div className="grid gap-3 border-b border-[#181513]/25 pb-4 font-mono text-[11px] uppercase tracking-[0.11em] text-[#625c55] sm:grid-cols-2">
            <div>
              <span className="font-bold text-[#181513]">Vertical read</span>
              <span className="ml-1">Top: YC challenger · Bottom: established incumbent</span>
            </div>
            <div>
              <span className="font-bold text-[#181513]">Horizontal read</span>
              <span className="ml-1">Left: infrastructure / B2B · Right: consumer / marketplace</span>
            </div>
          </div>
          <div className="relative min-h-[470px] w-full overflow-hidden md:min-h-[540px]">
        {points.length === 0 ? (
          <div className="flex h-full items-center justify-center font-mono text-sm text-[#625c55]">Awaiting coordinates.</div>
        ) : (
          <div className="relative h-full min-h-[420px] w-full border border-[#181513]/25 md:min-h-[480px]">
            {/* Grid overlay */}
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'linear-gradient(rgba(24,21,19,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(24,21,19,0.10) 1px, transparent 1px)',
              backgroundSize: '40px 40px' 
            }} />

            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {activeBattles.map((battle) => {
                const start = pointPositions.get(battle.participantA.id);
                const end = pointPositions.get(battle.participantB.id);
                if (!start || !end) return null;
                return (
                  <line
                    key={battle.id}
                    x1={start.left}
                    y1={start.top}
                    x2={end.left}
                    y2={end.top}
                    stroke="#181513"
                    strokeDasharray="1.2 1.2"
                    strokeWidth="0.22"
                    opacity="0.28"
                  />
                );
              })}
            </svg>

            <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2 border border-[#181513] bg-[#fff8ef] px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]">YC challenger</div>
            <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 border border-[#181513] bg-[#fff8ef] px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]">Established incumbent</div>
            <div className="absolute left-2 top-3 z-10 hidden border border-[#181513] bg-[#fff8ef] px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.1em] md:block">← Infra / B2B</div>
            <div className="absolute right-2 top-3 z-10 hidden border border-[#181513] bg-[#fff8ef] px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.1em] md:block">Consumer / marketplace →</div>

            {plottedPoints.map(({ point, left, top }) => {
              const isLowConfidence = point.confidence < 40;
              const isConsumer = /consumer|food|travel|marketplace|media|retail/i.test(point.cluster);
              const colorClass = isConsumer ? 'bg-[#d7ff45]' : 'bg-[#ff5038]';
              const comparisonNumber = comparisonNumberByParticipantId.get(point.participant.id);

              return (
                <button
                  key={point.participant.id}
                  onClick={() => setLocation(`/companies/${point.participant.slug}`)}
                  aria-label={`Open ${point.participant.name}`}
                  className={`absolute group -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#181513] ${isLowConfidence ? 'opacity-40 hover:opacity-100' : 'opacity-90 hover:opacity-100'}`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <div className={`flex h-5 min-w-5 items-center justify-center border border-[#181513] px-1 font-mono text-[9px] font-bold text-[#181513] shadow-[2px_2px_0_rgba(24,21,19,0.35)] transition-transform group-hover:scale-125 ${colorClass}`}>
                    {comparisonNumber ? String(comparisonNumber).padStart(2, '0') : '·'}
                  </div>
                </button>
              );
            })}
          </div>
        )}
        </div>
          <p className="flex items-center gap-2 font-mono text-[10px] leading-relaxed text-[#625c55]">
            <Maximize2 className="h-4 w-4 shrink-0 text-[#181513]" />
            Dashed lines connect companies in the active comparison queue. Match each line to its numbered pair below; distance is editorial context, not a score.
          </p>
        </div>
        <section className="mt-5 border-2 border-[#181513] bg-[#fff8ef] p-4 md:p-5" aria-labelledby="comparison-key-title">
          <div className="flex flex-col justify-between gap-2 border-b border-[#181513]/25 pb-3 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff5038]">Map key</p>
              <h2 id="comparison-key-title" className="mt-1 text-2xl font-bold tracking-[-0.04em]">Active comparison pairs</h2>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#625c55]">Numbered points match these pairs</p>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {activeBattles.map((battle, index) => {
              const isConsumerA = /consumer|food|travel|marketplace|media|retail/i.test(battle.participantA.category);
              const isConsumerB = /consumer|food|travel|marketplace|media|retail/i.test(battle.participantB.category);
              return (
                <div key={battle.id} className="flex min-w-0 items-center gap-2 border border-[#181513]/35 p-2.5">
                  <span className="flex h-6 w-7 shrink-0 items-center justify-center bg-[#181513] font-mono text-[10px] font-bold text-[#fff8ef]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLocation(`/companies/${battle.participantA.slug}`)}
                    className={`min-w-0 truncate border border-[#181513] px-2 py-1 text-left font-mono text-[10px] font-bold uppercase tracking-[0.06em] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181513] ${isConsumerA ? 'bg-[#d7ff45]' : 'bg-[#ff5038]'}`}
                  >
                    {battle.participantA.name}
                  </button>
                  <span className="shrink-0 font-mono text-[10px] font-bold text-[#625c55]">vs</span>
                  <button
                    type="button"
                    onClick={() => setLocation(`/companies/${battle.participantB.slug}`)}
                    className={`min-w-0 truncate border border-[#181513] px-2 py-1 text-left font-mono text-[10px] font-bold uppercase tracking-[0.06em] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181513] ${isConsumerB ? 'bg-[#d7ff45]' : 'bg-[#ff5038]'}`}
                  >
                    {battle.participantB.name}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
        <section className={`mt-5 border-2 border-[#181513] p-5 md:p-6 ${hasNextBatchIntent ? 'bg-[#d7ff45]' : 'bg-[#fff8ef]'}`}>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff5038]">Continue your private queue</p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-[-0.04em]">Add the next ten ecosystem comparisons.</h2>
              <p className="mt-2 font-mono text-xs leading-relaxed text-[#625c55]">
                Finish the current cohort first, then this adds the next curated batch to your existing Taste DNA session. Your completed signals stay intact.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddBatch}
              disabled={!sessionToken || isCreatingSession || isAddingBatch}
              className="shrink-0 bg-[#181513] px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[#fff8ef] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAddingBatch ? 'Preparing batch…' : isCreatingSession ? 'Preparing session…' : 'Add next batch'}
            </button>
          </div>
          {batchError && <p className="mt-4 font-mono text-xs text-[#ff5038]">{batchError}</p>}
          {batchMessage && <p className="mt-4 font-mono text-xs text-[#625c55]">{batchMessage}</p>}
        </section>
        <section className="mt-5 border-2 border-[#181513] bg-[#fff8ef] p-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#625c55]">Companies in this cohort</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {points
              .slice()
              .sort((a, b) => a.participant.name.localeCompare(b.participant.name))
              .map((point) => {
                const isConsumer = /consumer|food|travel|marketplace|media|retail/i.test(point.cluster);
                return (
                  <button
                    key={point.participant.id}
                    type="button"
                    onClick={() => setLocation(`/companies/${point.participant.slug}`)}
                    className={`border border-[#181513] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181513] ${
                      isConsumer ? 'bg-[#d7ff45]' : 'bg-[#ff5038]'
                    }`}
                  >
                    {point.participant.name}
                  </button>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}
