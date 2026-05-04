import { createClient } from "@/lib/supabase/server";
import type { Meal, MealType } from "@/lib/types";

export type DayTotals = {
  date: string;
  calories: number;
  protein_g: number;
  count: number;
};

export type Stats = {
  today: DayTotals;
  last7Days: DayTotals[];
  weekTotals: { calories: number; protein_g: number; count: number };
  byMealType: Record<MealType, { calories: number; count: number }>;
};

function startOfLocalDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function getTodayMeals(): Promise<Meal[]> {
  try {
    const supabase = await createClient();
    const start = startOfLocalDay(new Date());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .gte("eaten_at", start.toISOString())
      .lt("eaten_at", end.toISOString())
      .order("eaten_at", { ascending: false });

    if (error) {
      console.error("getTodayMeals failed", error);
      return [];
    }
    return (data ?? []) as Meal[];
  } catch (err) {
    console.error("getTodayMeals threw", err);
    return [];
  }
}

export async function getAllMeals(): Promise<Meal[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .order("eaten_at", { ascending: false });

    if (error) {
      console.error("getAllMeals failed", error);
      return [];
    }
    return (data ?? []) as Meal[];
  } catch (err) {
    console.error("getAllMeals threw", err);
    return [];
  }
}

function emptyTotals(date: string): DayTotals {
  return { date, calories: 0, protein_g: 0, count: 0 };
}

function emptyStats(): Stats {
  const today = startOfLocalDay(new Date());
  const days: DayTotals[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(emptyTotals(isoDate(d)));
  }
  return {
    today: emptyTotals(isoDate(today)),
    last7Days: days,
    weekTotals: { calories: 0, protein_g: 0, count: 0 },
    byMealType: {
      breakfast: { calories: 0, count: 0 },
      lunch: { calories: 0, count: 0 },
      dinner: { calories: 0, count: 0 },
      snack: { calories: 0, count: 0 },
    },
  };
}

export async function getStats(): Promise<Stats> {
  try {
    const supabase = await createClient();
    const today = startOfLocalDay(new Date());
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6);

    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .gte("eaten_at", weekStart.toISOString());

    if (error) {
      console.error("getStats failed", error);
      return emptyStats();
    }

    const stats = emptyStats();
    const dayIndex = new Map<string, DayTotals>();
    for (const day of stats.last7Days) {
      dayIndex.set(day.date, day);
    }

    for (const meal of (data ?? []) as Meal[]) {
      const eaten = new Date(meal.eaten_at);
      const key = isoDate(startOfLocalDay(eaten));
      const day = dayIndex.get(key);
      const cal = meal.calories ?? 0;
      const prot = meal.protein_g ?? 0;

      if (day) {
        day.calories += cal;
        day.protein_g += prot;
        day.count += 1;
      }

      stats.weekTotals.calories += cal;
      stats.weekTotals.protein_g += prot;
      stats.weekTotals.count += 1;

      const bucket = stats.byMealType[meal.meal_type];
      if (bucket) {
        bucket.calories += cal;
        bucket.count += 1;
      }

      if (key === stats.today.date) {
        stats.today.calories += cal;
        stats.today.protein_g += prot;
        stats.today.count += 1;
      }
    }

    for (const day of stats.last7Days) {
      day.protein_g = Math.round(day.protein_g * 10) / 10;
    }
    stats.weekTotals.protein_g =
      Math.round(stats.weekTotals.protein_g * 10) / 10;
    stats.today.protein_g = Math.round(stats.today.protein_g * 10) / 10;

    return stats;
  } catch (err) {
    console.error("getStats threw", err);
    return emptyStats();
  }
}
