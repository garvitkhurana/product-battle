import { useState } from 'react';

type Participant = {
  name: string;
  imageUrl?: string | null;
};

type CompanyMarkProps = {
  participant: Participant;
  tone?: 'red' | 'lime' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const toneClasses = {
  red: 'bg-[#ff5038]',
  lime: 'bg-[#d7ff45]',
  neutral: 'bg-white',
};

const sizeClasses = {
  sm: 'h-10 w-10 text-xs',
  md: 'h-16 w-16 text-xl',
  lg: 'h-24 w-24 text-3xl',
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function CompanyMark({
  participant,
  tone = 'neutral',
  size = 'md',
  className = '',
}: CompanyMarkProps) {
  const [imageFailed, setImageFailed] = useState(!participant.imageUrl);

  return (
    <div
      className={`shrink-0 border-2 border-[#181513] ${sizeClasses[size]} ${toneClasses[tone]} ${className} flex items-center justify-center overflow-hidden`}
      aria-hidden="true"
    >
      {participant.imageUrl && !imageFailed ? (
        <img
          src={participant.imageUrl}
          alt=""
          className="h-full w-full bg-white object-contain p-2"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="font-mono font-bold leading-none text-[#181513]">{initials(participant.name)}</span>
      )}
    </div>
  );
}