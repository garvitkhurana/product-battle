import { useGetCreatorDashboard, useUpdateProductStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart3, Package, PauseCircle, PlayCircle, EyeOff, LayoutDashboard, DollarSign, Users } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getGetCreatorDashboardQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useGetCreatorDashboard();
  const updateStatus = useUpdateProductStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusToggle = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "paused" : "pending";
    updateStatus.mutate(
      { id, data: { status: newStatus as any } },
      {
        onSuccess: (updatedProduct) => {
          toast({
            title: "Status updated",
            description: `Company profile is now ${newStatus}.`,
          });
          queryClient.setQueryData(getGetCreatorDashboardQueryKey(), (old: any) => {
            if (!old) return old;
            return {
              ...old,
              products: old.products.map((p: any) => 
                p.id === id ? { ...p, status: newStatus } : p
              )
            };
          });
        }
      }
    );
  };

  if (isLoading) {
    return <div className="container mx-auto py-10 px-4">Loading dashboard...</div>;
  }

  if (!dashboard) return null;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-extrabold tracking-tight">My Company Profiles</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Community support</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-bold">{formatCurrency(dashboard.totalRaised)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across your company profiles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Ratings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-bold">{dashboard.totalVotes}</div>
            <p className="text-xs text-muted-foreground mt-1">Paid community ratings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published Profiles</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-bold">{dashboard.publishedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently open to ratings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paused/Pending</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-bold">{dashboard.pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Not open to ratings</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-6">Your Company Profiles</h2>
      
      <div className="bg-card rounded-xl border overflow-hidden">
        {dashboard.products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Ratings</th>
                  <th className="px-6 py-4 font-medium text-right">Community</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dashboard.products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-base mb-1">{product.title}</div>
                      <div className="text-muted-foreground text-xs">{formatDate(product.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.status === 'published' ? 'success' : product.status === 'rejected' ? 'destructive' : 'warning'}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold">
                      {product.voteCount}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-primary">
                      {formatCurrency(product.totalRaised)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/companies/${product.slug}`}>View</Link>
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleStatusToggle(product.id, product.status)}
                          disabled={updateStatus.isPending || product.status === "rejected" || product.status === "pending"}
                        >
                          {product.status === "published" ? (
                            <><PauseCircle className="h-4 w-4 mr-1" /> Pause</>
                          ) : product.status === "paused" ? (
                            <><PlayCircle className="h-4 w-4 mr-1" /> Request review</>
                          ) : (
                            <>Awaiting review</>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No company profiles yet</h3>
            <p className="text-muted-foreground mb-6">Add a public YC company profile for community review.</p>
            <Button asChild>
              <Link href="/submit">Add a Company</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
