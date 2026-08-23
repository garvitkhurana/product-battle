import { Link } from "wouter";
import { Show, useClerk, useUser } from "@clerk/react";
import { Activity, Plus, LayoutDashboard, ReceiptText, Search, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">YC Signal</span>
          </Link>
          <nav className="hidden md:flex gap-1">
            <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-md transition-colors hover:bg-accent flex items-center gap-2">
              <Search className="h-4 w-4" />
              Explore
            </Link>
            <Link href="/battles" className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-md transition-colors hover:bg-accent flex items-center gap-2">
              <Swords className="h-4 w-4" />
              Battles
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Show when="signed-in">
            <Link href="/submit" className="hidden sm:inline-flex text-sm font-medium hover:text-primary transition-colors flex items-center gap-1.5 mr-2">
              <Plus className="h-4 w-4" />
              Add Company
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block"></div>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-accent transition-colors" title="Dashboard">
              <LayoutDashboard className="h-4 w-4" />
            </Link>
            <Link href="/transactions" className="text-sm font-medium text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-accent transition-colors mr-2" title="Transactions">
              <ReceiptText className="h-4 w-4" />
            </Link>
            <AccountControl />
          </Show>
          <Show when="signed-out">
            <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
            <Button asChild size="sm">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </Show>
        </div>
      </div>
    </header>
  );
}

function AccountControl() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <div className="flex items-center gap-2">
      <span className="hidden lg:inline text-xs font-medium text-muted-foreground">
        {user?.firstName ?? "Account"}
      </span>
      <button
        type="button"
        data-testid="button-sign-out"
        onClick={() => signOut({ redirectUrl: "/" })}
        className="text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        Sign out
      </button>
    </div>
  );
}
