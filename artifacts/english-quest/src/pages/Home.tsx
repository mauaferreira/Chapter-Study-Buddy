import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Layers,
  HelpCircle,
  Shuffle,
  Ear,
  ImageIcon,
  CheckSquare,
  Star,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProgress } from "@/lib/progress";

interface ActivityCard {
  href: string;
  title: string;
  hint: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  bg: string;
  ring: string;
  iconBg: string;
}

const ACTIVITIES: ActivityCard[] = [
  {
    href: "/flashcards",
    title: "Flashcards",
    hint: "Veja, ouça e aprenda novas palavras",
    icon: Layers,
    bg: "bg-sky text-white",
    ring: "ring-sky",
    iconBg: "bg-white/25",
  },
  {
    href: "/quiz",
    title: "Quiz",
    hint: "Responda perguntas de inglês",
    icon: HelpCircle,
    bg: "bg-coral text-white",
    ring: "ring-coral",
    iconBg: "bg-white/25",
  },
  {
    href: "/unscramble",
    title: "Unscramble",
    hint: "Ouça e organize as letras",
    icon: Shuffle,
    bg: "bg-leaf text-white",
    ring: "ring-leaf",
    iconBg: "bg-white/25",
  },
  {
    href: "/listen-and-match",
    title: "Listen & Match",
    hint: "Escute e encontre a imagem certa",
    icon: Ear,
    bg: "bg-grape text-white",
    ring: "ring-grape",
    iconBg: "bg-white/25",
  },
  {
    href: "/picture-prepositions",
    title: "Where is it?",
    hint: "Escolha a preposição certa",
    icon: ImageIcon,
    bg: "bg-sun text-foreground",
    ring: "ring-sun",
    iconBg: "bg-white/40",
  },
  {
    href: "/does-doesnt",
    title: "Does or Doesn't?",
    hint: "Responda Yes ou No",
    icon: CheckSquare,
    bg: "bg-sky text-white",
    ring: "ring-sky",
    iconBg: "bg-white/25",
  },
];

export function Home() {
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    setProgress(getAllProgress());
    const handler = () => setProgress(getAllProgress());
    window.addEventListener("english-quest-progress", handler);
    return () => window.removeEventListener("english-quest-progress", handler);
  }, []);

  const totalStars = Object.values(progress).reduce((a, b) => a + b, 0);
  const maxStars = ACTIVITIES.length * 3;

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white rounded-3xl shadow-md border-2 border-sky/20 p-5 sm:p-6 mb-6 flex items-center gap-4 sm:gap-5"
        >
          <motion.div
            animate={{ rotate: [0, -8, 8, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
            className="size-16 sm:size-20 rounded-2xl bg-gradient-to-br from-sun to-coral flex items-center justify-center shadow-md flex-shrink-0"
          >
            <Sparkles size={36} className="text-white" strokeWidth={2.5} />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              Olá, amiguinha!
            </p>
            <h1 className="text-2xl sm:text-4xl font-display font-bold text-foreground tracking-tight">
              English Quest
            </h1>
            <p className="text-sm sm:text-base text-sky font-semibold">
              Unit 3 — Where we live
            </p>
          </div>
          <div className="flex-shrink-0 bg-sun/15 rounded-2xl px-3 py-2 border border-sun/40 flex items-center gap-1.5">
            <Star size={20} className="fill-sun text-sun" strokeWidth={2} />
            <span className="font-display font-bold text-lg sm:text-xl text-foreground">
              {totalStars}
              <span className="text-muted-foreground/60 text-sm font-medium">/{maxStars}</span>
            </span>
          </div>
        </motion.div>

        {/* Activity grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACTIVITIES.map((act, idx) => {
            const Icon = act.icon;
            const stars = progress[act.href] ?? 0;
            return (
              <motion.div
                key={act.href}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.05 * idx,
                  type: "spring",
                  stiffness: 220,
                  damping: 22,
                }}
              >
                <Link href={act.href}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`${act.bg} rounded-3xl p-5 shadow-md cursor-pointer relative overflow-hidden`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`${act.iconBg} rounded-2xl size-16 flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon size={32} strokeWidth={2.5} className="text-current" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-display font-bold text-2xl tracking-tight">
                          {act.title}
                        </h2>
                        <p className="text-sm opacity-90 mt-0.5">{act.hint}</p>
                        <div className="flex gap-0.5 mt-2.5">
                          {[1, 2, 3].map((i) => (
                            <Star
                              key={i}
                              size={18}
                              strokeWidth={2.5}
                              className={
                                i <= stars
                                  ? "fill-current text-current opacity-100"
                                  : "text-current opacity-30"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Decorative bubble */}
                    <div className="absolute -bottom-8 -right-6 size-24 rounded-full bg-white/10" />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 italic">
          Toque em uma atividade para começar &middot; Ative o som para ouvir a pronúncia
        </p>
      </div>
    </div>
  );
}
