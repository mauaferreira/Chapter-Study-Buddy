import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SpeakerButton } from "@/components/SpeakerButton";
import { VOCAB } from "@/lib/curriculum";
import { useSpeak } from "@/hooks/useSpeak";
import { setStars } from "@/lib/progress";

const CARDS = VOCAB.slice(0, 14);

export function Flashcards() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set([0]));
  const { speak } = useSpeak();

  const card = CARDS[index];

  useEffect(() => {
    const t = window.setTimeout(() => speak(card.word), 220);
    setSeen((s) => new Set(s).add(index));
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (seen.size === CARDS.length) {
      setStars("/flashcards", 3);
    } else if (seen.size >= Math.ceil(CARDS.length * 0.66)) {
      setStars("/flashcards", 2);
    } else if (seen.size >= 4) {
      setStars("/flashcards", 1);
    }
  }, [seen]);

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % CARDS.length);
  };
  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + CARDS.length) % CARDS.length);
  };

  return (
    <AppShell
      title="Flashcards"
      hint="Toque na carta para virar · Use as setas para navegar"
      accentColor="bg-sky"
    >
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-5 mt-2">
        <span className="text-sm font-display font-semibold text-muted-foreground whitespace-nowrap">
          {index + 1} / {CARDS.length}
        </span>
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky via-leaf to-sun rounded-full"
            animate={{ width: `${((index + 1) / CARDS.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        </div>
        <Star size={20} className="fill-sun text-sun" strokeWidth={2} />
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-5 mb-5">
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.08 }}
          onClick={prev}
          aria-label="Previous"
          className="size-12 sm:size-14 rounded-full bg-white shadow-md border-2 border-sky/30 flex items-center justify-center cursor-pointer flex-shrink-0"
        >
          <ChevronLeft size={28} className="text-sky" strokeWidth={2.5} />
        </motion.button>

        {/* Card */}
        <div className="flex-1 max-w-md">
          <AnimatePresence mode="wait">
            <motion.button
              type="button"
              key={index + (flipped ? "-back" : "-front")}
              initial={{ opacity: 0, scale: 0.9, rotateY: flipped ? -90 : 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: flipped ? 90 : -90 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              onClick={() => setFlipped((f) => !f)}
              className="w-full aspect-square bg-white rounded-3xl shadow-lg border-4 border-sky/30 p-5 flex flex-col items-center justify-center gap-3 cursor-pointer relative overflow-hidden"
            >
              {!flipped ? (
                <>
                  <div className="absolute top-3 right-3 bg-sky/10 rounded-full p-1.5">
                    <RotateCcw size={14} className="text-sky" />
                  </div>
                  <div className="flex-1 w-full flex items-center justify-center">
                    <img
                      src={card.image}
                      alt={card.word}
                      className="max-h-[55%] max-w-[70%] object-contain"
                    />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight">
                    {card.word}
                  </h2>
                  <p className="text-sm text-muted-foreground italic">
                    Toque para ver a tradução
                  </p>
                </>
              ) : (
                <>
                  <div className="absolute top-3 right-3 bg-coral/10 rounded-full p-1.5">
                    <RotateCcw size={14} className="text-coral" />
                  </div>
                  <div className="flex-1 w-full flex items-center justify-center">
                    <img
                      src={card.image}
                      alt={card.word}
                      className="max-h-[40%] max-w-[55%] object-contain opacity-90"
                    />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                    {card.word}
                  </h2>
                  <div className="bg-coral/10 rounded-2xl px-4 py-2 border-2 border-coral/30">
                    <p className="text-xl sm:text-2xl font-display font-semibold text-coral">
                      {card.translation}
                    </p>
                  </div>
                </>
              )}
            </motion.button>
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.08 }}
          onClick={next}
          aria-label="Next"
          className="size-12 sm:size-14 rounded-full bg-white shadow-md border-2 border-sky/30 flex items-center justify-center cursor-pointer flex-shrink-0"
        >
          <ChevronRight size={28} className="text-sky" strokeWidth={2.5} />
        </motion.button>
      </div>

      <div className="flex justify-center">
        <SpeakerButton onClick={() => speak(card.word)} size="lg" variant="primary" />
      </div>
      <p className="text-center text-sm text-muted-foreground mt-3">Toque para ouvir de novo</p>
    </AppShell>
  );
}
