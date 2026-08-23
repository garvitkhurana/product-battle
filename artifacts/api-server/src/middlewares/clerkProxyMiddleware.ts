import { createProxyMiddleware } from "http-proxy-middleware";

export const CLERK_PROXY_PATH = "/api/__clerk";

export function getClerkProxyHost(_req: unknown): string | undefined {
  return process.env.CLERK_PROXY_HOST;
}

export function clerkProxyMiddleware() {
  const target = process.env.CLERK_PROXY_URL;
  if (!target) {
    return (_req: unknown, _res: unknown, next: () => void) => next();
  }
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    secure: true,
  });
}