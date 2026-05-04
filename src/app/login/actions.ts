"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type MagicLinkResult = { ok: true } | { ok: false; error: string };

export async function sendMagicLink(
  formData: FormData,
): Promise<MagicLinkResult> {
  const email = formData.get("email");
  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    console.error("sendMagicLink failed", error);
    return { ok: false, error: "Could not send magic link. Please try again." };
  }

  return { ok: true };
}
