/*
 * Minimal toast system. `toast()` can be called from any client code; the
 * state lives in a tiny external store read with useSyncExternalStore, so no
 * provider is needed. Render <Toaster /> once in the root layout.
 */
"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { CheckCircleIcon, CloseIcon, InfoIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const TOAST_DURATION_MS = 3500;
const MAX_TOASTS = 3;

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: "success" | "info";
  action?: { label: string; href: string };
}

interface ToastItem extends ToastOptions {
  id: number;
}

const EMPTY: ToastItem[] = [];
let toasts: ToastItem[] = EMPTY;
let nextId = 0;
const listeners = new Set<() => void>();

function emit(next: ToastItem[]) {
  toasts = next;
  listeners.forEach((listener) => listener());
}

function dismiss(id: number) {
  emit(toasts.filter((item) => item.id !== id));
}

export function toast(options: ToastOptions) {
  const id = ++nextId;
  emit([...toasts.slice(-(MAX_TOASTS - 1)), { id, tone: "info", ...options }]);
  setTimeout(() => dismiss(id), TOAST_DURATION_MS);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function Toaster() {
  const items = useSyncExternalStore(subscribe, () => toasts, () => EMPTY);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto flex w-full max-w-sm animate-fade-in items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
        >
          <span className={cn("mt-0.5 shrink-0", item.tone === "success" ? "text-success" : "text-primary")}>
            {item.tone === "success" ? <CheckCircleIcon /> : <InfoIcon />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            {item.description && <p className="mt-0.5 text-sm text-slate-600">{item.description}</p>}
            {item.action && (
              <Link
                href={item.action.href}
                onClick={() => dismiss(item.id)}
                className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
              >
                {item.action.label}
              </Link>
            )}
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => dismiss(item.id)}
            className="shrink-0 rounded text-slate-400 hover:text-slate-700"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
