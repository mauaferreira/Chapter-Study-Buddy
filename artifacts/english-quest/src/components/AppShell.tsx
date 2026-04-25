import { Link } from "wouter";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import type { ReactNode } from "react";

interface AppShellProps {
  title: string;
  hint?: string;
  accentColor?: string; // tailwind bg utility e.g. "bg-sky"
  children: ReactNode;
}

export function AppShell({ title, hint, accentColor = "bg-sky", children }: AppShellProps) {
  return (
    <div className="min-h-screen w-full">
      <header className="px-4 sm:px-6 pt-4 pb-3 max-w-5xl mx-auto flex items-center gap-3">
        <Link href="/">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white border-2 border-foreground/10 rounded-full pl-3 pr-4 py-2 flex items-center gap-2 shadow-sm cursor-pointer"
            aria-label="Voltar para o início"
          >
            <Home size={18} strokeWidth={2.5} className="text-sky" />
            <span className="font-display font-semibold text-sm">Home</span>
          </motion.button>
        </Link>
        <div className={`flex-1 ${accentColor} text-white rounded-full px-5 py-2 shadow-md`}>
          <h1 className="text-lg sm:text-xl font-display font-semibold tracking-tight">{title}</h1>
        </div>
      </header>
      {hint && (
        <p className="max-w-5xl mx-auto px-6 -mt-1 mb-2 text-sm text-muted-foreground italic">
          {hint}
        </p>
      )}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">{children}</main>
    </div>
  );
}
