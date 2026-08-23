import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { customFetch, type ErrorType } from "./custom-fetch";
import type { Battle, BattleCheckoutInput, CheckoutSession } from "./generated/api.schemas";

export type ListBattlesParams = {
  space?: string;
};

export const getListBattlesUrl = (params?: ListBattlesParams) => {
  const normalizedParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) normalizedParams.append(key, String(value));
  });
  const q = normalizedParams.toString();
  return q ? `/api/battles?${q}` : `/api/battles`;
};

export const listBattles = (params?: ListBattlesParams) =>
  customFetch<Battle[]>(getListBattlesUrl(params), { method: "GET" });

export const useListBattles = (
  params?: ListBattlesParams,
  options?: { query?: UseQueryOptions<Battle[], ErrorType<unknown>> },
) =>
  useQuery({
    queryKey: ["/api/battles", params],
    queryFn: () => listBattles(params),
    ...options?.query,
  });

export const getBattle = (slug: string) =>
  customFetch<Battle>(`/api/battles/${slug}`, { method: "GET" });

export const useGetBattle = (
  slug: string,
  options?: { query?: UseQueryOptions<Battle, ErrorType<unknown>> },
) =>
  useQuery({
    queryKey: ["/api/battles", slug],
    queryFn: () => getBattle(slug),
    enabled: Boolean(slug),
    ...options?.query,
  });

export const createBattleCheckout = (body: BattleCheckoutInput) =>
  customFetch<CheckoutSession>(`/api/battles/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const useCreateBattleCheckout = () =>
  useMutation({
    mutationFn: createBattleCheckout,
  });
