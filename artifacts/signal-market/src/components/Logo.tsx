import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  iconClassName?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  variant?: 'light' | 'dark';
};

export function Logo({
  className,
  iconClassName = 'h-9 w-9',
  showWordmark = true,
  wordmarkClassName,
  variant = 'light',
}: LogoProps) {
  if (showWordmark && variant === 'dark') {
    return (
      <img
        src="/logo-lockup.png"
        alt="YC Battle"
        className={cn('h-9 w-auto', className)}
      />
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <img
        src={variant === 'dark' ? '/logo-mark.png' : '/logo.svg'}
        alt=""
        className={cn('shrink-0 object-contain', iconClassName, variant === 'dark' && 'object-top')}
        aria-hidden
      />
      {showWordmark ? (
        <span className={cn('font-bold text-xl tracking-tight text-[#4c00ff]', wordmarkClassName)}>
          YC BATTLE
        </span>
      ) : null}
    </span>
  );
}
