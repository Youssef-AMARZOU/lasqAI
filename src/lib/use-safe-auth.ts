"use client";

import { useAuthActions as useConvexAuthActions } from "@convex-dev/auth/react";

export function useSafeAuthActions() {
  try {
    const actions = useConvexAuthActions();
    if (!actions) return { signIn: async () => {}, signOut: async () => {} };
    return actions;
  } catch {
    return { signIn: async () => {}, signOut: async () => {} };
  }
}
