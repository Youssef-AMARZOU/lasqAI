export const dynamic = "force-dynamic";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-3">
          <svg className="h-10 w-10 text-zinc-900 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M8 10h.01M12 10h.01M16 10h.01"/>
          </svg>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">Ysf-AI</h1>
        </div>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Interrogez plusieurs IA simultanément et obtenez une synthèse comparative de leurs réponses.
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-500">شورى — La consultation collective</p>

        <div className="flex flex-col gap-3 w-72">
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Accéder à Ysf-AI
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-6 text-xs text-zinc-400 dark:text-zinc-600">
        Youssef AMARZOU — ingénieur digital & industriel
      </footer>
    </div>
  );
}
