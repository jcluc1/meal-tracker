"use client";

import { useActionState, useEffect, useState } from "react";
import { addMeal, type ActionResult } from "@/app/actions";
import { MEAL_TYPES } from "@/lib/types";

async function addMealAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return addMeal(formData);
}

function localDateTimeString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(Date.now() - offset).toISOString().slice(0, 16);
}

export default function MealForm() {
  const [state, formAction, isPending] = useActionState(addMealAction, null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (state?.ok === true) {
      setFormKey((k) => k + 1);
    }
  }, [state]);

  return (
    <div className="bg-card border border-card-border rounded-xl p-5">
      <h2 className="font-semibold text-foreground mb-4">Log a Meal</h2>

      {state && !state.ok && (
        <div className="mb-4 px-3 py-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm rounded-lg">
          {state.error}
        </div>
      )}

      {state?.ok && (
        <div className="mb-4 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg">
          Meal logged!
        </div>
      )}

      <form key={formKey} action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="name"
            className="text-sm font-medium text-foreground"
          >
            Meal name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. Oatmeal with berries"
            className="w-full px-3 py-2 rounded-lg border border-card-border bg-background text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="meal_type"
              className="text-sm font-medium text-foreground"
            >
              Type <span className="text-red-500">*</span>
            </label>
            <select
              id="meal_type"
              name="meal_type"
              required
              className="w-full px-3 py-2 rounded-lg border border-card-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {MEAL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="eaten_at"
              className="text-sm font-medium text-foreground"
            >
              Time
            </label>
            <input
              id="eaten_at"
              name="eaten_at"
              type="datetime-local"
              defaultValue={localDateTimeString()}
              className="w-full px-3 py-2 rounded-lg border border-card-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="calories"
              className="text-sm font-medium text-foreground"
            >
              Calories
            </label>
            <input
              id="calories"
              name="calories"
              type="number"
              min="0"
              placeholder="kcal"
              className="w-full px-3 py-2 rounded-lg border border-card-border bg-background text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="protein_g"
              className="text-sm font-medium text-foreground"
            >
              Protein (g)
            </label>
            <input
              id="protein_g"
              name="protein_g"
              type="number"
              min="0"
              step="0.1"
              placeholder="grams"
              className="w-full px-3 py-2 rounded-lg border border-card-border bg-background text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="notes"
            className="text-sm font-medium text-foreground"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            placeholder="Optional notes…"
            className="w-full px-3 py-2 rounded-lg border border-card-border bg-background text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg transition-colors"
        >
          {isPending ? "Saving…" : "Log Meal"}
        </button>
      </form>
    </div>
  );
}
