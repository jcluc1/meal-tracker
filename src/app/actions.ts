"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isMealType, type MealInput } from "@/lib/types";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/history");
  revalidatePath("/stats");
}

function parseMealForm(formData: FormData): MealInput | string {
  const name = formData.get("name");
  const mealType = formData.get("meal_type");
  const eatenAtRaw = formData.get("eaten_at");
  const caloriesRaw = formData.get("calories");
  const proteinRaw = formData.get("protein_g");
  const notesRaw = formData.get("notes");

  if (typeof name !== "string" || name.trim().length === 0) {
    return "Name is required.";
  }
  if (!isMealType(mealType)) {
    return "Invalid meal type.";
  }

  let eaten_at: string;
  if (typeof eatenAtRaw === "string" && eatenAtRaw.length > 0) {
    const parsed = new Date(eatenAtRaw);
    if (Number.isNaN(parsed.getTime())) {
      return "Invalid date.";
    }
    eaten_at = parsed.toISOString();
  } else {
    eaten_at = new Date().toISOString();
  }

  let calories: number | null = null;
  if (typeof caloriesRaw === "string" && caloriesRaw.trim().length > 0) {
    const n = Number(caloriesRaw);
    if (!Number.isFinite(n) || n < 0) return "Invalid calories.";
    calories = Math.round(n);
  }

  let protein_g: number | null = null;
  if (typeof proteinRaw === "string" && proteinRaw.trim().length > 0) {
    const n = Number(proteinRaw);
    if (!Number.isFinite(n) || n < 0) return "Invalid protein.";
    protein_g = Math.round(n * 10) / 10;
  }

  const notes =
    typeof notesRaw === "string" && notesRaw.trim().length > 0
      ? notesRaw.trim()
      : null;

  return {
    name: name.trim(),
    meal_type: mealType,
    eaten_at,
    calories,
    protein_g,
    notes,
  };
}

export async function addMeal(formData: FormData): Promise<ActionResult> {
  const parsed = parseMealForm(formData);
  if (typeof parsed === "string") {
    return { ok: false, error: parsed };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("meals").insert(parsed);

  if (error) {
    console.error("addMeal failed", error);
    return { ok: false, error: "Could not save meal." };
  }

  revalidateAll();
  return { ok: true };
}

export async function updateMeal(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing meal id." };

  const parsed = parseMealForm(formData);
  if (typeof parsed === "string") {
    return { ok: false, error: parsed };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("meals").update(parsed).eq("id", id);

  if (error) {
    console.error("updateMeal failed", error);
    return { ok: false, error: "Could not update meal." };
  }

  revalidateAll();
  return { ok: true };
}

export async function deleteMeal(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing meal id." };

  const supabase = await createClient();
  const { error } = await supabase.from("meals").delete().eq("id", id);

  if (error) {
    console.error("deleteMeal failed", error);
    return { ok: false, error: "Could not delete meal." };
  }

  revalidateAll();
  return { ok: true };
}
