import { useEffect } from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { getGetPaymentQueryKey, useGetPayment, useListBattles, type Battle } from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import { nextHouseholdBattles } from "@/lib/household-battles";

export function PaymentSuccess() {
  const { toast } = useToast();
  const { user } = useUser();
  const params = new URLSearchParams(window.location.search);
  const isBattle = params.get("type") === "battle";
  const paymentId = params.get("payment_id") ?? "";
  const { data: payment } = useGetPayment(paymentId, {
    query: {
      enabled: Boolean(paymentId && (user || isBattle)),
      queryKey: getGetPaymentQueryKey(paymentId),
      refetchInterval: 2_000,
    },
  });
  const { data: battles } = useListBattles({
    query: { enabled: isBattle },
  });
  const isPending = Boolean(paymentId) && (!payment || payment.status === "pending");
  const isPaid = payment?.status === "paid";
  const activity = isBattle ? "vote" : "rating";
  const nextBattles = isBattle ? nextHouseholdBattles(battles ?? [], payment?.battleId) : [];
  
  useEffect(() => {
    toast({
      title: isPaid ? `${isBattle ? "Vote" : "Rating"} recorded!` : "Payment processing",
      description: isPaid
        ? `Your $0.99 community ${activity} has been verified.`
        : "We are confirming your payment before recording your community opinion.",
    });
  }, [toast, isPaid, isBattle, activity]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="bg-card border rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">
          {isPaid ? (isBattle ? "Vote Submitted." : "Rating Submitted.") : "Payment Processing."}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isPending
            ? "Your payment is being verified. This page will update automatically once your community opinion is recorded."
            : isPaid && isBattle
            ? "Your $0.99 vote has been recorded. It is non-refundable and reflects a community opinion only; it is not investment advice, an endorsement, or a performance guarantee."
            : isPaid
              ? "Your $0.99 rating has been recorded. It is non-refundable and reflects a community opinion only; it is not investment advice, an endorsement, or a performance guarantee."
              : "We could not confirm this payment yet. Check your receipt history or try again later."
          }
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full h-12 text-base font-bold">
            <Link href={isBattle ? "/battles" : "/explore"}>
              {isBattle ? "Explore More Battles" : "Explore More Companies"}
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-12">
            <Link href={user ? "/transactions" : "/battles"}>
              {user ? "View Receipt" : "Back to Battles"}
            </Link>
          </Button>
        </div>
      </div>
      {nextBattles.length > 0 && (
        <section className="mt-8 w-full max-w-md">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#211b18]/55">
            Next famous matchup
          </p>
          <div className="flex flex-col gap-3">
            {nextBattles.map((battle) => (
              <NextBattleLink key={battle.id} battle={battle} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function NextBattleLink({ battle }: { battle: Battle }) {
  return (
    <Link
      href={`/battles/${battle.slug}`}
      className="group flex items-center overflow-hidden border-2 border-[#211b18] bg-[#f8e9d8] shadow-[4px_4px_0_#211b18] transition-transform hover:-translate-y-0.5"
    >
      <span className="flex min-w-0 flex-1 items-center gap-2 bg-[#ff4f32] px-3 py-3">
        <span className="truncate text-sm font-extrabold tracking-[-0.03em]">{battle.participantA.name}</span>
      </span>
      <span className="shrink-0 border-x-2 border-[#211b18] bg-[#f8e9d8] px-2 py-3 font-mono text-[10px] font-bold italic">
        VS
      </span>
      <span className="flex min-w-0 flex-1 items-center justify-end gap-2 bg-[#d9f75b] px-3 py-3">
        <span className="truncate text-sm font-extrabold tracking-[-0.03em]">{battle.participantB.name}</span>
      </span>
      <span className="shrink-0 bg-[#211b18] px-2 py-3 text-[#f8e9d8]">
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function PaymentCancel() {
  const isBattle = new URLSearchParams(window.location.search).get("type") === "battle";

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="bg-card border rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <XCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">
          {isBattle ? "Vote Cancelled" : "Rating Cancelled"}
        </h1>
        <p className="text-muted-foreground mb-8">
          Your transaction was not completed. No {isBattle ? "vote" : "rating"} was submitted, and you have not been charged.
        </p>
        <Button asChild className="w-full h-12 font-bold">
          <Link href={isBattle ? "/battles" : "/explore"}>
            {isBattle ? "Return to Battles" : "Return to Explore"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
