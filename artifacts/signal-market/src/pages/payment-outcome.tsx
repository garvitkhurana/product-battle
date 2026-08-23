import { useEffect } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function PaymentSuccess() {
  const { toast } = useToast();
  
  useEffect(() => {
    toast({
      title: "Rating recorded!",
      description: "Your $0.99 community rating has been submitted.",
    });
  }, [toast]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="bg-card border rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">Rating Submitted.</h1>
        <p className="text-muted-foreground mb-8">
          Your $0.99 rating has been recorded. It is non-refundable and reflects a community opinion only; it is not investment advice, an endorsement, or a performance guarantee.
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full h-12 text-base font-bold">
            <Link href="/explore">Explore More Companies</Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-12">
            <Link href="/transactions">View Receipt</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PaymentCancel() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="bg-card border rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <XCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">Rating Cancelled</h1>
        <p className="text-muted-foreground mb-8">
          Your transaction was not completed. No rating was submitted, and you have not been charged.
        </p>
        <Button asChild className="w-full h-12 font-bold">
          <Link href="/explore">Return to Explore</Link>
        </Button>
      </div>
    </div>
  );
}
