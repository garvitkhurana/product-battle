import { Link, useRoute } from 'wouter';
import { getGetCompanyPerceptionQueryKey, useCreateCompanyClaim, useGetCompanyPerception } from '@workspace/api-client-react';
import { Loader2, AlertCircle, BarChart3, Database } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useAuth } from '@clerk/react';

export default function CompanyProfile() {
  const [, params] = useRoute('/companies/:slug');
  const slug = params?.slug || '';
  const { isSignedIn } = useAuth();
  const createClaim = useCreateCompanyClaim();
  const [claimOpen, setClaimOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  
  const { data: profile, isLoading, error } = useGetCompanyPerception(slug, {
    query: { enabled: !!slug, queryKey: getGetCompanyPerceptionQueryKey(slug) }
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex-1 container mx-auto px-4 py-12 flex justify-center">
        <div className="p-8 border border-border bg-card max-w-md text-center space-y-4">
          <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground" />
          <h2 className="font-bold">Profile Unavailable</h2>
          <p className="font-mono text-sm text-muted-foreground">This entity is not actively mapped in the perception engine.</p>
        </div>
      </div>
    );
  }

  const submitClaim = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (claimMessage.trim().length < 10) return;
    createClaim.mutate(
      { data: { participantId: profile.participant.id, message: claimMessage.trim() } },
      { onSuccess: () => setClaimSubmitted(true) },
    );
  };

  return (
    <div className="flex-1 bg-background text-foreground">
      {/* Profile Header */}
      <header className="border-b border-border bg-card relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5">
           <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }} />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 md:w-48 md:h-48 bg-background border-2 border-foreground shrink-0 flex items-center justify-center overflow-hidden">
            {profile.participant.imageUrl ? (
               <img src={profile.participant.imageUrl} alt="" className="w-full h-full object-cover grayscale mix-blend-multiply" />
            ) : (
              <span className="text-6xl font-bold">{profile.participant.name.substring(0,1)}</span>
            )}
          </div>
          
          <div className="space-y-6 flex-1">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest bg-foreground text-background px-3 py-1 mb-4">
                {profile.participant.category}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1]">{profile.participant.name}</h1>
              <p className="text-xl md:text-2xl font-mono text-muted-foreground mt-4 max-w-2xl">
                {profile.participant.shortDescription}
              </p>
            </div>
            
            <div className="flex gap-4">
              {profile.participant.websiteUrl && (
                <a href={profile.participant.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex px-6 py-2 border border-foreground font-bold text-sm hover:bg-foreground hover:text-background transition-colors">
                  External Domain
                </a>
              )}
            </div>
          </div>
          
          <div className="shrink-0 space-y-4 text-right hidden md:block">
            <div className="space-y-1">
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Signal Base</div>
              <div className="text-3xl font-bold">{profile.comparisonCount >= 10 ? profile.comparisonCount.toLocaleString() : 'Collecting'}</div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Confidence</div>
              <div className="text-3xl font-bold text-primary">{profile.confidence}%</div>
            </div>
            <div className="space-y-1 pt-4 border-t border-border">
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Status</div>
              <div className="text-sm font-bold uppercase tracking-widest flex items-center justify-end gap-2">
                <span className={`w-2 h-2 ${profile.profileStatus === 'emerging' ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                {profile.profileStatus}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">
        
        {/* Left Column */}
        <div className="space-y-16">
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" /> Object Context
            </h2>
            <div className="prose prose-neutral max-w-none font-mono text-muted-foreground leading-relaxed">
              <p>{profile.participant.description}</p>
            </div>
          </section>

          {/* Perception Axes */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Sentiment Vectors
            </h2>
            
            {profile.confidence < 30 ? (
              <div className="p-8 border border-dashed border-border bg-muted/20 text-center space-y-2">
                <p className="font-bold">Insufficient Signals</p>
                <p className="font-mono text-sm text-muted-foreground">The confidence threshold ({profile.confidence}%) is too low to expose public sentiment vectors securely.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {profile.axes.map(axis => (
                  <div key={axis.key} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <div className="font-bold text-sm uppercase tracking-widest">{axis.label}</div>
                        <div className="font-mono text-xs text-muted-foreground">Confidence: {axis.confidence}%</div>
                      </div>
                      <div className="font-mono text-lg font-bold">{axis.score.toFixed(1)}<span className="text-muted-foreground text-sm">/5</span></div>
                    </div>
                    <div className="h-4 w-full bg-muted relative border border-border/50">
                      <div className="absolute top-0 bottom-0 left-0 bg-primary/20 border-r border-primary" style={{ width: `${(axis.score/5)*100}%` }} />
                      {/* Mark the mean/neutral point */}
                      <div className="absolute top-0 bottom-0 left-[50%] w-px bg-foreground/20" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column / Sidebar */}
        <div className="space-y-8">
          {/* Associated Lexicon */}
          <div className="border border-border bg-card p-6 space-y-6">
            <h3 className="font-bold uppercase tracking-widest text-sm">Associated Lexicon</h3>
            {profile.confidence < 30 ? (
              <p className="font-mono text-xs text-muted-foreground">Awaiting volume threshold.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.words?.map((w, i) => (
                  <span key={i} className="px-2 py-1 bg-muted/50 border border-border font-mono text-xs text-muted-foreground hover:bg-foreground hover:text-background transition-colors cursor-default" title={`Count: ${w.count}`}>
                    {w.word}
                  </span>
                ))}
                {!profile.words?.length && <span className="font-mono text-xs text-muted-foreground">No recurring patterns extracted.</span>}
              </div>
            )}
          </div>

          {/* Affinities */}
          <div className="border border-border bg-card p-6 space-y-6">
            <h3 className="font-bold uppercase tracking-widest text-sm">Nearest Neighbors</h3>
            {profile.confidence < 40 ? (
              <p className="font-mono text-xs text-muted-foreground">Clustering incomplete.</p>
            ) : (
              <ul className="space-y-3">
                {profile.affinities?.map((aff, i) => (
                  <li key={i} className="font-mono text-sm border-b border-border pb-2 last:border-0 last:pb-0 truncate">
                    {aff}
                  </li>
                ))}
                {!profile.affinities?.length && <li className="font-mono text-xs text-muted-foreground">No strong correlations.</li>}
              </ul>
            )}
          </div>
          
          {/* Claim Box */}
          <div className="p-6 bg-muted/30 border border-border space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-widest">Founder Access</h3>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              Are you building this? Claim this profile to respond to community perception or submit corrections to the factual context.
            </p>
            {!isSignedIn ? (
              <Link href="/sign-in" className="block w-full px-4 py-2 border border-foreground text-center font-bold text-xs uppercase hover:bg-foreground hover:text-background transition-colors">
                Sign in to claim
              </Link>
            ) : claimSubmitted ? (
              <p className="border border-primary bg-primary/5 px-4 py-3 text-center font-mono text-xs text-primary">
                Claim submitted for review.
              </p>
            ) : claimOpen ? (
              <form onSubmit={submitClaim} className="space-y-3">
                <textarea
                  value={claimMessage}
                  onChange={(event) => setClaimMessage(event.target.value)}
                  minLength={10}
                  maxLength={1000}
                  required
                  placeholder="Briefly describe your relationship to this company."
                  className="min-h-24 w-full border border-border bg-background p-3 font-mono text-xs outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={createClaim.isPending || claimMessage.trim().length < 10}
                  className="w-full px-4 py-2 bg-foreground text-background font-bold text-xs uppercase disabled:opacity-50"
                >
                  {createClaim.isPending ? 'Submitting' : 'Submit claim'}
                </button>
                {createClaim.isError && <p className="font-mono text-xs text-destructive">We could not submit this claim. Please try again.</p>}
              </form>
            ) : (
              <button onClick={() => setClaimOpen(true)} className="w-full px-4 py-2 border border-foreground font-bold text-xs uppercase hover:bg-foreground hover:text-background transition-colors">
                Initiate Claim
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
