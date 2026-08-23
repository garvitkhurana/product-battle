import React, { useState } from "react";
import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Search, SlidersHorizontal, Tags } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/** Match YC top-level industries in directory.json */
const INDUSTRIES = [
  "All",
  "B2B",
  "Consumer",
  "Fintech",
  "Healthcare",
  "Industrials",
  "Education",
  "Real Estate and Construction",
];

/** Popular YC tags — filtered via `tag` query, not `category` */
const TAGS = ["AI", "Developer Tools", "Marketplace", "SaaS", "Climate"];

const SORTS = [
  { label: "Trending", value: "trending" },
  { label: "Newest", value: "newest" },
  { label: "Most Discussed", value: "community" },
];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState<string | undefined>();
  const [sort, setSort] = useState<"trending" | "newest" | "community">("trending");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: products, isLoading } = useListProducts({
    search: debouncedSearch || undefined,
    category: category === "All" ? undefined : category,
    tag,
    sort,
    source: "yc",
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
            {SORTS.map((s) => (
              <Button
                key={s.value}
                variant={sort === s.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSort(s.value as "trending" | "newest" | "community")}
                className="shrink-0"
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Industries
              </h3>
              <div className="flex flex-col gap-1">
                {INDUSTRIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      category === c
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {c === "Real Estate and Construction" ? "Real Estate" : c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Tags className="h-4 w-4" /> Popular tags
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTag(undefined)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    !tag ? "bg-primary/10 text-primary border-primary/30" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  Any
                </button>
                {TAGS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t === tag ? undefined : t)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                      tag === t
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[360px] bg-muted animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
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
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                          {product.title}
                        </CardTitle>
                        <Badge variant="secondary" className="shrink-0 font-mono">
                          {product.ratingAverage > 0 ? product.ratingAverage.toFixed(1) : "—"}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 mt-1.5">
                        {product.shortDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-0">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground truncate">
                          {product.ycBatch} · {product.category}
                        </span>
                        <span className="font-medium tabular-nums">{product.voteCount} ratings</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed rounded-xl bg-muted/20">
              <h3 className="text-lg font-semibold mb-2">No companies found</h3>
              <p className="text-muted-foreground mb-6">Try another industry, tag, or search term.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setTag(undefined);
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
