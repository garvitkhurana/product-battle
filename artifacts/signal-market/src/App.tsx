import { useEffect, type ReactNode } from 'react';
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
import Index from '@/pages/index';
import BattlesList from '@/pages/battles/index';
import BattleDetail from '@/pages/battles/[slug]';
import SwipeFlow from '@/pages/swipe/index';
import TasteDna from '@/pages/dna/index';
import CompanyProfile from '@/pages/companies/[slug]';
import EcosystemMap from '@/pages/map/index';
import Submit from '@/pages/submit/index';
import Transactions from '@/pages/transactions';
import Legal from '@/pages/legal';
import { SignInPage, SignUpPage } from '@/pages/auth';
import { PerceptionSessionProvider } from '@/lib/session';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#4c00ff",
    colorBackground: "#fff8ef",
    colorInput: "#fff8ef",
    colorInputForeground: "#181513",
    colorForeground: "#181513",
    colorMutedForeground: "#625c55",
    colorDanger: "#ff5038",
    colorNeutral: "#181513",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    borderRadius: "0px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#fff8ef] rounded-none w-[440px] max-w-full overflow-hidden border-2 border-[#181513] shadow-[6px_6px_0_#181513]",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-t !border-[#181513] !bg-transparent !rounded-none",
    headerTitle: "!font-bold !text-[#181513]",
    headerSubtitle: "!text-[#625c55]",
    socialButtonsBlockButtonText: "!text-[#181513]",
    formFieldLabel: "!text-[#181513]",
    footerActionLink: "!text-[#4c00ff]",
    footerActionText: "!text-[#625c55]",
    dividerText: "!text-[#625c55]",
    logoBox: "hidden",
    socialButtonsBlockButton: "!rounded-none !border-2 !border-[#181513] !bg-[#fff8ef] hover:!bg-[#d7ff45]",
    formButtonPrimary: "!rounded-none !bg-[#4c00ff] !text-white hover:!bg-[#3d00cc]",
    formFieldInput: "!rounded-none !border-2 !border-[#181513] !bg-[#fff8ef] !text-[#181513]",
    footerAction: "!bg-transparent",
    dividerLine: "!bg-[#181513]/25",
    alert: "!border-[#ff5038] !bg-[#fff0eb]",
    alertText: "!text-[#181513]",
    otpCodeFieldInput: "!rounded-none !border-2 !border-[#181513] !bg-[#fff8ef] !text-[#181513]",
    formFieldRow: "gap-2",
    main: "gap-5",
  },
};

function Router() {
  return (
    <Layout>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={Index} />
          
          <Route path="/battles" component={BattlesList} />
          <Route path="/battles/:slug" component={BattleDetail} />
          
          <Route path="/swipe" component={SwipeFlow} />
          <Route path="/dna" component={TasteDna} />
          
          <Route path="/companies/:slug" component={CompanyProfile} />
          <Route path="/map" component={EcosystemMap} />
          <Route path="/ecosystem" component={EcosystemRedirect} />
          
          <Route path="/submit" component={Submit} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/legal" component={Legal} />
          
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </Layout>
  );
}

function EcosystemRedirect() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation('/map');
  }, [setLocation]);
  return null;
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
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Sign in to YC Battle",
            subtitle: "Welcome back. Continue to your YC Battle account.",
          },
        },
        signUp: {
          start: {
            title: "Join YC Battle",
            subtitle: "Create an account to save your profile and claim a company.",
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <TooltipProvider>
            <WouterRouter base={basePath}>
              <PerceptionSessionProvider>
                <Router />
              </PerceptionSessionProvider>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
