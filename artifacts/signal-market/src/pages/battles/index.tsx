import { useEffect, useMemo, useState } from "react";
import { useListBattles, Battle } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
import {
  Activity,
  ArrowRight,
  ChevronDown,
  Plus,
  Search,
  Swords,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { rankBattlesForClicks } from "@/lib/household-battles";

type LanePreset = {
  label: string;
  matches: (category: string) => boolean;
};

const lanePresets: LanePreset[] = [
  { label: "Food delivery", matches: (category) => /delivery|quick commerce|grocery/i.test(category) },
  { label: "AI & data", matches: (category) => /ai|data|analytics|search/i.test(category) },
  { label: "Video & creators", matches: (category) => /video|live|media|communities/i.test(category) },
  { label: "Developer tools", matches: (category) => /devops|coding|no-code|paas|testing/i.test(category) },
  { label: "Fintech", matches: (category) => /payment|payroll|card|crypto|broking|remittance|finance/i.test(category) },
  { label: "Health", matches: (category) => /health|biotech|patient|wellness|ehr/i.test(category) },
];

function scrollToActiveBattles() {
  document.getElementById("active-battles")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function searchableBattleText(battle: Battle): string {
  return [
    battle.title,
    battle.description,
    battle.category,
    battle.participantA.name,
    battle.participantA.shortDescription,
    battle.participantA.description,
    battle.participantA.category,
    battle.participantB.name,
    battle.participantB.shortDescription,
    battle.participantB.description,
    battle.participantB.category,
  ]
    .join(" ")
    .toLowerCase();
}

export default function BattlesList() {
  const { data: battles, isLoading, error, refetch } = useListBattles();
  const [query, setQuery] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAllBattles, setShowAllBattles] = useState(false);
  const activeBattles = battles?.filter((battle) => battle.status === "active") || [];
  const completedBattles = battles?.filter((battle) => battle.status === "completed") || [];

  useEffect(() => {
    const scrollFromHash = () => {
      if (window.location.hash === "#active-battles") {
        window.requestAnimationFrame(scrollToActiveBattles);
      }
    };

    scrollFromHash();
    window.addEventListener("hashchange", scrollFromHash);
    return () => window.removeEventListener("hashchange", scrollFromHash);
  }, []);

  const laneCategories = useMemo(
    () => Array.from(new Set(activeBattles.map((battle) => battle.category).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [activeBattles],
  );
  const visiblePresets = useMemo(
    () => lanePresets.filter((preset) => activeBattles.some((battle) => preset.matches(battle.category))),
    [activeBattles],
  );
  const visibleBattles = useMemo(() => {
    const search = query.trim().toLowerCase();
    const preset = lanePresets.find((item) => item.label === selectedPreset);
    return activeBattles.filter((battle) => {
      const matchesSearch = !search || searchableBattleText(battle).includes(search);
      const matchesCategory = !selectedCategory || battle.category === selectedCategory;
      const matchesPreset = !preset || preset.matches(battle.category);
      return matchesSearch && matchesCategory && matchesPreset;
    });
  }, [activeBattles, query, selectedCategory, selectedPreset]);
  const featuredBattles = useMemo(
    () => rankBattlesForClicks(activeBattles).slice(0, 10),
    [activeBattles],
  );

  const clearFilters = () => {
    setQuery("");
    setSelectedPreset(null);
    setSelectedCategory("");
  };
  const hasFilters = Boolean(query || selectedPreset || selectedCategory);
  const displayedBattles = hasFilters || showAllBattles ? visibleBattles : featuredBattles;

  return (
    <div className="min-h-screen bg-[#f8e9d8] pb-20 text-[#211b18]">
      <section className="relative overflow-hidden border-b-4 border-[#ff4f32] bg-[#211b18] px-5 py-20 text-[#f8e9d8] md:px-10 md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #f8e9d8 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-2 border border-[#ff4f32]/60 bg-[#ff4f32]/15 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff795f]">
              <Zap className="h-3.5 w-3.5 fill-current" />
              YC Battle / community signal
            </p>
            <h1 className="font-sans text-5xl font-extrabold leading-[0.86] tracking-[-0.075em] md:text-7xl lg:text-8xl">
              PICK YOUR
              <br />
              <span className="text-[#ff4f32]">FACE-OFF.</span>
            </h1>
            <p className="mt-7 max-w-2xl font-mono text-sm leading-relaxed text-[#f8e9d8]/70 md:text-base">
              Find the company fight you care about, then back a side with one $0.99 community vote. No endorsements. No investment advice.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToActiveBattles}
                className="inline-flex items-center gap-2 border-2 border-[#d9f75b] bg-[#d9f75b] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#211b18] transition-transform hover:-translate-y-0.5"
              >
                Find a battle <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 border-2 border-[#f8e9d8]/70 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#f8e9d8] transition-colors hover:border-[#ff4f32] hover:bg-[#ff4f32]"
              >
                <Plus className="h-4 w-4" /> Pitch a battle
              </Link>
            </div>
          </div>
          <button
            type="button"
            onClick={scrollToActiveBattles}
            className="border-l-2 border-[#f8e9d8]/25 pl-5 text-left font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#f8e9d8]/60 transition-colors hover:text-[#f8e9d8]"
          >
            <span className="mb-2 block text-[#d9f75b]">Field is open</span>
            {activeBattles.length.toString().padStart(2, "0")} active matchups
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-20">
        <section id="active-battles" className="scroll-mt-24">
          <div className="mb-8 flex flex-col gap-5 border-b-2 border-[#211b18] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff4f32]">The board</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.055em] md:text-4xl">ACTIVE BATTLES</h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#d9f75b]" />
              <Activity className="h-4 w-4" />
              Live now
            </div>
          </div>

          <div className="mb-10 border-2 border-[#211b18] bg-[#fffaf3] p-4 shadow-[5px_5px_0_#211b18] md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <label className="relative block flex-1">
                <span className="sr-only">Search battles</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#211b18]/55" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search companies, matchups, or topics"
                  className="h-12 w-full border-2 border-[#211b18] bg-[#f8e9d8] pl-12 pr-4 font-mono text-sm font-bold outline-none transition-colors placeholder:font-normal placeholder:text-[#211b18]/45 focus:border-[#ff4f32]"
                />
              </label>
              <label className="relative block lg:w-72">
                <span className="sr-only">Choose a specific battle lane</span>
                <select
                  value={selectedCategory}
                  onChange={(event) => {
                    setSelectedCategory(event.target.value);
                    setSelectedPreset(null);
                  }}
                  className="h-12 w-full appearance-none border-2 border-[#211b18] bg-[#f8e9d8] px-4 pr-10 font-mono text-xs font-bold uppercase tracking-[0.08em] outline-none focus:border-[#ff4f32]"
                >
                  <option value="">Every lane</option>
                  {laneCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#211b18]/55">Popular lanes</span>
              {visiblePresets.map((preset) => {
                const isSelected = selectedPreset === preset.label;
                return (
                  <button
                    type="button"
                    key={preset.label}
                    onClick={() => {
                      setSelectedPreset(isSelected ? null : preset.label);
                      setSelectedCategory("");
                    }}
                    className={`border border-[#211b18] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] transition-colors ${
                      isSelected ? "bg-[#ff4f32] text-[#f8e9d8]" : "bg-[#f8e9d8] hover:bg-[#d9f75b]"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] underline underline-offset-4 hover:text-[#ff4f32]"
                >
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-72 rounded-none bg-[#211b18]/10" />)}
            </div>
          ) : error ? (
            <div className="border-2 border-[#211b18] bg-[#ff4f32] p-6 shadow-[6px_6px_0_#211b18]">
              <p className="font-mono text-sm font-bold uppercase tracking-wider">The battle board could not load.</p>
              <button type="button" onClick={() => refetch()} className="mt-4 border-2 border-[#211b18] bg-[#f8e9d8] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-transform hover:-translate-y-0.5">
                Retry loading battles
              </button>
            </div>
          ) : activeBattles.length === 0 ? (
            <EmptyBoard />
          ) : visibleBattles.length === 0 ? (
            <div className="border-2 border-dashed border-[#211b18]/45 bg-[#fffaf3] px-6 py-14 text-center">
              <Search className="mx-auto mb-4 h-10 w-10 text-[#ff4f32]" />
              <h3 className="text-2xl font-extrabold tracking-[-0.04em]">No matchups in that lane yet.</h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#211b18]/65">
                You can clear the filters, or tell us which company rivalry belongs on the board next.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={clearFilters} className="border-2 border-[#211b18] bg-[#d9f75b] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.1em]">Show every battle</button>
                <Link href="/submit" className="border-2 border-[#211b18] bg-[#ff4f32] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.1em] text-[#f8e9d8]">Pitch this battle</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#211b18]/60">
                  {hasFilters
                    ? `Showing ${visibleBattles.length} matching battle${visibleBattles.length === 1 ? "" : "s"}`
                    : showAllBattles
                      ? `Showing all ${activeBattles.length} active matchups`
                      : `Top ${displayedBattles.length} household matchups`}
                </p>
                {!hasFilters && (
                  <button
                    type="button"
                    onClick={() => setShowAllBattles((current) => !current)}
                    className="inline-flex items-center gap-2 self-start border-b-2 border-[#211b18] pb-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors hover:border-[#ff4f32] hover:text-[#ff4f32] sm:self-auto"
                  >
                    {showAllBattles ? "Show top battles" : `Browse all ${activeBattles.length}`}
                    <ArrowRight className={`h-3.5 w-3.5 transition-transform ${showAllBattles ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {displayedBattles.map((battle) => <BattleCard key={battle.id} battle={battle} />)}
              </div>
            </>
          )}
        </section>

        {completedBattles.length > 0 && (
          <section className="mt-20">
            <div className="mb-8 flex items-end gap-4 border-b-2 border-[#211b18]/25 pb-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#211b18]/50">Archive</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.055em] text-[#211b18]/65 md:text-4xl">COMPLETED</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 opacity-75 transition-opacity hover:opacity-100 lg:grid-cols-2">
              {completedBattles.map((battle) => <BattleCard key={battle.id} battle={battle} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function EmptyBoard() {
  return (
    <div className="border-2 border-dashed border-[#211b18]/40 py-20 text-center">
      <Swords className="mx-auto mb-4 h-12 w-12 opacity-40" />
      <h3 className="text-xl font-bold">No active battles right now</h3>
      <p className="mt-2 text-[#211b18]/65">Check back when the next matchup enters the arena.</p>
    </div>
  );
}

function BattleCard({ battle }: { battle: Battle }) {
  const isCompleted = battle.status === "completed";
  const aWins = battle.participantAPercentage > battle.participantBPercentage;
  const bWins = battle.participantBPercentage > battle.participantAPercentage;
  const aInitials = battle.participantA.name.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const bInitials = battle.participantB.name.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const handleOpen = () => {
    try {
      window.sessionStorage.setItem("yc-battle-entering", battle.slug);
    } catch {
      // Storage can be unavailable in privacy-restricted browsers; navigation still works.
    }
  };

  return (
    <Link href={`/battles/${battle.slug}`} onClick={handleOpen} className="group block">
      <article className="overflow-hidden border-2 border-[#211b18] bg-[#f8e9d8] shadow-[6px_6px_0_#211b18] transition-all duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_0_#ff4f32]">
        <header className="flex items-start justify-between gap-3 border-b-2 border-[#211b18] px-5 py-4">
          <div>
            <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#211b18]/55">{battle.category}</p>
            <h3 className="text-xl font-extrabold tracking-[-0.04em] transition-colors group-hover:text-[#ff4f32]">{battle.title}</h3>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#211b18]/55">{format(new Date(battle.createdAt), "MMM d, yyyy")}</p>
          </div>
          <span className={`shrink-0 border border-[#211b18] px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] ${isCompleted ? "bg-[#211b18] text-[#f8e9d8]" : "bg-[#d9f75b]"}`}>
            {isCompleted ? <><Trophy className="mr-1 inline h-3 w-3" /> Final</> : "Voting open"}
          </span>
        </header>

        <div className="relative flex min-h-44">
          <div className={`flex w-1/2 flex-col justify-center border-r border-[#211b18]/20 bg-[#ff4f32] px-5 py-6 ${isCompleted && !aWins ? "opacity-75" : ""}`}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center border-2 border-[#211b18] bg-[#f8e9d8] font-mono text-lg font-bold shadow-[4px_4px_0_#211b18]">{aInitials}</div>
            <p className="text-2xl font-extrabold tracking-[-0.055em]">{battle.participantA.name}</p>
            <p className="mt-2 font-mono text-xs font-bold">{battle.participantAPercentage}%</p>
          </div>
          <div className={`flex w-1/2 flex-col items-end justify-center bg-[#d9f75b] px-5 py-6 text-right ${isCompleted && !bWins ? "opacity-75" : ""}`}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center overflow-hidden border-2 border-[#211b18] bg-[#f8e9d8] font-mono text-lg font-bold shadow-[4px_4px_0_#211b18]">{bInitials}</div>
            <p className="text-2xl font-extrabold tracking-[-0.055em]">{battle.participantB.name}</p>
            <p className="mt-2 font-mono text-xs font-bold">{battle.participantBPercentage}%</p>
          </div>
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 border-[#211b18] bg-[#f8e9d8] font-mono text-[10px] font-bold italic">VS</span>
        </div>

        <div className="h-2 border-y-2 border-[#211b18] bg-[#211b18]">
          <div className="h-full bg-[#ff4f32]" style={{ width: `${battle.participantAPercentage}%` }} />
        </div>
        <footer className="flex items-center justify-between gap-4 px-5 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.1em]">
          <span className="text-[#211b18]/60">{battle.totalVotes.toLocaleString()} total votes</span>
          <span className="flex items-center gap-1">Enter arena <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
        </footer>
      </article>
    </Link>
  );
}