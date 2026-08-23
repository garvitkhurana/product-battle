import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useLocation } from "wouter";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isBattleDetail = /^\/battles\/[^/]+$/.test(location);

  return (
    <div className="min-h-[100dvh] flex flex-col w-full">
      {!isBattleDetail && <Navbar />}
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      {!isBattleDetail && <Footer />}
    </div>
  );
}
