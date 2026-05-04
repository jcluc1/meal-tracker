import { getStats } from "@/lib/queries";
import type { MealType } from "@/lib/types";

const MEAL_TYPE_LABEL: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

function shortDayLabel(dateKey: string): string {
  const d = new Date(dateKey + "T12:00:00");
  return d.toLocaleDateString("en", { weekday: "short" });
}

export default async function StatsPage() {
  const stats = await getStats();
  const { today, last7Days, weekTotals, byMealType } = stats;

  const maxCal = Math.max(...last7Days.map((d) => d.calories), 1);

  const daysWithMeals = last7Days.filter((d) => d.count > 0);
  const avgCalPerDay =
    daysWithMeals.length > 0
      ? Math.round(weekTotals.calories / daysWithMeals.length)
      : 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Stats</h1>

      {/* Today summary */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl p-4">
        <p className="text-xs text-muted uppercase tracking-wide font-medium mb-3">
          Today
        </p>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-muted">Calories</span>
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {today.calories.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted">Protein</span>
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {today.protein_g}g
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted">Meals</span>
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {today.count}
            </span>
          </div>
        </div>
      </div>

      {/* 7-day summary */}
      <div className="bg-card border border-card-border rounded-xl p-4 flex flex-col gap-4">
        <p className="text-xs text-muted uppercase tracking-wide font-medium">
          Last 7 Days
        </p>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-muted">Total calories</span>
            <span className="text-xl font-semibold text-foreground">
              {weekTotals.calories.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted">Total protein</span>
            <span className="text-xl font-semibold text-foreground">
              {weekTotals.protein_g}g
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted">Total meals</span>
            <span className="text-xl font-semibold text-foreground">
              {weekTotals.count}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted">Avg cal/day</span>
            <span className="text-xl font-semibold text-foreground">
              {avgCalPerDay.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Bar chart */}
        <div className="mt-2">
          <p className="text-xs text-muted mb-2">Calories by day</p>
          <div className="flex items-end gap-1 h-28">
            {last7Days.map((day) => {
              const pct =
                day.calories > 0
                  ? Math.round((day.calories / maxCal) * 100)
                  : 0;
              const isToday = day.date === today.date;
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div className="w-full flex items-end h-20">
                    <div
                      className={[
                        "w-full rounded-t-sm transition-all",
                        isToday
                          ? "bg-emerald-500"
                          : "bg-emerald-200 dark:bg-emerald-800",
                      ].join(" ")}
                      style={{ height: `${pct}%` }}
                      title={`${day.calories} kcal`}
                    />
                  </div>
                  <span className="text-xs text-muted tabular-nums">
                    {shortDayLabel(day.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* By meal type */}
      <div className="bg-card border border-card-border rounded-xl p-4 flex flex-col gap-3">
        <p className="text-xs text-muted uppercase tracking-wide font-medium">
          This Week by Meal Type
        </p>
        <div className="flex flex-col divide-y divide-card-border">
          {(Object.entries(byMealType) as [MealType, { calories: number; count: number }][]).map(
            ([type, data]) => (
              <div
                key={type}
                className="flex items-center justify-between py-2.5"
              >
                <span className="text-sm font-medium text-foreground">
                  {MEAL_TYPE_LABEL[type]}
                </span>
                <div className="flex gap-4 text-sm text-muted">
                  <span>{data.calories.toLocaleString()} kcal</span>
                  <span>{data.count} meals</span>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
