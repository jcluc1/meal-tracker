import { getTodayMeals } from "@/lib/queries";
import { MEAL_TYPES } from "@/lib/types";
import MealForm from "@/components/MealForm";
import MealCard from "@/components/MealCard";

const MEAL_TYPE_LABEL: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export default async function Home() {
  const meals = await getTodayMeals();

  const totalCalories = meals.reduce((sum, m) => sum + (m.calories ?? 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein_g ?? 0), 0);

  const grouped = Object.fromEntries(
    MEAL_TYPES.map((type) => [
      type,
      meals.filter((m) => m.meal_type === type),
    ]),
  ) as Record<(typeof MEAL_TYPES)[number], typeof meals>;

  return (
    <div className="flex flex-col gap-6">
      <MealForm />

      {meals.length === 0 ? (
        <div className="text-center py-12 text-muted">
          <p className="text-lg">No meals logged today</p>
          <p className="text-sm mt-1">Add your first above.</p>
        </div>
      ) : (
        <>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl p-4 flex flex-wrap gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted uppercase tracking-wide font-medium">
                Calories
              </span>
              <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {totalCalories.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted uppercase tracking-wide font-medium">
                Protein
              </span>
              <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {Math.round(totalProtein * 10) / 10}g
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted uppercase tracking-wide font-medium">
                Meals
              </span>
              <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {meals.length}
              </span>
            </div>
          </div>

          {MEAL_TYPES.filter((type) => grouped[type].length > 0).map((type) => (
            <section key={type} className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">
                {MEAL_TYPE_LABEL[type]}
              </h2>
              {grouped[type].map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </section>
          ))}
        </>
      )}
    </div>
  );
}
