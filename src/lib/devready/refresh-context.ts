import { createContext, type Context } from "react";

export type RefreshContextCache<T> = { workspaceContext?: Context<T | null> };

// Preserve context identity across preview updates, without caching user state or SSR requests.
export function refreshContext<T>(cache?: RefreshContextCache<T>): Context<T | null> {
  const context = cache?.workspaceContext ?? createContext<T | null>(null);
  if (cache) cache.workspaceContext = context;
  return context;
}