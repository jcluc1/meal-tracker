import type { Meal } from "@/lib/types";
import DeleteButton from "./DeleteButton";

const TYPE_BADGE: Record<string, { label: string; classes: string }> = {
  breakfast: {
    label: "Breakfast",
    classes:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  lunch: {
    label: "Lunch",
    classes:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  dinner: {
    label: "Dinner",
    classes:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  },
  snack: {
    label: "Snack",
    classes:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  },
};

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MealCard({ meal }: { meal: Meal }) {
  const badge = TYPE_BADGE[meal.meal_type] ?? {
    label: meal.meal_type,
    classes: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <div className="bg-card border border-card-border rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted tabular-nums">
            {formatTime(meal.eaten_at)}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.classes}`}
          >
            {badge.label}
          </span>
        </div>
        <DeleteButton id={meal.id} />
      </div>

      <p className="font-medium text-foreground leading-snug">{meal.name}</p>

      {(meal.calories !== null || meal.protein_g !== null) && (
        <div className="flex gap-3 text-sm text-muted">
          {meal.calories !== null && (
            <span>{meal.calories.toLocaleString()} kcal</span>
          )}
          {meal.protein_g !== null && <span>{meal.protein_g}g protein</span>}
        </div>
      )}

      {meal.notes && (
        <p className="text-sm text-muted italic">{meal.notes}</p>
      )}
    </div>
  );
}
