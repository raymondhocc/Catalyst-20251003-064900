import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles } from "lucide-react";
export function Header() {
  return (
    <header className="relative py-16 sm:py-24">
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-orange-50 dark:from-slate-900/50 dark:via-slate-900 dark:to-slate-900/50"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5 dark:opacity-50 dark:invert" />
      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center gap-3">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Catalyst AI
          </h1>
        </div>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          E-Commerce Campaign Simulator
        </p>
      </div>
      <ThemeToggle className="absolute top-6 right-4 sm:right-6 lg:right-8" />
    </header>
  );
}