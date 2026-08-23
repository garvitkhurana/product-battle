import { LockKeyhole } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthRequired({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const redirectUrl = typeof window === "undefined" ? "/" : window.location.pathname;

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md text-center shadow-sm">
        <CardHeader className="items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">{description}</p>
          <Button asChild className="w-full">
            <Link href={`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`}>Sign in to continue</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}