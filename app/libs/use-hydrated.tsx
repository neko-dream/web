import { useSyncExternalStore } from "react";
import * as React from "react";

function subscribe() {
  return () => {};
}

export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function ClientOnly({ children, fallback = null }: Props) {
  return useHydrated() ? <>{children}</> : <>{fallback}</>;
}
