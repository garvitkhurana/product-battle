import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { getGetPaymentQueryKey, useGetPayment } from "@workspace/api-client-react";
import { useUser } from "@clerk/react";

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
  const isPending = Boolean(paymentId) && (!payment || payment.status === "pending");
  const isPaid = payment?.status === "paid";
  const activity = isBattle ? "vote" : "rating";
  
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
    </div>
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
