import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SpeakerButton } from "@/components/SpeakerButton";
import { CelebrationScreen } from "@/components/CelebrationScreen";
import { Confetti } from "@/components/Confetti";
import { VOCAB, type VocabItem } from "@/lib/curriculum";
import { useSpeak } from "@/hooks/useSpeak";
import { setStars } from "@/lib/progress";

interface Round {
  target: VocabItem;
  options: VocabItem[];
}

function buildRounds(count = 8): Round[] {
  const targets = [...VOCAB].sort(() => Math.random() - 0.5).slice(0, count);
  return targets.map((target) => {
    const distractors = VOCAB.filter((v) => v.word !== target.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return {
      target,
      options: [target, ...distractors].sort(() => Math.random() - 0.5),
    };
  });
}

type Phase = "playing" | "celebrating";

export function ListenAndMatch() {
  const [rounds, setRounds] = useState<Round[]>(() => buildRounds());
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("playing");
  const [showConfetti, setShowConfetti] = useState(false);
  const { speak } = useSpeak();

  const round = rounds[index];

  useEffect(() => {
    if (phase !== "playing") return;
    const t = window.setTimeout(() => speak(round.target.word), 280);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase]);

  const stars = useMemo(() => {
    if (correct >= rounds.length) return 3;
    if (correct >= Math.ceil(rounds.length * 0.7)) return 2;
    return 1;
  }, [correct, rounds.length]);

  const onSelect = (option: VocabItem) => {
    if (selected) return;
    const isCorrect = option.word === round.target.word;
    setSelected(option.word);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setShowConfetti(true);
      window.setTimeout(() => setShowConfetti(false), 1500);
      window.setTimeout(advance, 1100);
    } else {
      window.setTimeout(() => setSelected(null), 950);
    }
  };

  const advance = () => {
    setSelected(null);
    if (index + 1 >= rounds.length) {
      setStars("/listen-and-match", stars);
      setPhase("celebrating");
    } else {
      setIndex((i) => i + 1);
    }
  };

  const restart = () => {
    setRounds(buildRounds());
    setIndex(0);
    setCorrect(0);
    setSelected(null);
    setPhase("playing");
  };

  if (phase === "celebrating") {
    return (
      <AppShell title="Listen & Match" accentColor="bg-grape">
        <CelebrationScreen
          stars={stars}
          total={rounds.length}
          correct={correct}
          onPlayAgain={restart}
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Listen & Match"
      hint="Escute a palavra e toque na imagem certa"
      accentColor="bg-grape"
    >
      <Confetti show={showConfetti} />

      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm font-display font-semibold text-muted-foreground whitespace-nowrap">
          {index + 1} / {rounds.length}
        </span>
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-grape via-coral to-sun rounded-full"
            animate={{ width: `${((index + 1) / rounds.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="bg-white rounded-3xl shadow-md border-2 border-grape/20 p-5 sm:p-7"
        >
          <div className="flex justify-center mb-6">
            <SpeakerButton onClick={() => speak(round.target.word)} size="lg" variant="primary" />
          </div>
          <p className="text-center text-base text-muted-foreground mb-5 font-medium">
            Tap the speaker to hear again
          </p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {round.options.map((opt) => {
              const isSelectedCorrect = selected === opt.word && opt.word === round.target.word;
              const isSelectedWrong = selected === opt.word && opt.word !== round.target.word;
              const dimmed = selected !== null && selected !== opt.word;
              return (
                <motion.button
                  type="button"
                  key={opt.word}
                  whileHover={!selected ? { scale: 1.04, y: -3 } : undefined}
                  whileTap={!selected ? { scale: 0.95 } : undefined}
                  animate={
                    isSelectedWrong
                      ? { x: [0, -8, 8, -6, 6, 0] }
                      : isSelectedCorrect
                        ? { scale: [1, 1.08, 1] }
                        : {}
                  }
                  transition={{ duration: 0.4 }}
                  onClick={() => onSelect(opt)}
                  disabled={!!selected}
                  className={`relative aspect-square rounded-2xl border-3 p-3 cursor-pointer transition-colors ${
                    isSelectedCorrect
                      ? "bg-leaf/20 border-leaf"
                      : isSelectedWrong
                        ? "bg-destructive/15 border-destructive"
                        : dimmed
                          ? "bg-muted/50 border-muted opacity-50"
                          : "bg-white border-grape/30 hover:bg-grape/5"
                  } flex flex-col items-center justify-center gap-1`}
                  style={{ borderWidth: 3 }}
                >
                  <img
                    src={opt.image}
                    alt={opt.word}
                    className="max-h-[75%] max-w-[80%] object-contain"
                  />
                  {(isSelectedCorrect || isSelectedWrong) && (
                    <span className="font-display font-semibold text-sm text-foreground/80 mt-1">
                      {opt.word}
                    </span>
                  )}
                  {isSelectedCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-leaf rounded-full p-1.5 shadow-md"
                    >
                      <Check size={18} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                  {isSelectedWrong && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-destructive rounded-full p-1.5 shadow-md"
                    >
                      <X size={18} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
