import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyPlanner",
  description: "Organise tes tâches et échéances étudiantes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 font-sans text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <nav
            aria-label="Navigation principale"
            className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8"
          >
            <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
              StudyPlanner
            </Link>
            <div className="flex flex-wrap items-center gap-2 sm:gap-6">
              <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700">
                Accueil
              </Link>
              <Link href="/tasks" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700">
                Tâches
              </Link>
              <Link href="/tasks/new" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                Nouvelle tâche
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
