"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  dueDate: string;
  subject: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
};

const priorityLabels: Record<Task["priority"], string> = {
  high: "Priorité haute",
  medium: "Priorité moyenne",
  low: "Priorité basse",
};

const priorityStyles: Record<Task["priority"], string> = {
  high: "bg-rose-50 text-rose-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-indigo-50 text-indigo-700",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) throw new Error("La récupération des tâches a échoué.");
        const data: Task[] = await response.json();
        setTasks(data);
      } catch {
        setError("Impossible de charger les tâches. Réessaie plus tard.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadTasks();
  }, []);

  async function updateCompletion(task: Task, completed: boolean) {
    setError(null);
    setUpdatingIds((ids) => [...ids, task.id]);

    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, completed }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? "Impossible de mettre à jour la tâche.");
      }
      const updatedTask: Task = await response.json();
      setTasks((currentTasks) =>
        currentTasks.map((item) => (item.id === updatedTask.id ? updatedTask : item)),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Impossible de mettre à jour la tâche.",
      );
    } finally {
      setUpdatingIds((ids) => ids.filter((id) => id !== task.id));
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
              StudyPlanner
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mes tâches</h1>
            <p className="mt-2 text-slate-500">
              Une vue claire sur ce qu’il te reste à accomplir.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/tasks/new"
              className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              + Nouvelle tâche
            </a>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <span className="text-2xl font-bold text-indigo-600">{completedCount}</span>
              <span className="ml-2 text-sm text-slate-500">sur {tasks.length} terminée(s)</span>
            </div>
          </div>
        </header>

        {isLoading ? (
          <p role="status" className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Chargement des tâches…
          </p>
        ) : error ? (
          <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
            {error}
          </p>
        ) : tasks.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Aucune tâche pour le moment.
          </p>
        ) : (
          <section aria-label="Liste des tâches" className="grid gap-4 md:grid-cols-2">
            {tasks.map((task) => (
              <article
                key={task.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  task.completed ? "border-emerald-200" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      disabled={updatingIds.includes(task.id)}
                      onChange={(event) => void updateCompletion(task, event.target.checked)}
                      aria-label={`Marquer « ${task.title} » comme terminée`}
                      className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-emerald-600 accent-emerald-600 focus:ring-2 focus:ring-emerald-500 disabled:cursor-wait"
                    />
                    <div>
                      <h2 className={`font-semibold leading-6 ${task.completed ? "text-slate-400 line-through" : "text-slate-900"}`}>
                        {task.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">{task.subject}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>
                    {priorityLabels[task.priority]}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                  <span className="text-slate-400">Échéance</span>
                  <time className="text-slate-600" dateTime={task.dueDate}>
                    {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" }).format(
                      new Date(`${task.dueDate}T00:00:00Z`),
                    )}
                  </time>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
