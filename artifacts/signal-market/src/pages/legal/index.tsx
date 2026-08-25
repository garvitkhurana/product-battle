import { Link } from 'wouter';
import { FileText, MessageSquare, Shield, UserX } from 'lucide-react';
import { Seo } from '@/components/Seo';

export default function Legal() {
  return (
    <>
      <Seo
        title="Independence & Privacy — YC Battle"
        description="Read YC Battle's independence, privacy, anonymous session, and community perception policies."
        path="/legal"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Independence & Privacy',
          url: 'https://ycbattle.com/legal',
          isPartOf: { '@id': 'https://ycbattle.com/#website' },
        }}
      />
      <div className="flex-1 bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl space-y-16">
        
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 bg-foreground text-background">
            Context & Policies
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Independence & Privacy</h1>
          <p className="text-xl font-mono text-muted-foreground leading-relaxed">
            The perception engine is structurally neutral. Read our core operating principles and data policies below.
          </p>
        </header>

        <div className="space-y-12">
          {/* Independence */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-border pb-4">
              <UserX className="w-6 h-6 text-primary" /> Non-Affiliation
            </h2>
            <div className="prose prose-neutral max-w-none font-mono text-sm leading-relaxed space-y-4 text-muted-foreground">
              <p>
                <strong>This platform is completely independent.</strong> It is not created, endorsed, sponsored, or verified by Y Combinator or any of its affiliates.
              </p>
              <p>
                All company names, logos, and descriptions used within the comparisons are for informational identification purposes only. Their use does not imply endorsement or partnership. The terms "YC", "Y Combinator", and related marks are trademarks of their respective owners.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-border pb-4">
              <Shield className="w-6 h-6 text-primary" /> Data Privacy & Taste DNA
            </h2>
            <div className="prose prose-neutral max-w-none font-mono text-sm leading-relaxed space-y-4 text-muted-foreground">
              <p>
                The perception engine operates on anonymous, session-based telemetry. When you participate in a continuous comparison flow, we generate a <span className="text-foreground font-bold">Taste DNA</span> profile.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>No Tracking:</strong> We do not employ third-party trackers, pixel tags, or invasive cross-site tracking techniques.</li>
                <li><strong>Ephemeral Sessions:</strong> Your comparative choices are tied to a temporary session token. If you do not create an account, this connection is severed when your local storage clears.</li>
                <li><strong>Aggregate Signal:</strong> Individual preferences are immediately dissolved into the mathematical aggregate. We care about the cohort's geometry, not your specific identity.</li>
              </ul>
            </div>
          </section>

          {/* Community Words */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-border pb-4">
              <MessageSquare className="w-6 h-6 text-primary" /> Community Words
            </h2>
            <div className="prose prose-neutral max-w-none font-mono text-sm leading-relaxed space-y-4 text-muted-foreground">
              <p>
                Occasionally, participants may be shown an optional prompt to describe a company in one word. Submitted words are stored against the same ephemeral session as your comparisons and are never displayed publicly until at least 5 independent sessions submit the same word — this prevents any single submission from appearing as if it were verified community consensus.
              </p>
              <p>
                Words that never reach this threshold are not displayed and do not accumulate individual visibility. We reserve the right to filter or remove words that are abusive, spam, or manipulated.
              </p>
            </div>
          </section>

          {/* Terms */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-border pb-4">
              <FileText className="w-6 h-6 text-primary" /> Terms of Operation
            </h2>
            <div className="prose prose-neutral max-w-none font-mono text-sm leading-relaxed space-y-4 text-muted-foreground">
              <p>
                By utilizing the engine, you agree that all provided signals are genuine representations of your preference. Automated swiping, script-based manipulation, or orchestrated bridging of comparisons will result in the mathematical invalidation of those vectors.
              </p>
              <p>
                The gallery of comparisons is curated by human operators to ensure contrast quality. We reserve the right to remove or archive comparisons that fail to produce meaningful semantic difference.
              </p>
            </div>
          </section>
        </div>

        <div className="pt-12 border-t border-border flex justify-center">
          <Link href="/" className="font-bold uppercase tracking-widest text-sm hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">
            Return to Launch
          </Link>
        </div>
      </div>
      </div>
    </>
  );
}
