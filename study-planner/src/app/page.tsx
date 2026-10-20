export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6 py-16 text-slate-900">
      <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-200/50 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" />

      <section className="relative w-full max-w-3xl rounded-3xl border border-white/80 bg-white/85 p-8 shadow-xl shadow-slate-200/60 backdrop-blur sm:p-14">
        <div className="mb-10 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-200">
            S
          </span>
          <span className="text-lg font-semibold tracking-tight">StudyPlanner</span>
        </div>

        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
          Ton espace d’étude
        </p>
        <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Bienvenue, prêt à avancer ?
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          Organise tes devoirs, garde un œil sur tes échéances et progresse sereinement, une tâche à la fois.
        </p>

        <a
          href="/tasks"
          className="mt-9 inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Voir mes tâches
          <span aria-hidden="true">→</span>
        </a>

        <p className="mt-12 border-t border-slate-100 pt-6 text-sm text-slate-400">
          Un peu d’organisation, beaucoup plus de sérénité.
        </p>
      </section>
    </main>
  );
}
