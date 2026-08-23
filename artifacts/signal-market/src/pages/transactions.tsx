import { useListTransactions } from "@workspace/api-client-react";
import { ReceiptText, ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function Transactions() {
  const { data: transactions, isLoading } = useListTransactions();

  if (isLoading) {
    return <div className="container mx-auto py-10 px-4">Loading transactions...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <ReceiptText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-extrabold tracking-tight">Your Ratings</h1>
      </div>
      <p className="text-muted-foreground mb-8">Your non-refundable community rating history.</p>

      <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
        {transactions && transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium text-right">Rating</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-base mb-1">{tx.productTitle}</div>
                      <div className="text-muted-foreground text-[10px] uppercase flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Non-refundable community rating
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold">
                      {tx.rating ? `${tx.rating} / 5` : "Legacy signal"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-foreground">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={tx.status === 'paid' ? 'success' : tx.status === 'failed' ? 'destructive' : 'secondary'}>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {tx.receiptUrl ? (
                        <a 
                          href={tx.receiptUrl} 
                          target="_blank" 
                          rel="norenoopener noreferrer"
                          className="inline-flex items-center text-primary hover:underline text-xs font-medium"
                        >
                          View <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <ReceiptText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No ratings yet</h3>
            <p className="text-muted-foreground mb-6">Explore the directory to add your community rating to a company profile.</p>
            <Link href="/explore" className="text-primary font-bold hover:underline">
              Explore Companies &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
