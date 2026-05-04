export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

export type MealType = (typeof MEAL_TYPES)[number];

export type Meal = {
  id: string;
  eaten_at: string;
  name: string;
  meal_type: MealType;
  calories: number | null;
  protein_g: number | null;
  notes: string | null;
  created_at: string;
};

export type MealInput = {
  eaten_at: string;
  name: string;
  meal_type: MealType;
  calories: number | null;
  protein_g: number | null;
  notes: string | null;
};

export function isMealType(value: unknown): value is MealType {
  return (
    typeof value === "string" &&
    (MEAL_TYPES as readonly string[]).includes(value)
  );
}
