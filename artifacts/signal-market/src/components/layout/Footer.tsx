import { Activity } from "lucide-react";
import { Link, useLocation } from "wouter";

export function Footer() {
  const [location] = useLocation();
  const isBattleBoardPage = location === "/" || location === "/battles";

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <Activity className="h-4 w-4" />
              </div>
               <span className="font-bold text-lg tracking-tight">YC Battle</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
               A head-to-head marketplace for backing your favorite YC companies. Every paid battle vote is non-refundable, not investment advice, and not a guarantee of company performance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/battles#active-battles"
                  onClick={(event) => {
                    if (!isBattleBoardPage) return;
                    event.preventDefault();
                    window.history.replaceState(null, "", `${window.location.pathname}#active-battles`);
                    document.getElementById("active-battles")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="hover:text-primary transition-colors"
                >
                  Active Battles
                </Link>
              </li>
              <li><Link href="/submit" className="hover:text-primary transition-colors">Add a Battle</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
               <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
               <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
               <li><Link href="/voting-disclosure" className="hover:text-primary transition-colors">Voting Disclosure</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
             &copy; {new Date().getFullYear()} YC Battle. Community opinions, not YC-affiliated.
          </p>
        </div>
      </div>
    </footer>
  );
}
