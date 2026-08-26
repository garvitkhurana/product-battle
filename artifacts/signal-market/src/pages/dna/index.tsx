import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGetTasteDna } from "@workspace/api-client-react";
import {
  isInvalidPerceptionSessionError,
  useSessionToken,
} from "@/lib/session";
import {
  Fingerprint,
  Instagram,
  Loader2,
  Lock,
  MessageCircle,
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { AddNextBatchCta } from "@/components/AddNextBatchCta";

type DnaAxis = { label: string; score: number };

function axisEndpoints(axis: DnaAxis): [string, string] {
  const [low, high] = axis.label.split(" ↔ ");
  return [low || axis.label, high || axis.label];
}

function axisTendency(axis: DnaAxis): string {
  const [low, high] = axisEndpoints(axis);
  return `Leans ${axis.score < 3 ? low : high}`;
}

function axisPosition(axis: DnaAxis): number {
  return Math.max(0, Math.min(100, ((axis.score - 1) / 4) * 100));
}

function hasAxisSignal(axis: DnaAxis & { confidence: number }): boolean {
  return Math.abs(axis.score - 3) >= 0.05 && axis.confidence >= 40;
}

function archetypeName(value: string): string {
  return value
    .replace(/^THE\s+/i, "")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function TasteDna() {
  const {
    sessionToken,
    sessionError,
    isCreatingSession,
    invalidateSession,
    retrySession,
  } = useSessionToken();
  const { toast } = useToast();

  const tasteDna = useGetTasteDna();
  const dnaRequestSession = useRef<string | null>(null);
  const recoverSession = useCallback(() => {
    tasteDna.reset();
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
      !tasteDna.isPending &&
      !tasteDna.data &&
      !tasteDna.error
    ) {
      loadTasteDna();
    }
  }, [
    loadTasteDna,
    sessionToken,
    tasteDna.data,
    tasteDna.error,
    tasteDna.isPending,
  ]);

  const retryTasteDna = useCallback(() => {
    if (sessionError) {
      retrySession();
      return;
    }
    dnaRequestSession.current = null;
    tasteDna.reset();
    loadTasteDna();
  }, [loadTasteDna, retrySession, sessionError, tasteDna]);

  const { data: dna, isPending: isLoading, error } = tasteDna;

  const meaningfulAxes = useMemo(
    () => (dna?.axes ?? []).filter(hasAxisSignal),
    [dna?.axes],
  );
  const topAxis =
    [...meaningfulAxes].sort(
      (a, b) => Math.abs(b.score - 3) - Math.abs(a.score - 3),
    )[0] ??
    dna?.axes
      ?.slice()
      .sort((a, b) => Math.abs(b.score - 3) - Math.abs(a.score - 3))[0];

  const getShareDetails = () => {
    if (!dna) return null;
    const archetype = dna.archetype || "TASTE DNA";
    const tendency =
      topAxis && hasAxisSignal(topAxis) ? axisTendency(topAxis) : "";
    const text = `I’m the ${archetypeName(archetype)} on YC Battle.\n${dna.headline}\nWhat’s your startup taste?`;
    const params = new URLSearchParams({
      archetype,
      headline: dna.headline,
      v: "2",
    });
    if (tendency) params.set("tendency", tendency);
    const assetOrigin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://ycbattle.com";
    return {
      text,
      cardUrl: `https://ycbattle.com/api/card/dna?${params.toString()}`,
      imageUrl: `${assetOrigin}/api/og/dna.png?${params.toString()}`,
    };
  };

  const shareOnX = () => {
    const details = getShareDetails();
    if (!details) return;
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(details.text)}&url=${encodeURIComponent(details.cardUrl)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  };

  const shareOnWhatsApp = () => {
    const details = getShareDetails();
    if (!details) return;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${details.text}\n${details.cardUrl}`)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const shareOnInstagram = async () => {
    const details = getShareDetails();
    if (!details) return;

    try {
      const response = await fetch(details.imageUrl);
      if (!response.ok) throw new Error("Card unavailable");
      const imageBlob = await response.blob();
      const file = new File(
        [imageBlob],
        "yc-battle-taste-dna.png",
        { type: "image/png" },
      );
      const shareData = {
        files: [file],
        title: "My YC Battle Taste DNA",
        text: details.text,
      };

      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return;
      }

      const objectUrl = URL.createObjectURL(imageBlob);
      const download = document.createElement("a");
      download.href = objectUrl;
      download.download = file.name;
      download.rel = "noopener";
      document.body.appendChild(download);
      download.click();
      download.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      toast({
        title: "Card downloaded",
        description: "Open Instagram and add the image to your post or story.",
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast({
        title: "Share unavailable",
        description: "Try WhatsApp, X, or copy the blurb instead.",
        variant: "destructive",
      });
    }
  };

  const copyDna = async () => {
    const details = getShareDetails();
    if (!details) return;
    try {
      await navigator.clipboard.writeText(
        `${details.text}\n${details.cardUrl}`,
      );
      toast({
        title: "Copied",
        description: "Taste DNA blurb is on your clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Try the share button instead.",
        variant: "destructive",
      });
    }
  };

  if ((!sessionToken && !sessionError) || isCreatingSession || isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-[#f6e5d2]">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff5038]" />
        <p className="font-mono text-sm text-[#625c55] uppercase tracking-widest">
          Sequencing Profile
        </p>
      </div>
    );
  }

  if (sessionError || error || !dna) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f6e5d2] p-4">
        <div className="max-w-md w-full border-2 border-[#181513] bg-[#fff8ef] p-8 text-center space-y-4 shadow-[6px_6px_0_#181513]">
          <Fingerprint className="w-8 h-8 text-[#ff5038] mx-auto" />
          <h2 className="font-bold text-xl text-[#181513]">
            Profile Generation Failed
          </h2>
          <p className="text-sm font-mono text-[#625c55]">
            {sessionError
              ? "Your private session could not be started."
              : "We could not retrieve your taste DNA."}
          </p>
          <button
            type="button"
            onClick={retryTasteDna}
            className="inline-flex bg-[#181513] px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[#fff8ef] hover:bg-[#ff5038]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const isImmature = dna.comparisonCount < 5;

  return (
    <div className="flex-1 bg-[#f6e5d2] px-4 py-12 md:py-20">
      <div className="container mx-auto max-w-4xl space-y-10">
        <header className="border-b-2 border-[#181513] pb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#d7ff45] text-[#181513] border-2 border-[#181513] mb-5">
            <Fingerprint className="w-10 h-10" />
          </div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5038]">
            Private perception profile
          </p>
          <h1 className="mt-2 text-4xl md:text-6xl font-bold tracking-[-0.06em]">
            Taste DNA
          </h1>
          <p className="mt-4 text-base text-[#625c55] font-mono max-w-xl mx-auto">
            A private map of your preferences against curated launch context.
            Your choices stay in your session; public confidence grows
            separately.
          </p>
        </header>

        {isImmature ? (
          <div className="bg-[#fff8ef] border-2 border-[#181513] p-8 md:p-12 text-center space-y-6 shadow-[8px_8px_0_#181513]">
            <Lock className="w-8 h-8 text-[#ff5038] mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Insufficient Data</h3>
              <p className="text-[#625c55] font-mono">
                You have completed {dna.comparisonCount} comparison
                {dna.comparisonCount !== 1 ? "s" : ""}. We require a minimum of
                5 signals to establish a statistical baseline for your profile.
              </p>
            </div>
            <div className="mx-auto grid max-w-sm grid-cols-2 border-2 border-[#181513] text-left">
              <div className="border-r-2 border-[#181513] bg-[#ff5038] p-4">
                <p className="font-mono text-2xl font-bold">
                  {dna.comparisonCount}
                </p>
                <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]">
                  Signals captured
                </p>
              </div>
              <div className="bg-[#d7ff45] p-4">
                <p className="font-mono text-2xl font-bold">
                  {Math.max(0, 5 - dna.comparisonCount)}
                </p>
                <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]">
                  To baseline
                </p>
              </div>
            </div>
            <Link
              href="/swipe"
              className="inline-flex px-8 py-4 bg-[#181513] text-[#fff8ef] font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#ff5038] transition-colors"
            >
              Continue Comparing
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="bg-[#fff8ef] border-2 border-[#181513] p-8 md:p-12 relative overflow-hidden shadow-[8px_8px_0_#181513]">
              {dna.archetype && (
                <p className="mb-3 max-w-[70%] font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#ff5038]">
                  {dna.archetype}
                </p>
              )}

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-8">
                {dna.headline ||
                  "Your preferences skew heavily towards contrarian technical infrastructure."}
              </h2>

              <div
                className={`grid gap-8 pt-8 border-t-2 border-[#181513] ${
                  dna.closestCompanies?.length
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                <div className="space-y-6">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#625c55] mb-4">
                    Dominant Axes
                  </h3>
                  {(dna.axes ?? []).map((axis) => {
                    const meaningful = hasAxisSignal(axis);
                    const [lowLabel, highLabel] = axisEndpoints(axis);
                    return (
                      <div
                        key={axis.key}
                        className={`space-y-2 ${meaningful ? "" : "opacity-35"}`}
                      >
                        <div className="flex justify-between font-mono text-sm">
                          <span className="font-bold">{lowLabel}</span>
                          <span className="font-bold">{highLabel}</span>
                        </div>
                        <div className="relative h-3 w-full border border-[#181513]/25 bg-[#e8d5c1]">
                          <div className="absolute bottom-0 left-1/2 top-0 w-px bg-[#181513]/35" />
                          {meaningful ? (
                            <div
                              className="absolute -bottom-1 -top-1 w-3 -translate-x-1/2 border border-[#181513] bg-[#ff5038]"
                              style={{ left: `${axisPosition(axis)}%` }}
                            />
                          ) : null}
                        </div>
                        <p className="text-right font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#625c55]">
                          {meaningful ? axisTendency(axis) : "no signal yet"}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {dna.closestCompanies?.length ? (
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#625c55] mb-4">
                      Aligned Entities
                    </h3>
                    <ul className="space-y-3">
                      {dna.closestCompanies.map((company, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 p-3 bg-[#d7ff45] border border-[#181513] font-bold"
                        >
                          <span className="font-mono text-xs text-[#625c55]">
                            0{i + 1}
                          </span>
                          {company}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#181513] bg-[#fff8ef] p-5 space-y-4">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#625c55]">
                      Aligned Entities
                    </h3>
                    <p className="font-mono text-sm text-[#625c55] leading-relaxed">
                      Not enough independent co-signals yet. Add more
                      comparisons to unlock companies that share your profile —
                      not a mirror of your own clicks.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/swipe"
                        className="inline-flex bg-[#181513] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#fff8ef] hover:bg-[#ff5038]"
                      >
                        Continue comparing
                      </Link>
                      <AddNextBatchCta label="Add another batch" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={shareOnX}
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#181513] bg-[#181513] text-[#fff8ef] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#ff5038] transition-colors"
              >
                <span
                  className="font-sans text-sm font-black leading-none"
                  aria-hidden
                >
                  X
                </span>
                Share on X
              </button>
              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="flex items-center gap-2 border-2 border-[#181513] bg-[#d7ff45] px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[#181513] transition-colors hover:bg-[#fff8ef]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </button>
              <button
                type="button"
                onClick={shareOnInstagram}
                className="flex items-center gap-2 border-2 border-[#181513] bg-[#fff8ef] px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[#181513] transition-colors hover:bg-[#ff5038]"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </button>
              <button
                type="button"
                onClick={copyDna}
                className="flex items-center gap-2 px-6 py-3 border-2 border-[#181513] bg-[#fff8ef] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#d7ff45] transition-colors"
              >
                Copy blurb
              </button>
            </div>

            <AddNextBatchCta
              variant="banner"
              className="mt-8 text-left"
              label="Add another ecosystem batch"
            />
          </div>
        )}
      </div>
    </div>
  );
}
