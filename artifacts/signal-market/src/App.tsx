import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { ToastProvider, Toaster } from '@/hooks/use-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import { ClerkProvider } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';

import { Layout } from '@/components/layout/Layout';
import Explore from '@/pages/explore';
import ProductDetail from '@/pages/product-detail';
import BattlesList from '@/pages/battles/index';
import BattleDetail from '@/pages/battles/[slug]';
import Submit from '@/pages/submit';
import Dashboard from '@/pages/dashboard';
import Transactions from '@/pages/transactions';
import { PaymentSuccess, PaymentCancel } from '@/pages/payment-outcome';
import { SignInPage, SignUpPage } from '@/pages/auth';
import { TermsPage, PrivacyPage, VotingDisclosurePage } from '@/pages/legal';

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  variables: {
    colorPrimary: "#ff4f32",
    colorForeground: "#211b18",
    colorMutedForeground: "#665e57",
    colorDanger: "#d13e27",
    colorBackground: "#f8e9d8",
    colorInput: "#fffaf3",
    colorInputForeground: "#211b18",
    colorNeutral: "#d5cbc0",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    borderRadius: "0px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "w-[440px] max-w-full overflow-hidden rounded-none border-2 border-[#211b18] bg-[#f8e9d8] shadow-[10px_10px_0_#ff4f32]",
    card: "!rounded-none !border-0 !bg-transparent !shadow-none",
    footer: "!rounded-none !border-0 !border-t-2 !border-[#211b18] !bg-transparent !shadow-none",
    headerTitle: "font-extrabold tracking-[-0.04em] text-[#211b18]",
    headerSubtitle: "text-[#665e57]",
    socialButtonsBlockButtonText: "font-semibold text-[#211b18]",
    formFieldLabel: "font-bold text-[#211b18]",
    footerActionLink: "font-bold text-[#ff4f32]",
    footerActionText: "text-[#665e57]",
    dividerText: "text-[#665e57]",
    formFieldInput: "rounded-none border-2 border-[#211b18] bg-[#fffaf3] text-[#211b18]",
    socialButtonsBlockButton: "rounded-none border-2 border-[#211b18] bg-[#fffaf3]",
    formButtonPrimary: "rounded-none border-2 border-[#211b18] bg-[#211b18] font-bold text-[#f8e9d8] hover:bg-[#ff4f32]",
    dividerLine: "bg-[#211b18]/20",
  },
};

function Router() {
  return (
    <Layout>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={BattlesList} />
          <Route path="/explore" component={Explore} />
          <Route path="/companies/:slug" component={ProductDetail} />

          <Route path="/battles" component={BattlesList} />
          <Route path="/battles/:slug" component={BattleDetail} />
          
          <Route path="/submit" component={Submit} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/transactions" component={Transactions} />
          
          <Route path="/payment/success" component={PaymentSuccess} />
          <Route path="/payment/cancel" component={PaymentCancel} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/voting-disclosure" component={VotingDisclosurePage} />
          
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </Layout>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to join the next YC Battle",
          },
        },
        signUp: {
          start: {
            title: "Join YC Battle",
            subtitle: "Create an account to back the companies you believe in",
          },
        },
      }}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
    >
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <TooltipProvider>
            <WouterRouter base={basePath}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
