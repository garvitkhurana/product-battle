import { useLocation } from "wouter";
import { useCreateProduct } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lightbulb, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(60, "Title too long"),
  shortDescription: z.string().min(10, "Short description needs to be at least 10 characters").max(120, "Keep it punchy"),
  description: z.string().min(20, "Provide a fuller company description").max(2000, "Too long"),
  category: z.string().min(2, "Category is required"),
  ycBatch: z.string().regex(/^[SW]\d{2}$/i, "Use a YC batch such as S23 or W24"),
  websiteUrl: z.string().url("Must be a valid website URL"),
  location: z.string().min(2, "Location is required"),
  imageUrl: z.string().url("Must be a valid image URL"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Submit() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const createProduct = useCreateProduct();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      category: "",
      ycBatch: "",
      websiteUrl: "",
      location: "",
      imageUrl: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    createProduct.mutate(
      { data },
      {
        onSuccess: (product) => {
          toast({
            title: "Company submitted!",
            description: "Your company profile is awaiting review.",
          });
          setLocation("/dashboard");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Submission failed",
            description: "Please try again later.",
          });
        }
      }
    );
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="text-center mb-10">
        <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <Lightbulb className="h-6 w-6" />
        </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Add a YC Company</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Add a public company profile for community review. Profiles are moderated before appearing in the directory.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company details</CardTitle>
          <CardDescription>Use publicly available, factual company information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Company name <span className="text-destructive">*</span></label>
                <Input 
                  placeholder="e.g. Acme Inc." 
                  {...form.register("title")} 
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-destructive mt-1.5 font-medium">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Short description <span className="text-destructive">*</span></label>
                <Input 
                  placeholder="A one-sentence hook (max 120 chars)" 
                  {...form.register("shortDescription")} 
                />
                {form.formState.errors.shortDescription && (
                  <p className="text-xs text-destructive mt-1.5 font-medium">{form.formState.errors.shortDescription.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Category <span className="text-destructive">*</span></label>
                <Input 
                  placeholder="e.g. Fintech, Consumer, B2B" 
                  {...form.register("category")} 
                />
                {form.formState.errors.category && (
                  <p className="text-xs text-destructive mt-1.5 font-medium">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">YC batch <span className="text-destructive">*</span></label>
                  <Input placeholder="e.g. S23" {...form.register("ycBatch")} />
                  {form.formState.errors.ycBatch && (
                    <p className="text-xs text-destructive mt-1.5 font-medium">{form.formState.errors.ycBatch.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Location <span className="text-destructive">*</span></label>
                  <Input placeholder="e.g. San Francisco, CA" {...form.register("location")} />
                  {form.formState.errors.location && (
                    <p className="text-xs text-destructive mt-1.5 font-medium">{form.formState.errors.location.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Company website <span className="text-destructive">*</span></label>
                <Input placeholder="https://company.com" {...form.register("websiteUrl")} />
                {form.formState.errors.websiteUrl && (
                  <p className="text-xs text-destructive mt-1.5 font-medium">{form.formState.errors.websiteUrl.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Company description <span className="text-destructive">*</span></label>
                <Textarea 
                  placeholder="Describe what the company does using public, factual information." 
                  className="min-h-[200px] resize-y"
                  {...form.register("description")} 
                />
                {form.formState.errors.description && (
                  <p className="text-xs text-destructive mt-1.5 font-medium">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Image URL <span className="text-destructive">*</span></label>
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  {...form.register("imageUrl")} 
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-xs text-destructive mt-1.5 font-medium">{form.formState.errors.imageUrl.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1.5">Provide a direct URL to a cover image (16:9 recommended).</p>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3 text-amber-800 dark:text-amber-500">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Community guidelines</p>
                <p className="opacity-90">
                  Only submit publicly available company information. Do not make claims about company performance, funding, or YC affiliation that you cannot support. Ratings are opinions, not financial advice.
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold"
              disabled={createProduct.isPending}
            >
              {createProduct.isPending ? "Submitting..." : "Submit for review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
