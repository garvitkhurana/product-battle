import { useMemo } from 'react';
import { useGetPerceptionMap, useListBattles } from '@workspace/api-client-react';
import { Copy, Loader2, Map as MapIcon, MessageCircle, Share2 } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { CompanyMark } from '@/components/CompanyMark';
import { AddNextBatchCta } from '@/components/AddNextBatchCta';
import { Seo } from '@/components/Seo';

const REGION_COLORS = ['#ff5038', '#d7ff45', '#8f5cff', '#57c3ff', '#ffb347', '#7ddea2'];

export default function EcosystemMap() {
  const [location] = useLocation();
  const { data: points, isLoading, error } = useGetPerceptionMap();
  const { data: battles } = useListBattles();
  const { toast } = useToast();
  const hasNextBatchIntent = new URLSearchParams(location.split('?')[1] ?? '').get('next') === '1';

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/card/map`
      : 'https://ycbattle.com/api/card/map';

  const regions = useMemo(() => {
    const names = [...new Set((points ?? []).map((point) => point.cluster))];
    return names.sort();
  }, [points]);

  const regionColor = useMemo(() => {
    const map = new Map<string, string>();
    regions.forEach((region, index) => map.set(region, REGION_COLORS[index % REGION_COLORS.length]!));
    return map;
  }, [regions]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-[#f6e5d2]">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff5038]" />
        <p className="font-mono text-sm text-[#625c55] uppercase tracking-widest">Charting territories</p>
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

  const minX = Math.min(...points.map((p) => p.x), -1) - 8;
  const maxX = Math.max(...points.map((p) => p.x), 1) + 8;
  const minY = Math.min(...points.map((p) => p.y), -1) - 8;
  const maxY = Math.max(...points.map((p) => p.y), 1) + 8;
  const width = maxX - minX || 100;
  const height = maxY - minY || 100;

  const plottedPoints = (() => {
    const items = points.map((point) => ({
      point,
      left: ((point.x - minX) / width) * 100,
      top: ((point.y - minY) / height) * 100,
      size: point.confidence >= 60 ? ('md' as const) : ('sm' as const),
    }));
    // Screen-space collision: keep logo footprints from stacking after % projection.
    const minPct = 7;
    for (let iter = 0; iter < 30; iter++) {
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i]!;
          const b = items[j]!;
          const dx = b.left - a.left;
          const dy = b.top - a.top;
          const dist = Math.hypot(dx, dy) || 0.01;
          if (dist >= minPct) continue;
          const push = ((minPct - dist) / dist) * 0.45;
          a.left = Math.min(96, Math.max(4, a.left - dx * push));
          a.top = Math.min(96, Math.max(4, a.top - dy * push));
          b.left = Math.min(96, Math.max(4, b.left + dx * push));
          b.top = Math.min(96, Math.max(4, b.top + dy * push));
        }
      }
    }
    return items;
  })();
  const pointPositions = new Map(
    plottedPoints.map(({ point, left, top }) => [point.participant.id, { left, top }]),
  );
  const activeBattles = (battles ?? []).filter((battle) => battle.status === 'active');

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: 'Link copied', description: 'Map share card URL is on your clipboard.' });
    } catch {
      toast({ title: 'Copy failed', description: 'Copy the URL manually.', variant: 'destructive' });
    }
  };

  const shareText = 'Map of the YC ecosystem — territories from co-voting and word overlap on YC Battle.';

  const shareMap = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const shareMapOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <>
      <Seo
        title="YC Ecosystem Map — Company Perception | YC Battle"
        description="Explore how YC companies cluster by co-voting affinity and word overlap in the YC Battle ecosystem map."
        path="/map"
        imagePath="/api/og/map.png"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'YC Ecosystem Map',
          url: 'https://ycbattle.com/map',
          isPartOf: { '@id': 'https://ycbattle.com/#website' },
        }}
      />
      <div className="flex-1 bg-[#f6e5d2] px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col">
        <header className="flex flex-col justify-between gap-5 border-b-2 border-[#181513] pb-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5038]">Territory map v2</p>
            <h1 className="mt-2 flex items-center gap-2 text-4xl font-bold tracking-[-0.05em] md:text-6xl">
              <MapIcon className="h-7 w-7 text-[#181513] md:h-9 md:w-9" /> Ecosystem territories
            </h1>
            <p className="mt-4 font-mono text-xs leading-relaxed text-[#625c55]">
              Companies cluster by co-voting affinity and word overlap. Region names are derived from sector gravity; point size tracks signal volume.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 border-2 border-[#181513] bg-[#fff8ef] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy link
            </button>
            <button
              type="button"
              onClick={shareMap}
              className="inline-flex items-center gap-2 border-2 border-[#181513] bg-[#181513] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#fff8ef]"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share map
            </button>
            <button
              type="button"
              onClick={shareMapOnWhatsApp}
              className="inline-flex items-center gap-2 border-2 border-[#181513] bg-[#d7ff45] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </button>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap gap-2">
          {regions.map((region) => (
            <span
              key={region}
              className="border-2 border-[#181513] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{ backgroundColor: regionColor.get(region) }}
            >
              {region}
            </span>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 border-2 border-[#181513] bg-[#fff8ef] p-4 md:p-6">
          <div className="relative min-h-[470px] w-full overflow-hidden md:min-h-[560px]">
            {points.length === 0 ? (
              <div className="flex h-full items-center justify-center font-mono text-sm text-[#625c55]">
                Awaiting territory signals.
              </div>
            ) : (
              <div className="relative h-full min-h-[420px] w-full border border-[#181513]/25 md:min-h-[520px]">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 20% 30%, rgba(255,80,56,0.08), transparent 40%), radial-gradient(circle at 75% 65%, rgba(215,255,69,0.12), transparent 45%), linear-gradient(rgba(24,21,19,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(24,21,19,0.06) 1px, transparent 1px)',
                    backgroundSize: 'auto, auto, 48px 48px, 48px 48px',
                  }}
                />

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
                        strokeDasharray="1.1 1.4"
                        strokeWidth="0.28"
                        opacity="0.35"
                      />
                    );
                  })}
                </svg>

                {regions.map((region) => {
                  const members = plottedPoints.filter(({ point }) => point.cluster === region);
                  if (!members.length) return null;
                  const cx = members.reduce((sum, item) => sum + item.left, 0) / members.length;
                  const cy = members.reduce((sum, item) => sum + item.top, 0) / members.length;
                  return (
                    <div
                      key={`label-${region}`}
                      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 border border-[#181513] bg-[#fff8ef]/90 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]"
                      style={{ left: `${cx}%`, top: `${Math.max(6, cy - 8)}%` }}
                    >
                      {region}
                    </div>
                  );
                })}

                {plottedPoints.map(({ point, left, top, size }) => (
                  <Link
                    key={point.participant.id}
                    href={`/companies/${point.participant.slug}`}
                    aria-label={`Open ${point.participant.name}`}
                    className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#181513]"
                    style={{ left: `${left}%`, top: `${top}%` }}
                    title={`${point.participant.name} · ${point.cluster}`}
                  >
                    <span
                      className={`block border-2 bg-[#fff8ef] p-0.5 shadow-[2px_2px_0_rgba(24,21,19,0.35)] transition-transform group-hover:scale-110 ${
                        point.confidence < 25 ? 'opacity-45' : 'opacity-95'
                      }`}
                      style={{ borderColor: regionColor.get(point.cluster) ?? '#181513' }}
                    >
                      <CompanyMark
                        participant={point.participant}
                        size={size}
                        tone="neutral"
                        className="!border-[1.5px]"
                      />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <p className="font-mono text-[10px] leading-relaxed text-[#625c55]">
            Dashed lines mark active comparison pairs. Closer companies share more co-voting / word overlap.
          </p>
        </div>

        <AddNextBatchCta
          variant="banner"
          className={`mt-5 ${hasNextBatchIntent ? '!bg-[#d7ff45]' : ''}`}
        />
      </div>
      </div>
    </>
  );
}
