import { useState } from "react";
import { Link, useParams } from "wouter";
import { useAuth } from "@clerk/react";
import { useCreateBattleCheckout, useGetBattle } from "@workspace/api-client-react";
import { ArrowLeft, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const DISCLOSURE =
  "This $0.99 community battle pick is non-refundable. It is not investment advice, an endorsement, a securities transaction, or a guarantee of either company's performance. YC Signal is not affiliated with Y Combinator.";

export default function BattleDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const { isSignedIn } = useAuth();
  const { data: battle, isLoading, error } = useGetBattle(slug);
  const checkout = useCreateBattleCheckout();
  const { toast } = useToast();
  const [accepted, setAccepted] = useState(false);
  const [side, setSide] = useState<"left" | "right" | null>(null);

  async function onPay() {
    if (!battle || !side) return;
    if (!isSignedIn) {
      toast({ title: "Sign in required", description: "Sign in to pick a side." });
      return;
    }
    if (!accepted) {
      toast({ title: "Disclosure required", description: "Accept the disclosure to continue." });
      return;
    }
    try {
      const session = await checkout.mutateAsync({
        battleId: battle.id,
        side,
        disclosureAccepted: true,
      });
      window.location.href = session.checkoutUrl;
    } catch (err) {
      toast({
        title: "Checkout failed",
        description: err instanceof Error ? err.message : "Unable to start checkout.",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return <div className="container mx-auto py-16 px-4"><div className="h-64 bg-muted animate-pulse rounded-xl" /></div>;
  }

  if (error || !battle) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Battle not found</h1>
        <Button asChild variant="outline"><Link href="/battles">Back to battles</Link></Button>
      </div>
    );
  }

  const total = battle.leftVoteCount + battle.rightVoteCount;
  const leftPct = total > 0 ? Math.round((battle.leftVoteCount / total) * 100) : 50;

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Link href="/battles" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> All battles
      </Link>

      <div className="mb-8">
        <Badge className="mb-3">{battle.space}</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Swords className="h-8 w-8 text-primary" />
          {battle.title}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">{battle.description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {([
          { key: "left" as const, product: battle.left, argument: battle.leftArgument, votes: battle.leftVoteCount },
          { key: "right" as const, product: battle.right, argument: battle.rightArgument, votes: battle.rightVoteCount },
        ]).map(({ key, product, argument, votes }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSide(key)}
            className={`text-left rounded-xl border transition-all ${
              side === key ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/40"
            }`}
          >
            <Card className="border-0 shadow-none">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-2xl">{product.title}</CardTitle>
                  <Badge variant={product.source === "yc" ? "default" : "secondary"}>
                    {product.source === "yc" ? "YC" : "Non-YC"}
                  </Badge>
                </div>
                <CardDescription>{product.shortDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed">{argument}</p>
                <p className="text-xs text-muted-foreground font-mono">{votes} paid picks</p>
                {product.websiteUrl && (
                  <a
                    href={product.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit site
                  </a>
                )}
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <div className="mb-8">
        <div className="h-3 rounded-full bg-muted overflow-hidden flex">
          <div className="bg-primary h-full" style={{ width: `${leftPct}%` }} />
          <div className="bg-foreground/25 h-full" style={{ width: `${100 - leftPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{leftPct}% {battle.left.title}</span>
          <span>{100 - leftPct}% {battle.right.title}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pay $0.99 to lock your pick</CardTitle>
          <CardDescription>One pick per battle. Non-refundable community signal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-start gap-3 text-sm leading-relaxed cursor-pointer">
            <Checkbox checked={accepted} onCheckedChange={(v) => setAccepted(v === true)} className="mt-0.5" />
            <span>{DISCLOSURE}</span>
          </label>
          <Button
            size="lg"
            className="w-full sm:w-auto"
            disabled={!side || !accepted || checkout.isPending}
            onClick={onPay}
          >
            {!side
              ? "Select a side"
              : checkout.isPending
                ? "Starting checkout…"
                : `Pay $0.99 for ${side === "left" ? battle.left.title : battle.right.title}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
