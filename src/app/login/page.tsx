"use client";

import { useState, useTransition, type FormEvent } from "react";
import { sendMagicLink } from "./actions";

export default function LoginPage() {
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await sendMagicLink(formData);
      if (result.ok) {
        setSent(true);
      } else {
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-1">
          🥗 Meal Tracker
        </h1>
        <p className="text-muted text-center text-sm mb-8">
          Enter your email to sign in
        </p>

        {sent ? (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-6 text-center space-y-2">
            <p className="text-emerald-700 dark:text-emerald-400 font-medium">
              Check your email for the magic link.
            </p>
            <p className="text-muted text-sm">
              Click the link to sign in — you can close this tab.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {errorMsg && (
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium text-sm transition-colors"
            >
              {isPending ? "Sending…" : "Send magic link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
