import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SpeakerButton } from "@/components/SpeakerButton";
import { CelebrationScreen } from "@/components/CelebrationScreen";
import { Confetti } from "@/components/Confetti";
import { PrepositionScene } from "@/components/PrepositionScene";
import { buildQuiz, type QuizQuestion } from "@/lib/curriculum";
import { useSpeak } from "@/hooks/useSpeak";
import { setStars } from "@/lib/progress";

type Phase = "playing" | "celebrating";

export function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => buildQuiz());
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [phase, setPhase] = useState<Phase>("playing");
  const { speak } = useSpeak();

  const q = questions[index];

  useEffect(() => {
    if (phase !== "playing") return;
    const t = window.setTimeout(() => speak(q.speakText), 240);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase]);

  const stars = useMemo(() => {
    if (correct >= questions.length) return 3;
    if (correct >= Math.ceil(questions.length * 0.7)) return 2;
    if (correct >= Math.ceil(questions.length * 0.4)) return 1;
    return 1;
  }, [correct, questions.length]);

  const onSelect = (label: string, isCorrect: boolean) => {
    if (selected) return;
    setSelected(label);
    setShowResult(true);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setShowConfetti(true);
      speak(q.type === "fill-preposition" ? label : q.prompt === "What is this?" ? label : label);
      window.setTimeout(() => setShowConfetti(false), 1500);
      window.setTimeout(advance, 1300);
    } else {
      window.setTimeout(() => {
        setSelected(null);
        setShowResult(false);
      }, 1100);
    }
  };

  const advance = () => {
    setSelected(null);
    setShowResult(false);
    if (index + 1 >= questions.length) {
      setStars("/quiz", stars);
      setPhase("celebrating");
    } else {
      setIndex((i) => i + 1);
    }
  };

  const restart = () => {
    setQuestions(buildQuiz());
    setIndex(0);
    setCorrect(0);
    setSelected(null);
    setShowResult(false);
    setPhase("playing");
  };

  if (phase === "celebrating") {
    return (
      <AppShell title="Quiz" accentColor="bg-coral">
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
    <AppShell title="Quiz" hint="Toque na resposta certa" accentColor="bg-coral">
      <Confetti show={showConfetti} />

      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-display font-semibold text-muted-foreground whitespace-nowrap">
          {index + 1} / {questions.length}
        </span>
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-coral via-sun to-leaf rounded-full"
            animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ type: "spring", stiffness: 220, damping: 25 }}
          className="bg-white rounded-3xl shadow-md border-2 border-coral/20 p-5 sm:p-6"
        >
          {/* Question header */}
          <div className="flex items-center gap-3 mb-4">
            <SpeakerButton
              onClick={() => speak(q.speakText)}
              size="md"
              variant="accent"
              label="Repeat"
            />
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground flex-1">
              {q.type === "word-to-picture" && (
                <>
                  Find the <span className="text-coral">{q.prompt}</span>
                </>
              )}
              {q.type === "picture-to-word" && q.prompt}
              {q.type === "fill-preposition" && (
                <span className="leading-tight">{q.prompt}</span>
              )}
            </h2>
          </div>

          {/* Image / scene if any */}
          {q.image && (
            <div className="flex justify-center mb-4">
              <div className="bg-muted rounded-2xl p-3 max-w-xs">
                <img src={q.image} alt="" className="max-h-44 mx-auto" />
              </div>
            </div>
          )}
          {q.sceneKey && (
            <div className="flex justify-center mb-4">
              <PrepositionScene sceneKey={q.sceneKey} className="max-w-md w-full" />
            </div>
          )}

          {/* Options */}
          <div
            className={`grid gap-3 ${
              q.type === "word-to-picture" || (q.type === "picture-to-word" && q.options.length === 4)
                ? "grid-cols-2"
                : "grid-cols-1 sm:grid-cols-3"
            }`}
          >
            {q.options.map((opt) => {
              const isSelectedWrong = selected === opt.label && !opt.isCorrect && showResult;
              const isSelectedCorrect = selected === opt.label && opt.isCorrect && showResult;
              const dimmed = selected !== null && selected !== opt.label;
              return (
                <motion.button
                  type="button"
                  key={opt.label + (opt.image ?? "")}
                  whileHover={!selected ? { scale: 1.04 } : undefined}
                  whileTap={!selected ? { scale: 0.95 } : undefined}
                  animate={
                    isSelectedWrong
                      ? { x: [0, -8, 8, -6, 6, 0] }
                      : isSelectedCorrect
                        ? { scale: [1, 1.08, 1] }
                        : {}
                  }
                  transition={{ duration: 0.4 }}
                  onClick={() => onSelect(opt.label, opt.isCorrect)}
                  disabled={!!selected}
                  className={`relative rounded-2xl border-2 p-3 cursor-pointer transition-colors ${
                    isSelectedCorrect
                      ? "bg-leaf/20 border-leaf"
                      : isSelectedWrong
                        ? "bg-destructive/15 border-destructive"
                        : dimmed
                          ? "bg-muted/50 border-muted opacity-50"
                          : "bg-white border-coral/30 hover:bg-coral/5"
                  } flex flex-col items-center justify-center gap-2`}
                >
                  {opt.image && (
                    <img src={opt.image} alt={opt.label} className="h-20 sm:h-24 object-contain" />
                  )}
                  <span className="font-display font-semibold text-base sm:text-lg text-foreground text-center">
                    {opt.label}
                  </span>
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
