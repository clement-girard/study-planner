"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Priority = "low" | "medium" | "high";

export default function NewTaskPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const task = {
      title: String(formData.get("title") ?? "").trim(),
      dueDate: String(formData.get("dueDate") ?? ""),
      subject: String(formData.get("subject") ?? "").trim(),
      priority: String(formData.get("priority") ?? "medium") as Priority,
      completed: false,
    };

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? "Impossible d’ajouter la tâche.");
      }

      router.push("/tasks");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Une erreur est survenue. Réessaie.",
      );
      setIsSubmitting(false);
    }
  }

  const inputClasses =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <a href="/tasks" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← Retour aux tâches
        </a>
        <header className="mb-8 mt-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
            StudyPlanner
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Ajouter une tâche</h1>
          <p className="mt-2 text-slate-500">Note les détails pour garder ton travail organisé.</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label htmlFor="title" className="text-sm font-semibold text-slate-700">
              Titre <span className="text-rose-600">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={200}
              placeholder="Ex. Réviser le chapitre 3"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="text-sm font-semibold text-slate-700">
              Échéance
            </label>
            <input id="dueDate" name="dueDate" type="date" className={inputClasses} />
          </div>

          <div>
            <label htmlFor="subject" className="text-sm font-semibold text-slate-700">
              Matière
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Ex. Mathématiques"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="priority" className="text-sm font-semibold text-slate-700">
              Priorité
            </label>
            <select id="priority" name="priority" defaultValue="medium" className={inputClasses}>
              <option value="low">Basse (low)</option>
              <option value="medium">Moyenne (medium)</option>
              <option value="high">Haute (high)</option>
            </select>
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? "Ajout en cours…" : "Ajouter la tâche"}
          </button>
        </form>
      </div>
    </main>
  );
}
