import { useListTransactions } from '@workspace/api-client-react';
import { Loader2, ReceiptText, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'wouter';

export default function Transactions() {
  const { data: transactions, isLoading, error } = useListTransactions();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 container mx-auto px-4 py-12 flex justify-center">
        <div className="p-8 border border-destructive bg-destructive/5 text-center">
          <p className="font-bold text-destructive">Failed to load history</p>
        </div>
      </div>
    );
  }

  const hasHistory = transactions && transactions.length > 0;

  return (
    <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Historical Receipts</h1>
        <p className="text-muted-foreground font-mono max-w-xl">
          Legacy transaction records from the previous paid-signal era. 
          The engine is now completely free and relies purely on participation volume.
        </p>
      </header>

      {!hasHistory ? (
        <div className="p-16 border border-border bg-card text-center space-y-4">
          <ReceiptText className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
          <h2 className="font-bold text-lg">No Legacy Records</h2>
          <p className="font-mono text-sm text-muted-foreground">You do not have any historical paid transactions.</p>
        </div>
      ) : (
        <div className="border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="p-4 font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">Date</th>
                  <th className="p-4 font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">Target</th>
                  <th className="p-4 font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold text-right">Value</th>
                  <th className="p-4 font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      {format(new Date(tx.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="p-4">
                      {tx.kind === 'battle' ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">Battle: {tx.battleTitle}</span>
                          <span className="text-xs text-muted-foreground">Voted: {tx.selectedParticipantName}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{tx.productTitle}</span>
                          <span className="text-xs text-muted-foreground">Rating: {tx.rating}/5</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      ${(tx.amount / 100).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs uppercase tracking-wider ${
                        tx.status === 'paid' ? 'bg-primary/10 text-primary border border-primary/20' :
                        tx.status === 'refunded' ? 'bg-secondary/20 text-foreground border border-secondary/30' :
                        'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="p-6 bg-muted/30 border border-border flex items-center justify-between">
        <p className="font-mono text-sm text-muted-foreground">Want to shape the current engine?</p>
        <Link href="/swipe" className="font-bold text-sm hover:text-primary transition-colors flex items-center gap-2">
          Start comparing <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
