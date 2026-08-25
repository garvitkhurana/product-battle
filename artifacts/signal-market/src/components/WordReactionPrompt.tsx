import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useCreatePerceptionWord } from '@workspace/api-client-react';
import { isInvalidPerceptionSessionError } from '@/lib/session';
import { useToast } from '@/hooks/use-toast';

type WordPromptTarget = {
  participantId: string;
  participantName: string;
};

type Props = {
  open: boolean;
  sessionToken: string | null;
  target: WordPromptTarget | null;
  onClose: () => void;
  onSessionInvalid?: () => void;
};

export function WordReactionPrompt({ open, sessionToken, target, onClose, onSessionInvalid }: Props) {
  const createWord = useCreatePerceptionWord();
  const { toast } = useToast();
  const [word, setWord] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open && target && !wasOpenRef.current) {
      restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      wasOpenRef.current = true;
      inputRef.current?.focus();
      return;
    }

    if (!open && wasOpenRef.current) {
      wasOpenRef.current = false;
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
    }
  }, [open, target]);

  if (!open || !target) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!sessionToken) return;
    const cleaned = word.trim().toLowerCase();
    if (!/^[a-z][a-z-]{1,31}$/.test(cleaned)) {
      toast({
        title: 'One word only',
        description: 'Use letters (and optional hyphens), 2–32 characters.',
        variant: 'destructive',
      });
      return;
    }
    createWord.mutate(
      {
        data: {
          sessionToken,
          participantId: target.participantId,
          word: cleaned,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: 'Word recorded',
            description: `Saved for ${target.participantName}. It shows up once 5 people agree.`,
          });
          setWord('');
          onClose();
        },
        onError: (error) => {
          if (isInvalidPerceptionSessionError(error)) {
            onSessionInvalid?.();
            return;
          }
          toast({
            title: 'Could not save word',
            description: error instanceof Error ? error.message : 'Try again with a different word.',
            variant: 'destructive',
          });
        },
      },
    );
  };

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setWord('');
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], select:not([disabled]), textarea:not([disabled])',
      ),
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#181513]/45 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="word-reaction-title"
        onKeyDown={handleDialogKeyDown}
        className="w-full max-w-md border-2 border-[#181513] bg-[#fff8ef] p-5 shadow-[8px_8px_0_#181513]"
      >
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff5038]">One-word reaction</p>
        <h2 id="word-reaction-title" className="mt-2 text-2xl font-bold tracking-tight">Sum up {target.participantName} in one word.</h2>
        <p className="mt-2 font-mono text-xs leading-relaxed text-[#625c55]">
          Shows up once 5 people agree with you.
        </p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <label htmlFor="word-reaction-input" className="font-mono text-xs font-bold uppercase tracking-widest">
            Your one-word reaction
          </label>
          <input
            ref={inputRef}
            id="word-reaction-input"
            value={word}
            onChange={(event) => setWord(event.target.value.replace(/[^a-zA-Z-]/g, '').slice(0, 32))}
            placeholder="e.g. reliable"
            className="w-full border-2 border-[#181513] bg-background px-3 py-3 font-mono text-sm outline-none focus:border-[#ff5038]"
            maxLength={32}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setWord('');
                onClose();
              }}
              className="flex-1 border-2 border-[#181513] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-widest"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={createWord.isPending || word.trim().length < 2}
              className="flex-1 bg-[#181513] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#fff8ef] disabled:opacity-50"
            >
              {createWord.isPending ? 'Saving…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
