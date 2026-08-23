import { Link } from "wouter";
import { useListBattles } from "@workspace/api-client-react";
import { Swords, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Battles() {
  const { data: battles, isLoading } = useListBattles();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mb-10">
        <Badge className="mb-4 bg-primary/15 text-primary border-none">$0.99 to pick a side</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3 flex items-center gap-3">
          <Swords className="h-9 w-9 text-primary" />
          Battles
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          YC company vs a non-YC player crushing in the same space. Pay $0.99 to say which one is better.
          Picks are opinions — not investment advice.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : battles && battles.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {battles.map((battle) => {
            const total = battle.leftVoteCount + battle.rightVoteCount;
            const leftPct = total > 0 ? Math.round((battle.leftVoteCount / total) * 100) : 50;
            return (
              <Link key={battle.id} href={`/battles/${battle.slug}`} className="block group">
                <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {battle.title}
                      </CardTitle>
                      {battle.featured && <Badge>Featured</Badge>}
                    </div>
                    <CardDescription>{battle.space}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>{battle.left.title}</span>
                      <span className="text-muted-foreground font-normal">vs</span>
                      <span>{battle.right.title}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                      <div className="bg-primary h-full" style={{ width: `${leftPct}%` }} />
                      <div className="bg-foreground/30 h-full" style={{ width: `${100 - leftPct}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{battle.leftVoteCount} picks</span>
                      <span>{total} total · $0.99</span>
                      <span>{battle.rightVoteCount} picks</span>
                    </div>
                    <Button variant="outline" className="w-full group-hover:border-primary">
                      Enter battle <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground">
          No battles seeded yet. Import rivalries after the YC company dump.
        </div>
      )}
    </div>
  );
}
