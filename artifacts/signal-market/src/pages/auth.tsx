import { SignIn, SignUp } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-muted/30">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

export function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-muted/30">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}
