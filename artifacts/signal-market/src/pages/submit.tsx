import { useLocation } from "wouter";
import { useCreateBattle } from "@workspace/api-client-react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, ArrowRight, Lightbulb, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/react";
import { AuthRequired } from "@/components/auth-required";

const companySchema = z.object({
  name: z.string().min(2, "Add a company name").max(80, "Company name is too long"),
  websiteUrl: z.union([z.string().url("Use a valid URL"), z.literal("")]),
  isYcCompany: z.boolean(),
  ycBatch: z.string().max(20, "YC batch is too long").optional(),
});

const formSchema = z.object({
  category: z.string().min(2, "Add a topic or lane").max(60, "Topic is too long"),
  battleDescription: z.string().max(500, "Keep the reason under 500 characters"),
  participantA: companySchema,
  participantB: companySchema,
}).superRefine((value, context) => {
  (["participantA", "participantB"] as const).forEach((side) => {
    const company = value[side];
    if (company.isYcCompany && !company.ycBatch?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add the YC batch or turn off the YC toggle.",
        path: [side, "ycBatch"],
      });
    }
  });
});

type FormValues = z.infer<typeof formSchema>;
type CompanyKey = "participantA" | "participantB";

export default function Submit() {
  const { isLoaded, isSignedIn } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createBattle = useCreateBattle();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      battleDescription: "",
      participantA: emptyCompany(),
      participantB: emptyCompany(),
    },
  });

  const onSubmit = (data: FormValues) => {
    createBattle.mutate(
      {
        data: {
          description: data.battleDescription.trim() || `${data.participantA.name} vs. ${data.participantB.name}: a community-submitted matchup.`,
          participantA: toParticipantPayload(data.participantA, data.category),
          participantB: toParticipantPayload(data.participantB, data.category),
        },
      },
      {
        onSuccess: (battle) => {
          toast({ title: "Battle submitted!", description: `${battle.title} is awaiting review.` });
          setLocation("/battles");
        },
        onError: () => {
          toast({ variant: "destructive", title: "Submission failed", description: "Please try again later." });
        },
      },
    );
  };

  if (!isLoaded) return <div className="container mx-auto px-4 py-10">Checking account...</div>;
  if (!isSignedIn) {
    return (
      <AuthRequired
        title="Sign in to pitch a battle"
        description="You need an account to submit a matchup for review. Anyone can still browse and vote on live battles without signing in."
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8e9d8] px-4 py-10 text-[#211b18] sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="mb-4 flex h-11 w-11 items-center justify-center border-2 border-[#211b18] bg-[#d9f75b] shadow-[4px_4px_0_#211b18]">
            <Lightbulb className="h-5 w-5" />
          </div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff4f32]">Suggest a matchup</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.06em]">Pitch a battle.</h1>
          <p className="mt-3 max-w-xl text-base text-[#211b18]/65">
            Give us two companies. We’ll review the matchup before it goes live.
          </p>
        </div>

        <Card className="rounded-none border-2 border-[#211b18] bg-[#fffaf3] shadow-[7px_7px_0_#211b18]">
          <CardHeader className="border-b-2 border-[#211b18] pb-5">
            <CardTitle className="text-xl font-extrabold tracking-[-0.04em]">Who should go head-to-head?</CardTitle>
            <CardDescription>Only the basics are required. Links and YC details help us verify the submission, but are optional.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Topic or lane <span className="text-destructive">*</span></label>
                <Input
                  placeholder="e.g. Food delivery, AI coding, Data platforms"
                  {...form.register("category")}
                  className="rounded-none border-2 border-[#211b18] bg-[#f8e9d8]"
                />
                <FieldError message={form.formState.errors.category?.message} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <CompanyFields form={form} side="participantA" label="Company one" placeholder="e.g. Databricks" accent="bg-[#ff4f32]" />
                <CompanyFields form={form} side="participantB" label="Company two" placeholder="e.g. Snowflake" accent="bg-[#d9f75b]" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">Why is this a good battle? <span className="font-normal text-[#211b18]/45">(optional)</span></label>
                <Textarea
                  placeholder="A sentence about what they compete on is plenty."
                  className="min-h-24 resize-y rounded-none border-2 border-[#211b18] bg-[#f8e9d8]"
                  {...form.register("battleDescription")}
                />
                <FieldError message={form.formState.errors.battleDescription?.message} />
              </div>

              <div className="flex gap-3 border-2 border-[#211b18] bg-[#d9f75b]/35 p-3.5 text-sm">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <p><span className="font-bold">Review first.</span> New battles stay private until the team approves them.</p>
              </div>

              <Button type="submit" className="h-12 w-full rounded-none border-2 border-[#211b18] bg-[#ff4f32] text-base font-bold text-[#f8e9d8] hover:bg-[#211b18]" disabled={createBattle.isPending}>
                {createBattle.isPending ? "Sending for review..." : "Submit matchup"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-5 flex gap-2 text-xs text-[#211b18]/55">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>Use public information only. Votes show community opinion, not financial advice.</p>
        </div>
      </div>
    </div>
  );
}

function CompanyFields({
  form,
  side,
  label,
  placeholder,
  accent,
}: {
  form: UseFormReturn<FormValues>;
  side: CompanyKey;
  label: string;
  placeholder: string;
  accent: string;
}) {
  const errors = form.formState.errors[side];
  const isYcCompany = form.watch(`${side}.isYcCompany`);
  const field = <Name extends keyof FormValues[CompanyKey]>(name: Name) => `${side}.${name}` as const;

  return (
    <section className="border-2 border-[#211b18] bg-[#f8e9d8] p-4">
      <div className="mb-4 flex items-center gap-2">
        <span className={`h-3 w-3 border border-[#211b18] ${accent}`} />
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">{label}</p>
      </div>

      <label className="mb-1.5 block text-sm font-semibold">Name <span className="text-destructive">*</span></label>
      <Input placeholder={placeholder} {...form.register(field("name"))} className="rounded-none border-2 border-[#211b18] bg-[#fffaf3]" />
      <FieldError message={errors?.name?.message} />

      <label className="mb-1.5 mt-4 block text-sm font-semibold">Website <span className="font-normal text-[#211b18]/45">(optional)</span></label>
      <Input placeholder="https://company.com" {...form.register(field("websiteUrl"))} className="rounded-none border-2 border-[#211b18] bg-[#fffaf3]" />
      <FieldError message={errors?.websiteUrl?.message} />

      <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs font-semibold">
        <input type="checkbox" {...form.register(field("isYcCompany"))} className="h-4 w-4 accent-[#ff4f32]" />
        YC company
      </label>

      {isYcCompany && (
        <div className="mt-3">
          <label className="mb-1.5 block text-xs font-semibold">YC batch</label>
          <Input placeholder="e.g. S23" {...form.register(field("ycBatch"))} className="rounded-none border-2 border-[#211b18] bg-[#fffaf3]" />
          <FieldError message={errors?.ycBatch?.message} />
        </div>
      )}
    </section>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1.5 text-xs font-medium text-destructive">{message}</p> : null;
}

function emptyCompany() {
  return { name: "", websiteUrl: "", isYcCompany: false, ycBatch: "" };
}

function toParticipantPayload(company: FormValues[CompanyKey], category: string) {
  return {
    name: company.name,
    shortDescription: `${company.name} community matchup`,
    description: `${company.name} was submitted for a community comparison.`,
    websiteUrl: company.websiteUrl,
    ycBatch: company.isYcCompany ? company.ycBatch?.trim().toUpperCase() || null : null,
    category,
    location: "",
    isYcCompany: company.isYcCompany,
  };
}