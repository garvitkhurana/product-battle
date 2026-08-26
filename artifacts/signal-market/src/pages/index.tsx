import { Link } from 'wouter';
import { useListBattles } from '@workspace/api-client-react';
import { ArrowRight, Activity, Zap } from 'lucide-react';
import { CompanyMark } from '@/components/CompanyMark';
import { AddNextBatchCta } from '@/components/AddNextBatchCta';
import { Seo } from '@/components/Seo';

// Curated independently of the full gallery order in battleSeed.ts, so the
// homepage teaser can spotlight specific battles without reordering /battles.
const HOMEPAGE_SPOTLIGHT_SLUGS = ['reddit-vs-discord', 'cursor-vs-codeium', 'willow-vs-wispr-flow'];

export default function Index() {
  const { data: battles, isLoading } = useListBattles();
  const spotlightBattles = battles
    ? HOMEPAGE_SPOTLIGHT_SLUGS.map((slug) => battles.find((battle) => battle.slug === slug)).filter(
        (battle): battle is NonNullable<typeof battle> => Boolean(battle),
      )
    : [];

  return (
    <div className="flex-1 flex flex-col">
      <Seo
        title="YC Battle — Independent company perception"
        description="Make fast, free pairwise choices and explore a confidence-aware map of how the community perceives YC companies."
        path="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'WebSite', '@id': 'https://ycbattle.com/#website', name: 'YC Battle', url: 'https://ycbattle.com/' },
            { '@type': 'Organization', '@id': 'https://ycbattle.com/#organization', name: 'YC Battle', url: 'https://ycbattle.com/' },
          ],
        }}
      />
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row gap-12 items-start justify-between">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground font-mono text-xs font-bold uppercase tracking-widest border border-foreground">
              <span className="w-2 h-2 rounded-none bg-foreground animate-pulse" />
              Live Perception Feed
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
              Compare YC startups through <span className="text-primary">community perception signals.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground font-mono leading-relaxed max-w-xl">
              An independent engine measuring community confidence in the latest launch cohorts through rapid, pairwise choices. No arbitrary scores. Pure relational data.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
              <Link 
                href="/swipe" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-lg hover:bg-foreground transition-colors"
              >
                Start Comparing
                <Zap className="w-5 h-5" />
              </Link>
              <Link 
                href="/battles" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-foreground bg-transparent text-foreground font-bold text-lg hover:bg-foreground hover:text-background transition-colors"
              >
                Browse Gallery
                <ArrowRight className="w-5 h-5" />
              </Link>
              <AddNextBatchCta variant="hero" label="Add new comparisons" />
            </div>
          </div>
          
          {/* Abstract graphic */}
          <div className="flex-1 w-full max-w-md hidden md:block">
            <div className="aspect-square bg-foreground text-background p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" 
                   style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}>
              </div>
              <div className="relative z-10 flex justify-between items-start">
                <span className="font-mono text-sm uppercase tracking-widest">Confidence</span>
                <Activity className="w-6 h-6 text-secondary" />
              </div>
              
              <div className="relative z-10 space-y-4">
                <div className="h-12 w-full border border-background/20 relative">
                  <div className="absolute inset-y-0 left-0 bg-primary w-[65%]" />
                </div>
                <div className="h-12 w-full border border-background/20 relative">
                  <div className="absolute inset-y-0 left-0 bg-secondary w-[35%]" />
                </div>
              </div>
              
              <div className="relative z-10 font-bold text-2xl">
                A/B Protocol
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Battles */}
      <section className="bg-[#f6e5d2] py-20">
        <div className="container mx-auto max-w-6xl space-y-10 px-4 md:px-8">
          <div className="flex flex-col justify-between gap-4 border-b-2 border-[#181513] pb-7 sm:flex-row sm:items-end">
            <div className="space-y-3">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff5038]">The board / live cohort</p>
              <h2 className="text-4xl font-bold tracking-[-0.06em] md:text-5xl">Active Comparisons</h2>
              <p className="max-w-xl font-mono text-sm leading-relaxed text-[#625c55]">Latest pairings measuring public perception</p>
            </div>
            <Link href="/battles" className="hidden items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] hover:text-[#ff5038] sm:flex">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse border-2 border-[#181513] bg-[#fff8ef]" />
              ))
            ) : spotlightBattles.map((battle) => (
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
                    <h3 className="line-clamp-2 text-xl font-bold tracking-[-0.04em]">{battle.participantA.name}</h3>
                  </div>
                  <div className="relative flex w-10 items-center justify-center border-x-2 border-[#181513] bg-[#fff8ef]">
                    <span className="absolute border border-[#181513] bg-[#fff8ef] px-1.5 py-1 font-mono text-[10px] font-bold">VS</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3 bg-[#d7ff45] p-5 text-center">
                    <CompanyMark participant={battle.participantB} tone="neutral" size="md" />
                    <h3 className="line-clamp-2 text-xl font-bold tracking-[-0.04em]">{battle.participantB.name}</h3>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t-2 border-[#181513] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em]">
                  <span>Open comparison</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
          
          <div className="border-t border-[#181513] pt-4 sm:hidden">
            <Link href="/battles" className="flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.15em] hover:text-[#ff5038]">
              View All Comparisons <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <h2 className="text-3xl font-bold tracking-tight">The Mechanics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="space-y-4 p-6 border border-border bg-card relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-sm">01</div>
                <h3 className="font-bold text-lg">Pairwise Choice</h3>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                  Humans are bad at absolute scoring. We are excellent at relative comparison. You are presented with two options. Pick one.
                </p>
              </div>
              
              <div className="space-y-4 p-6 border border-border bg-card relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-foreground text-background flex items-center justify-center font-mono font-bold text-sm">02</div>
                <h3 className="font-bold text-lg">Confidence Math</h3>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                  Every decision feeds a statistical model measuring certainty. We discard arbitrary 5-star ratings for pure signal mapping.
                </p>
              </div>
              
              <div className="space-y-4 p-6 border border-border bg-card relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-secondary text-foreground flex items-center justify-center font-mono font-bold text-sm">03</div>
                <h3 className="font-bold text-lg">Taste DNA</h3>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                  Your choices construct a privacy-conscious taste profile. Discover your alignment with the broader ecosystem axes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
