import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SpeakerButton } from "@/components/SpeakerButton";
import { CelebrationScreen } from "@/components/CelebrationScreen";
import { Confetti } from "@/components/Confetti";
import { PrepositionScene } from "@/components/PrepositionScene";
import { PREPOSITION_QUESTIONS, PREPOSITIONS } from "@/lib/curriculum";
import { useSpeak } from "@/hooks/useSpeak";
import { setStars } from "@/lib/progress";

type Phase = "playing" | "celebrating";

function buildOptions(correct: string): string[] {
  const distractors = PREPOSITIONS.filter((p) => p !== correct)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return [correct, ...distractors].sort(() => Math.random() - 0.5);
}

export function PicturePrepositions() {
  const [questions, setQuestions] = useState(() =>
    [...PREPOSITION_QUESTIONS].sort(() => Math.random() - 0.5),
  );
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<string[]>(() => buildOptions(questions[0].preposition));
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("playing");
  const [showConfetti, setShowConfetti] = useState(false);
  const { speak } = useSpeak();

  const q = questions[index];
  const fullSentence = q.sentence.replace("___", q.preposition);

  useEffect(() => {
    if (phase !== "playing") return;
    setOptions(buildOptions(q.preposition));
    const t = window.setTimeout(() => speak(q.sentence.replace("___", "blank")), 280);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase]);

  const stars = useMemo(() => {
    if (correct >= questions.length) return 3;
    if (correct >= Math.ceil(questions.length * 0.7)) return 2;
    return 1;
  }, [correct, questions.length]);

  const onSelect = (opt: string) => {
    if (selected) return;
    const isRight = opt === q.preposition;
    setSelected(opt);
    if (isRight) {
      setCorrect((c) => c + 1);
      setShowConfetti(true);
      window.setTimeout(() => speak(fullSentence), 150);
      window.setTimeout(() => setShowConfetti(false), 1500);
      window.setTimeout(advance, 1500);
    } else {
      window.setTimeout(() => setSelected(null), 950);
    }
  };

  const advance = () => {
    setSelected(null);
    if (index + 1 >= questions.length) {
      setStars("/picture-prepositions", stars);
      setPhase("celebrating");
    } else {
      setIndex((i) => i + 1);
    }
  };

  const restart = () => {
    const next = [...PREPOSITION_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(next);
    setIndex(0);
    setCorrect(0);
    setSelected(null);
    setPhase("playing");
  };

  if (phase === "celebrating") {
    return (
      <AppShell title="Where is it?" accentColor="bg-sun">
        <CelebrationScreen
          stars={stars}
          total={questions.length}
          correct={correct}
          onPlayAgain={restart}
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Where is it?"
      hint="Olhe a cena e escolha a preposição certa"
      accentColor="bg-sun"
    >
      <Confetti show={showConfetti} />

      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm font-display font-semibold text-muted-foreground whitespace-nowrap">
          {index + 1} / {questions.length}
        </span>
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sun via-coral to-grape rounded-full"
            animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="bg-white rounded-3xl shadow-md border-2 border-sun/30 p-5 sm:p-7"
        >
          <div className="mb-4">
            <PrepositionScene sceneKey={q.sceneKey} className="max-w-md mx-auto" />
          </div>

          <div className="flex items-center justify-center gap-3 mb-5">
            <SpeakerButton
              onClick={() => speak(q.sentence.replace("___", "blank"))}
              size="md"
              variant="primary"
              label="Listen"
            />
            <p className="text-lg sm:text-xl font-display font-semibold text-foreground text-center leading-tight">
              {q.sentence.split("___")[0]}
              <span className="inline-block bg-sun/30 border-2 border-dashed border-sun rounded-lg px-3 py-0.5 mx-1 text-coral">
                ?
              </span>
              {q.sentence.split("___")[1]}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {options.map((opt) => {
              const isSelectedCorrect = selected === opt && opt === q.preposition;
              const isSelectedWrong = selected === opt && opt !== q.preposition;
              const dimmed = selected !== null && selected !== opt;
              return (
                <motion.button
                  type="button"
                  key={opt}
                  whileHover={!selected ? { scale: 1.04, y: -2 } : undefined}
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
                  className={`relative rounded-2xl border-3 py-4 px-3 cursor-pointer transition-colors ${
                    isSelectedCorrect
                      ? "bg-leaf/20 border-leaf"
                      : isSelectedWrong
                        ? "bg-destructive/15 border-destructive"
                        : dimmed
                          ? "bg-muted/50 border-muted opacity-50"
                          : "bg-white border-sun/50 hover:bg-sun/10"
                  } font-display font-semibold text-lg sm:text-xl text-foreground`}
                  style={{ borderWidth: 3 }}
                >
                  {opt}
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
