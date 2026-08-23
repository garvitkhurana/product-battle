import { useState } from 'react';
import { useCreateBattle } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, GitPullRequest } from 'lucide-react';
import { useAuth } from '@clerk/react';
import { AuthRequired } from '@/components/auth-required';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const participantSchema = z.object({
  name: z.string().min(2, "Name required").max(80),
  shortDescription: z.string().min(10, "Brief description required").max(120),
  description: z.string().min(20, "Full description required").max(1000),
  websiteUrl: z.string().url("Add a valid website URL"),
  category: z.string().min(2, "Category required").max(60),
  location: z.string().min(2, "Location required").max(80),
  isYcCompany: z.boolean().default(true),
});

const formSchema = z.object({
  description: z.string().min(20, "Context required").max(500),
  participantA: participantSchema,
  participantB: participantSchema,
});

export default function Submit() {
  const [success, setSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const createBattle = useCreateBattle();
  const { isLoaded, isSignedIn } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      participantA: { name: "", shortDescription: "", description: "", websiteUrl: "", category: "", location: "", isYcCompany: true },
      participantB: { name: "", shortDescription: "", description: "", websiteUrl: "", category: "", location: "", isYcCompany: false },
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSubmissionError(null);
    createBattle.mutate({ data: values }, {
      onSuccess: () => setSuccess(true),
      onError: (error) => {
        setSubmissionError(error instanceof Error ? error.message : "We could not submit this comparison. Please try again.");
      },
    });
  };

  if (!isLoaded) {
    return <div className="flex-1 container mx-auto px-4 py-12">Checking account...</div>;
  }

  if (!isSignedIn) {
    return (
      <AuthRequired
        title="Sign in to propose a comparison"
        description="Comparison proposals are reviewed before they can appear in the public cohort."
      />
    );
  }

  if (success) {
    return (
      <div className="flex-1 container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="max-w-md w-full bg-card border-2 border-foreground p-12 text-center space-y-6">
          <GitPullRequest className="w-12 h-12 mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Proposal Logged</h2>
          <p className="text-muted-foreground font-mono text-sm leading-relaxed">
            Your comparison proposal has been submitted to the review queue. We prioritize high-contrast pairs that isolate clear market vectors.
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <button onClick={() => { form.reset(); setSuccess(false); }} className="px-6 py-3 border border-border text-sm font-bold uppercase hover:bg-muted transition-colors">
              Submit Another
            </button>
            <Link href="/battles" className="px-6 py-3 bg-foreground text-background text-sm font-bold uppercase hover:bg-primary transition-colors">
              View Active Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Propose Comparison</h1>
        <p className="text-muted-foreground font-mono max-w-2xl leading-relaxed">
          The engine relies on precise, meaningful pairings. Submit two entities that represent a fork in approach, technology, or market thesis.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          {submissionError && (
            <p role="alert" className="border border-destructive bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              Submission failed: {submissionError}
            </p>
          )}
          
          <div className="p-6 md:p-8 border border-border bg-card space-y-6">
            <h3 className="font-bold uppercase tracking-widest border-b border-border pb-4">Comparison Context</h3>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase text-muted-foreground">What is the central tension?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g. Open-source raw primitives vs vertically integrated managed service..." 
                      className="min-h-[120px] font-mono text-sm resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Entity A */}
            <div className="p-6 md:p-8 border-2 border-foreground bg-card space-y-6">
              <h3 className="font-bold uppercase tracking-widest border-b border-foreground/20 pb-4 text-primary">Entity A</h3>
              
              <div className="space-y-4">
                <FormField control={form.control} name="participantA.name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs">Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="participantA.shortDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs">Headline</FormLabel>
                    <FormControl><Input placeholder="10-120 chars" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="participantA.category" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs">Category</FormLabel>
                    <FormControl><Input placeholder="e.g. Developer Tools" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="participantA.location" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs">Location</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="participantA.websiteUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs">Website URL</FormLabel>
                      <FormControl><Input type="url" placeholder="https://company.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="participantA.description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs">Full Context</FormLabel>
                    <FormControl><Textarea className="min-h-[100px] text-sm font-mono" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Entity B */}
            <div className="p-6 md:p-8 border-2 border-foreground bg-card space-y-6">
              <h3 className="font-bold uppercase tracking-widest border-b border-foreground/20 pb-4 text-secondary-foreground">Entity B</h3>
              
              <div className="space-y-4">
                <FormField control={form.control} name="participantB.name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs">Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="participantB.shortDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs">Headline</FormLabel>
                    <FormControl><Input placeholder="10-120 chars" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="participantB.category" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs">Category</FormLabel>
                    <FormControl><Input placeholder="e.g. Developer Tools" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="participantB.location" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs">Location</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="participantB.websiteUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs">Website URL</FormLabel>
                      <FormControl><Input type="url" placeholder="https://company.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="participantB.description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs">Full Context</FormLabel>
                    <FormControl><Textarea className="min-h-[100px] text-sm font-mono" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-8 border-t border-border">
            <button 
              type="submit" 
              disabled={createBattle.isPending}
              className="inline-flex items-center justify-center px-12 py-4 bg-foreground text-background font-bold text-lg hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createBattle.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Transmit Proposal'}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
