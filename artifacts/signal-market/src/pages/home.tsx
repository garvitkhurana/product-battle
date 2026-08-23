import { Link } from "wouter";
import { useListProducts, useGetRankings } from "@workspace/api-client-react";
import { ArrowRight, TrendingUp, Trophy, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export default function Home() {
  const { data: products, isLoading: isLoadingProducts } = useListProducts({ sort: "trending" });
  const { data: rankings, isLoading: isLoadingRankings } = useGetRankings();

  const featured = products?.filter(p => p.featured) || [];
  const trending = products?.filter(p => !p.featured).slice(0, 6) || [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-foreground text-background py-24 md:py-32 px-4">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
        
        <div className="container mx-auto relative z-10 text-center max-w-3xl">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none mb-6 px-3 py-1">
            Community ratings, not advice.
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Read the room. <br />
            <span className="text-primary">Rate the batch.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore YC companies and share a paid 1–5 community rating. Ratings are opinions, not investment advice, endorsements, or performance guarantees.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto font-bold text-base h-14 px-8">
              <Link href="/explore">Explore Companies</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent border-muted-foreground/30 text-background hover:bg-background hover:text-foreground font-bold text-base h-14 px-8">
              <Link href="/submit">Add a Company</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 md:py-24 px-4 container mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Companies</h2>
            <p className="text-muted-foreground mt-2">A rotating view of YC company profiles.</p>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link href="/explore">View all <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        {isLoadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.length > 0 ? (
              featured.map(product => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                No featured companies yet.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Rankings & Trending Grid */}
      <section className="bg-muted/30 py-16 md:py-24 px-4 border-t">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Trending Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">Most Discussed</h2>
            </div>
            
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {trending.length > 0 ? (
                  trending.map(product => <ProductCard key={product.id} product={product} compact />)
                ) : (
                  <div className="col-span-full py-8 text-center text-muted-foreground">
                    No companies to show right now.
                  </div>
                )}
              </div>
            )}
            <div className="mt-8">
              <Button variant="outline" className="w-full md:w-auto" asChild>
                <Link href="/explore">Explore all companies</Link>
              </Button>
            </div>
          </div>

          {/* Top Leaderboard */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold tracking-tight">Top Rated</h2>
            </div>
            
            <Card className="bg-background border-border overflow-hidden">
              {isLoadingRankings ? (
                <div className="p-6 space-y-6">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex gap-4 items-center">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : rankings && rankings.length > 0 ? (
                <div className="divide-y">
                  {rankings.slice(0, 5).map(({ rank, product }) => (
                    <Link key={product.id} href={`/companies/${product.slug}`} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group">
                      <div className="w-8 flex justify-center text-lg font-mono font-bold text-muted-foreground group-hover:text-primary">
                        #{rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{product.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{product.ycBatch} · {product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-bold">{product.ratingAverage.toFixed(1)} / 5</p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{product.voteCount} ratings</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Leaderboard is empty.
                </div>
              )}
            </Card>
          </div>
          
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, compact = false }: { product: any, compact?: boolean }) {
  return (
    <Link href={`/companies/${product.slug}`} className="block group h-full">
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md hover:border-primary/50 overflow-hidden">
        {!compact && product.imageUrl && (
          <div className="aspect-video w-full overflow-hidden bg-muted relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <CardHeader className={compact ? "p-4 pb-2" : "p-5 pb-3"}>
          <div className="flex justify-between items-start gap-2 mb-2">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-mono">
              {product.ycBatch} · {product.category}
            </Badge>
            {product.featured && <Badge variant="default" className="text-[10px] bg-primary">Featured</Badge>}
          </div>
          <CardTitle className={cn("line-clamp-1 group-hover:text-primary transition-colors", compact ? "text-base" : "text-xl")}>
            {product.title}
          </CardTitle>
          <CardDescription className={cn("line-clamp-2 mt-1", compact ? "text-xs" : "text-sm")}>
            {product.shortDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className={cn("flex-1", compact ? "p-4 pt-0" : "p-5 pt-0")}>
          <div className="mt-auto pt-4 flex items-center justify-between border-t text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Rating</span>
              <span className="font-mono font-bold">{product.ratingAverage.toFixed(1)} / 5</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Community</span>
              <span className="font-mono font-bold text-primary">{product.voteCount} ratings</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProductCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardHeader className="p-5 pb-3">
        <Skeleton className="h-4 w-16 mb-3" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end p-5 pt-0 mt-4">
        <div className="border-t pt-4 flex justify-between">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
