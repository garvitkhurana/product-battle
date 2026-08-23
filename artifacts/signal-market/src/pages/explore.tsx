import React, { useState } from "react";
import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["All", "AI", "B2B", "Consumer", "Developer Tools", "Fintech", "Healthcare", "Marketplace"];
const SORTS = [
  { label: "Trending", value: "trending" },
  { label: "Newest", value: "newest" },
  { label: "Most Discussed", value: "community" },
];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"trending" | "newest" | "community">("trending");

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: products, isLoading } = useListProducts({
    search: debouncedSearch || undefined,
    category: category === "All" ? undefined : category,
    sort
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Explore YC Companies</h1>
          <p className="text-muted-foreground">Browse profiles and add your community rating.</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search companies, batches, locations..." 
              className="pl-9 bg-card"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {SORTS.map(s => (
              <Button 
                key={s.value}
                variant={sort === s.value ? "default" : "outline"} 
                size="sm"
                onClick={() => setSort(s.value as any)}
                className="shrink-0"
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Categories
              </h3>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      category === c 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[360px] bg-muted animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(product => (
                <Link key={product.id} href={`/companies/${product.slug}`} className="block group">
                  <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md hover:border-primary/50 overflow-hidden bg-card">
                    {product.imageUrl ? (
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img 
                          src={product.imageUrl} 
                          alt={product.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm font-mono">{product.category}</span>
                      </div>
                    )}
                    <CardHeader className="p-5 pb-3">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-mono">
                          {product.ycBatch} · {product.category}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors text-lg">
                        {product.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1 text-sm">
                        {product.shortDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-5 pt-0 mt-auto">
                      <div className="mt-4 pt-4 flex items-center justify-between border-t text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-[10px] uppercase tracking-wider">Average rating</span>
                          <span className="font-mono font-bold">{product.ratingAverage.toFixed(1)} / 5</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-muted-foreground text-[10px] uppercase tracking-wider">Community</span>
                          <span className="font-mono font-bold text-primary">{product.voteCount} ratings</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-card rounded-xl border border-dashed flex flex-col items-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No companies found</h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                We couldn't find any company profiles matching your current filters. 
              </p>
              <Button variant="outline" onClick={() => { setSearch(""); setCategory("All"); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

