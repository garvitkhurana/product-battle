import React from 'react';
import { Link, useLocation } from 'wouter';
import { Layers, Activity, Fingerprint } from 'lucide-react';
import { Show, UserButton } from '@clerk/react';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Launch', icon: <Activity className="w-4 h-4" /> },
    { href: '/battles', label: 'Comparisons', icon: <Layers className="w-4 h-4" /> },
    { href: '/swipe', label: 'Continuous', icon: <Activity className="w-4 h-4" /> },
    { href: '/dna', label: 'Taste DNA', icon: <Fingerprint className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans bg-noise selection:bg-primary selection:text-white">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 min-h-16 py-3 md:h-16 md:py-0 flex flex-wrap items-center justify-between">
          <div className="flex min-w-0 items-center gap-8">
            <Link href="/" className="shrink-0 font-bold text-xl tracking-tight text-primary flex items-center gap-2">
              <span className="w-3 h-3 bg-primary" />
              YC BATTLE
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={location === item.href ? 'page' : undefined}
                  className={`text-sm font-medium tracking-wide flex items-center gap-2 transition-colors hover:text-primary ${
                    location === item.href ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="text-sm font-medium bg-foreground text-background px-4 py-2 hover:bg-primary transition-colors">
                Join
              </Link>
            </Show>
            <Show when="signed-in">
              <UserButton appearance={{ elements: { avatarBox: "rounded-none" } }} />
            </Show>
          </div>

          <nav
            aria-label="Primary navigation"
            className="order-3 -mx-4 flex basis-full gap-5 overflow-x-auto border-t border-border/70 pt-3 md:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={location === item.href ? 'page' : undefined}
                className={`shrink-0 text-xs font-medium tracking-wide flex items-center gap-1.5 transition-colors hover:text-primary ${
                  location === item.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
            <div className="md:col-span-2 space-y-4">
              <div className="font-bold tracking-tight text-xl flex items-center gap-2">
                <span className="w-3 h-3 bg-foreground" />
                YC BATTLE
              </div>
              <p className="text-muted-foreground text-sm max-w-sm font-mono leading-relaxed">
                An independent public perception engine. A sharp, cultural signal board capturing community confidence in emerging cohorts.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Platform</h4>
              <nav className="flex flex-col gap-3">
                <Link href="/submit" className="text-sm font-medium hover:text-primary transition-colors">Propose Comparison</Link>
                <Link href="/transactions" className="text-sm font-medium hover:text-primary transition-colors">Historical Receipts</Link>
                <Link href="/map" className="text-sm font-medium hover:text-primary transition-colors">Ecosystem map</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Legal</h4>
              <nav className="flex flex-col gap-3">
                <Link href="/legal" className="text-sm font-medium hover:text-primary transition-colors">Independence & Privacy</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Contact</h4>
              <a
                href="mailto:hello@ycbattle.com"
                className="break-all text-sm font-medium hover:text-primary transition-colors"
              >
                hello@ycbattle.com
              </a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-muted-foreground">
            <p>Not affiliated with Y Combinator.</p>
            <p>&copy; {new Date().getFullYear()} YC Battle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
