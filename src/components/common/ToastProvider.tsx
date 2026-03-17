import type { ReactNode } from "react";

type ToastProviderProps = {
  children: ReactNode;
};

// This provider is intentionally minimal until a real toast state manager is introduced.
export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex min-h-12 min-w-56 items-end justify-end"
      />
    </>
  );
}
