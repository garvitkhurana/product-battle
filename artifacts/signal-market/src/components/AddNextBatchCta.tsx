import { useState } from 'react';
import { useLocation } from 'wouter';
import { addExpandedBattles, getNextComparisonBatch, NextComparisonBatchError } from '@/lib/expandedQueue';
import { isInvalidPerceptionSessionError, useSessionToken } from '@/lib/session';
import { useToast } from '@/hooks/use-toast';

type Variant = 'button' | 'banner' | 'hero';

type Props = {
  variant?: Variant;
  className?: string;
  label?: string;
};

export function AddNextBatchCta({
  variant = 'button',
  className = '',
  label = 'Add next batch',
}: Props) {
  const [, setLocation] = useLocation();
  const { sessionToken, isCreatingSession, retrySession } = useSessionToken();
  const { toast } = useToast();
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddBatch = async () => {
    if (!sessionToken || isAddingBatch) return;
    setIsAddingBatch(true);
    setMessage(null);
    try {
      const nextBatch = await getNextComparisonBatch(sessionToken);
      if (!nextBatch.battles.length) {
        setMessage('You have completed every currently curated comparison. More matchups can be added next.');
        return;
      }
      addExpandedBattles(sessionToken, nextBatch.battles);
      setLocation('/swipe');
    } catch (error) {
      if (isInvalidPerceptionSessionError(error)) {
        retrySession();
        toast({
          title: 'Starting a fresh session',
          description: 'Finish the launch queue, then add another batch.',
        });
        return;
      }
      const description =
        error instanceof NextComparisonBatchError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'We could not prepare another comparison batch.';
      setMessage(description);
      toast({ title: 'Could not add batch', description, variant: 'destructive' });
    } finally {
      setIsAddingBatch(false);
    }
  };

  const disabled = !sessionToken || isCreatingSession || isAddingBatch;
  const buttonLabel = isAddingBatch
    ? 'Preparing batch…'
    : isCreatingSession
      ? 'Preparing session…'
      : label;

  if (variant === 'hero') {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={handleAddBatch}
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2 border-2 border-foreground bg-transparent px-8 py-4 text-lg font-bold text-foreground transition-colors hover:bg-[#d7ff45] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {buttonLabel}
        </button>
        {message && <p className="mt-2 font-mono text-xs text-muted-foreground">{message}</p>}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <section className={`border-2 border-[#181513] bg-[#fff8ef] p-5 md:p-6 ${className}`}>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff5038]">
          Extend your private queue
        </p>
        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold tracking-[-0.04em] md:text-2xl">Add the next ten ecosystem comparisons.</h2>
            <p className="mt-2 font-mono text-xs leading-relaxed text-[#625c55]">
              Pulls the next curated batch into Continuous Mode. Finish your current cohort first if the API asks you to wait.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddBatch}
            disabled={disabled}
            className="shrink-0 bg-[#181513] px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[#fff8ef] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {buttonLabel}
          </button>
        </div>
        {message && <p className="mt-4 font-mono text-xs text-[#ff5038]">{message}</p>}
      </section>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleAddBatch}
        disabled={disabled}
        className="inline-flex bg-[#181513] px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[#fff8ef] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {buttonLabel}
      </button>
      {message && <p className="mt-2 font-mono text-xs text-[#625c55]">{message}</p>}
    </div>
  );
}
