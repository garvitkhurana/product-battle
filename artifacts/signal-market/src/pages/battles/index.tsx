import { Link } from 'wouter';
import { useListBattles } from '@workspace/api-client-react';
import { Activity, ArrowRight, ShieldAlert } from 'lucide-react';
import { CompanyMark } from '@/components/CompanyMark';
import { AddNextBatchCta } from '@/components/AddNextBatchCta';
import { Seo } from '@/components/Seo';

export default function BattlesList() {
  const { data: battles, isLoading, error } = useListBattles();

  return (
    <div className="flex-1 bg-[#f6e5d2]">
      <Seo
        title="YC Company Comparisons — YC Battle"
        description="Browse live YC company comparisons and make private pairwise choices that reveal community perception."
        path="/battles"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'YC Company Comparisons',
          url: 'https://ycbattle.com/battles',
          isPartOf: { '@id': 'https://ycbattle.com/#website' },
        }}
      />
      <div className="container mx-auto flex max-w-6xl flex-col px-4 py-12 md:px-8 md:py-20">
        <header className="border-b-2 border-[#181513] pb-7">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff5038]">The board / live cohort</p>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl space-y-3">
              <h1 className="text-5xl font-bold tracking-[-0.06em] md:text-7xl">Comparisons</h1>
              <p className="font-mono text-sm leading-relaxed text-[#625c55] md:text-base">
                Pick the pairing you know best. Every choice is a private perception signal, not a public ranking.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 border border-[#181513] bg-[#d7ff45] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
              <span className="h-2 w-2 bg-[#181513]" />
              {battles?.length ?? 0} live now
            </span>
          </div>
        </header>

        <AddNextBatchCta variant="banner" className="mt-8" />

        <div className="pt-10">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse border-2 border-[#181513] bg-[#fff8ef]" />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-start gap-4 border-2 border-[#181513] bg-[#fff8ef] p-8 text-[#181513]">
              <ShieldAlert className="h-6 w-6 shrink-0 text-[#ff5038]" />
              <div>
                <h3 className="font-bold">The board could not load</h3>
                <p className="mt-1 font-mono text-sm">Please refresh the page and try again.</p>
              </div>
            </div>
          ) : battles?.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-[#181513] bg-[#fff8ef] p-16 text-center">
              <Activity className="h-12 w-12 text-[#625c55]" />
              <h3 className="text-xl font-bold">No active comparisons</h3>
              <p className="max-w-sm font-mono text-sm text-[#625c55]">
                The market is currently quiet. Check back later for the next pairing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {battles?.map((battle) => (
                <Link
                  key={battle.id}
                  href={`/battles/${battle.slug}`}
                  onClick={() => sessionStorage.setItem('yc_battle_entry', battle.slug)}
                  className="group block overflow-hidden border-2 border-[#181513] bg-[#fff8ef] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_#181513] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ff5038]"
                >
                  <div className="flex items-center justify-between border-b border-[#181513] px-4 py-3">
                    <span className="bg-[#181513] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#fff8ef]">
                      {battle.category}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#625c55]">
                      {battle.comparisonCount >= 10 ? `${battle.comparisonCount.toLocaleString()} signals` : 'Signal collecting'}
                    </span>
                  </div>

                  <div className="grid min-h-48 grid-cols-[1fr_auto_1fr]">
                    <div className="flex flex-col items-center justify-center gap-3 bg-[#ff5038] p-5 text-center">
                      <CompanyMark participant={battle.participantA} tone="neutral" size="md" />
                      <h2 className="line-clamp-2 text-xl font-bold tracking-[-0.04em]">{battle.participantA.name}</h2>
                    </div>
                    <div className="relative flex w-12 items-center justify-center border-x-2 border-[#181513] bg-[#fff8ef]">
                      <span className="absolute border border-[#181513] bg-[#fff8ef] px-1.5 py-1 font-mono text-[10px] font-bold">VS</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-3 bg-[#d7ff45] p-5 text-center">
                      <CompanyMark participant={battle.participantB} tone="neutral" size="md" />
                      <h2 className="line-clamp-2 text-xl font-bold tracking-[-0.04em]">{battle.participantB.name}</h2>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t-2 border-[#181513] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em]">
                    <span>Open comparison</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
