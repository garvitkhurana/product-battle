import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LegalSection = {
  title: string;
  eyebrow: string;
  updated: string;
  sections: Array<{ heading: string; body: string }>;
};

const legalContent: Record<string, LegalSection> = {
  terms: {
    title: "Terms of Service",
    eyebrow: "The rules of YC Battle",
    updated: "August 23, 2026",
    sections: [
      {
        heading: "Using YC Battle",
        body: "YC Battle is a community platform for comparing YC companies in head-to-head battles. By using the site, you agree to use it lawfully and not to interfere with the service, manipulate results, or submit misleading payment information.",
      },
      {
        heading: "Paid battle votes",
        body: "A battle vote costs $0.99 unless the checkout page states otherwise. A paid vote is a community opinion, is non-refundable after payment, and does not represent an investment, security, endorsement, or guarantee of company performance.",
      },
      {
        heading: "Changes and availability",
        body: "We may add, remove, pause, or close battles and may update these terms as the product evolves. We do not guarantee that every battle, company profile, or result will always be available.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    eyebrow: "How YC Battle handles information",
    updated: "August 23, 2026",
    sections: [
      {
        heading: "Information we receive",
        body: "YC Battle receives information needed to operate the service, including account details for signed-in members, battle votes, payment references, and technical information needed for security and reliability. Stripe processes payment details; YC Battle does not store full card numbers.",
      },
      {
        heading: "How we use information",
        body: "We use information to provide battles, verify payments, prevent duplicate or abusive activity, show public aggregate results, provide receipts, and maintain the service. We do not present public battle totals as financial advice or as a measure of company quality.",
      },
      {
        heading: "Your choices",
        body: "Signed-in members can review their activity in the app. Guest backers can view the resulting public battle totals without creating an account. For privacy questions or requests, use the contact method provided by the site operator.",
      },
    ],
  },
  disclosure: {
    title: "Voting Disclosure",
    eyebrow: "Read this before backing a side",
    updated: "August 23, 2026",
    sections: [
      {
        heading: "What a vote means",
        body: "A YC Battle vote is a paid expression of community preference between two companies. One successful $0.99 payment represents one vote for the selected side. Battle percentages are calculated from recorded votes and are not investment ratings.",
      },
      {
        heading: "Important limitations",
        body: "Votes are non-refundable. YC Battle is not affiliated with or endorsed by Y Combinator or the companies shown. A battle result is not investment advice, a securities transaction, a recommendation, a prediction, or a guarantee of business performance.",
      },
      {
        heading: "Payment verification",
        body: "A vote is counted only after Stripe confirms payment through a verified webhook. Checkout may be completed as a guest. Public totals are visible to everyone, while signed-in members can access their own receipt history.",
      },
    ],
  },
};

function LegalDocument({ document }: { document: LegalSection }) {
  return (
    <main className="min-h-[70vh] bg-muted/20 px-4 py-12 md:py-20">
      <div className="mx-auto max-w-3xl">
        <Link href="/battles" className="mb-8 inline-flex items-center text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Battles
        </Link>
        <Card className="border-2 shadow-sm">
          <CardHeader className="border-b bg-card p-6 md:p-10">
            <div className="mb-4 flex items-center gap-3 text-primary">
              <FileText className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">{document.eyebrow}</span>
            </div>
            <CardTitle className="text-4xl font-black tracking-tight md:text-5xl">{document.title}</CardTitle>
            <p className="mt-3 text-sm text-muted-foreground">Last updated {document.updated}</p>
          </CardHeader>
          <CardContent className="space-y-8 p-6 md:p-10">
            {document.sections.map((section) => (
              <section key={section.heading} className="space-y-2">
                <h2 className="text-xl font-bold">{section.heading}</h2>
                <p className="leading-7 text-muted-foreground">{section.body}</p>
              </section>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export function TermsPage() {
  return <LegalDocument document={legalContent.terms} />;
}

export function PrivacyPage() {
  return <LegalDocument document={legalContent.privacy} />;
}

export function VotingDisclosurePage() {
  return <LegalDocument document={legalContent.disclosure} />;
}