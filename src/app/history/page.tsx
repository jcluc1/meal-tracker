import { getAllMeals } from "@/lib/queries";
import type { Meal } from "@/lib/types";
import MealCard from "@/components/MealCard";

function localDateKey(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
}

function formatDateHeader(dateKey: string): string {
  const d = new Date(dateKey + "T12:00:00");
  return d.toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function groupByDate(meals: Meal[]): [string, Meal[]][] {
  const map = new Map<string, Meal[]>();
  for (const meal of meals) {
    const key = localDateKey(meal.eaten_at);
    const group = map.get(key) ?? [];
    group.push(meal);
    map.set(key, group);
  }
  return Array.from(map.entries());
}

export default async function HistoryPage() {
  const meals = await getAllMeals();
  const days = groupByDate(meals);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-foreground">History</h1>

      {days.length === 0 ? (
        <div className="text-center py-12 text-muted">
          <p className="text-lg">No meals logged yet.</p>
        </div>
      ) : (
        days.map(([dateKey, dayMeals]) => {
          const totalCal = dayMeals.reduce(
            (sum, m) => sum + (m.calories ?? 0),
            0,
          );
          const totalProt = dayMeals.reduce(
            (sum, m) => sum + (m.protein_g ?? 0),
            0,
          );

          return (
            <section key={dateKey} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <h2 className="font-semibold text-foreground">
                  {formatDateHeader(dateKey)}
                </h2>
                <div className="flex gap-3 text-sm text-muted">
                  {totalCal > 0 && (
                    <span>{totalCal.toLocaleString()} kcal</span>
                  )}
                  {totalProt > 0 && (
                    <span>{Math.round(totalProt * 10) / 10}g protein</span>
                  )}
                  <span>{dayMeals.length} meals</span>
                </div>
              </div>
              {dayMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </section>
          );
        })
      )}
    </div>
  );
}
