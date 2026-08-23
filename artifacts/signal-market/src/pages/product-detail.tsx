import { useParams, useLocation } from "wouter";
import { useGetProduct, useCreateCheckout } from "@workspace/api-client-react";
import { ArrowLeft, CheckCircle2, TrendingUp, Calendar, ShieldAlert, Globe, MapPin, Star } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@clerk/react";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useLocation();
  const { isSignedIn } = useAuth();
  const { data: product, isLoading, isError } = useGetProduct(slug);
  const createCheckout = useCreateCheckout();
  const [disclosureAccepted, setDisclosureAccepted] = useState(false);
  const [rating, setRating] = useState(5);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-5xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div>
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto py-24 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Company not found</h2>
        <p className="text-muted-foreground mb-8">This company profile is unavailable or has been removed.</p>
        <Button asChild>
          <Link href="/explore">Back to Explore</Link>
        </Button>
      </div>
    );
  }

  const handleVote = () => {
    if (!isSignedIn) {
      setLocation("/sign-in?redirect_url=" + encodeURIComponent(`/companies/${slug}`));
      return;
    }

    createCheckout.mutate(
      { data: { productId: product.id, rating, disclosureAccepted } },
      {
        onSuccess: (session) => {
          window.location.href = session.checkoutUrl;
        }
      }
    );
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <Link href="/explore" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Companies
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Image */}
          {product.imageUrl ? (
            <div className="rounded-xl overflow-hidden bg-muted border aspect-[16/9] w-full">
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-xl bg-muted border aspect-[16/9] w-full flex items-center justify-center">
              <span className="text-muted-foreground font-mono">{product.category}</span>
            </div>
          )}

          {/* Header Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="font-mono uppercase tracking-wider">{product.ycBatch}</Badge>
              <Badge variant="outline">{product.category}</Badge>
              {product.featured && <Badge className="bg-primary">Featured</Badge>}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{product.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{product.shortDescription}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground py-6 border-y">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{product.location}</span>
            </div>
            {product.websiteUrl && (
              <a href={product.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
                <Globe className="h-4 w-4" />
                <span>Company website</span>
              </a>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Profile added {formatDate(product.createdAt)}</span>
            </div>
          </div>

          {/* Full Description */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h3 className="text-xl font-bold tracking-tight mb-4">About the company</h3>
            <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
              {product.description}
            </div>
          </div>
        </div>

        {/* Sidebar / Checkout */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card className="border-primary/20 shadow-lg overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <CardContent className="p-6">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Community rating</p>
                    <p className="text-4xl font-mono font-bold text-primary tracking-tighter">
                      {product.ratingAverage.toFixed(1)} / 5
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mono font-bold tracking-tighter">{product.voteCount}</p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ratings</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm">Choose a 1–5 rating for this company.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm">Your rating is counted once Stripe confirms payment.</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mb-6 border border-border/50">
                  <div className="flex items-start gap-3 mb-3">
                    <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <h4 className="text-sm font-bold">Important Disclosure</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    This $0.99 payment supports a <span className="font-bold text-foreground">community opinion</span>. 
                    It is <span className="font-bold text-foreground">NOT</span> investment advice, an endorsement, a securities transaction, or a guarantee of company performance. 
                    Your payment is non-refundable.
                  </p>
                  <label className="flex items-start gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="mt-1 shrink-0 accent-primary"
                      checked={disclosureAccepted}
                      onChange={(e) => setDisclosureAccepted(e.target.checked)}
                    />
                    <span className="text-xs font-medium group-hover:text-foreground transition-colors">
                      I understand this is a non-refundable community rating, not financial advice.
                    </span>
                  </label>
                </div>

                <div className="mb-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your rating</p>
                  <div className="flex gap-1" role="radiogroup" aria-label="Choose a rating from one to five">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={rating === value}
                        onClick={() => setRating(value)}
                        className={`rounded-md p-2 transition-colors ${value <= rating ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                      >
                        <Star className="h-5 w-5" fill={value <= rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full font-bold text-base h-14 relative group overflow-hidden"
                  disabled={!disclosureAccepted || createCheckout.isPending || product.status !== "published"}
                  onClick={handleVote}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {createCheckout.isPending ? "Processing..." : `Rate ${rating}/5 for $0.99`}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                </Button>
                
                {product.status !== "published" && (
                  <p className="text-center text-xs text-destructive mt-3 font-medium">
                    Voting is disabled. Status: {product.status}
                  </p>
                )}
                {!isSignedIn && product.status === "published" && (
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    You will be asked to sign in first.
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="bg-card border rounded-xl p-5 text-sm">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> About this rating
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                  A small payment adds intent to an opinion. It does not predict outcomes, measure company quality objectively, or recommend an investment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
