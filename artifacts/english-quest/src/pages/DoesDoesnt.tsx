import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ThumbsUp, ThumbsDown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SpeakerButton } from "@/components/SpeakerButton";
import { CelebrationScreen } from "@/components/CelebrationScreen";
import { Confetti } from "@/components/Confetti";
import { DOES_DOESNT_QUESTIONS } from "@/lib/curriculum";
import { useSpeak } from "@/hooks/useSpeak";
import { setStars } from "@/lib/progress";

type Phase = "playing" | "celebrating";

export function DoesDoesnt() {
  const [questions] = useState(() => [...DOES_DOESNT_QUESTIONS].sort(() => Math.random() - 0.5));
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);
  const [phase, setPhase] = useState<Phase>("playing");
  const [showConfetti, setShowConfetti] = useState(false);
  const { speak } = useSpeak();

  const q = questions[index];

  useEffect(() => {
    if (phase !== "playing") return;
    const t = window.setTimeout(() => speak(q.question), 280);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase]);

  const stars = useMemo(() => {
    if (correct >= questions.length) return 3;
    if (correct >= Math.ceil(questions.length * 0.7)) return 2;
    return 1;
  }, [correct, questions.length]);

  const onAnswer = (answer: "yes" | "no") => {
    if (selected) return;
    setSelected(answer);
    const isRight = answer === q.answer;
    if (isRight) {
      setCorrect((c) => c + 1);
      setShowConfetti(true);
      window.setTimeout(() => speak(q.fullAnswer), 200);
      window.setTimeout(() => setShowConfetti(false), 1500);
      window.setTimeout(advance, 1700);
    } else {
      window.setTimeout(() => setSelected(null), 1000);
    }
  };

  const advance = () => {
    setSelected(null);
    if (index + 1 >= questions.length) {
      setStars("/does-doesnt", stars);
      setPhase("celebrating");
    } else {
      setIndex((i) => i + 1);
    }
  };

  const restart = () => {
    setIndex(0);
    setCorrect(0);
    setSelected(null);
    setPhase("playing");
  };

  if (phase === "celebrating") {
    return (
      <AppShell title="Does or Doesn't?" accentColor="bg-sky">
        <CelebrationScreen
          stars={stars}
          total={questions.length}
          correct={correct}
          onPlayAgain={restart}
        />
      </AppShell>
    );
  }

  const showFullAnswer = selected === q.answer;

  return (
    <AppShell
      title="Does or Doesn't?"
      hint="Olhe a imagem, ouça e responda Yes ou No"
      accentColor="bg-sky"
    >
      <Confetti show={showConfetti} />

      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm font-display font-semibold text-muted-foreground whitespace-nowrap">
          {index + 1} / {questions.length}
        </span>
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky via-leaf to-sun rounded-full"
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
          className="bg-white rounded-3xl shadow-md border-2 border-sky/20 p-5 sm:p-7"
        >
          {/* Image */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-b from-sky/10 to-sun/10 rounded-2xl p-3 max-w-[200px]">
              <img src={q.image} alt="" className="h-32 sm:h-40 mx-auto object-contain" />
            </div>
          </div>

          {/* Question */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <SpeakerButton onClick={() => speak(q.question)} size="md" variant="primary" />
            <p className="text-xl sm:text-2xl font-display font-semibold text-foreground text-center leading-tight">
              {q.question}
            </p>
          </div>

          {showFullAnswer && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-base sm:text-lg font-display font-semibold text-leaf mt-3 mb-1"
            >
              {q.fullAnswer}
            </motion.p>
          )}
          {q.hintPt && !showFullAnswer && (
            <p className="text-center text-sm text-muted-foreground italic mt-1 mb-2">
              {q.hintPt}
            </p>
          )}

          {/* Yes / No buttons */}
          <div className="grid grid-cols-2 gap-4 mt-5">
            {(["yes", "no"] as const).map((ans) => {
              const isSelectedCorrect = selected === ans && ans === q.answer;
              const isSelectedWrong = selected === ans && ans !== q.answer;
              const dimmed = selected !== null && selected !== ans;
              const isYes = ans === "yes";
              return (
                <motion.button
                  type="button"
                  key={ans}
                  whileHover={!selected ? { scale: 1.05, y: -3 } : undefined}
                  whileTap={!selected ? { scale: 0.94 } : undefined}
                  animate={
                    isSelectedWrong
                      ? { x: [0, -8, 8, -6, 6, 0] }
                      : isSelectedCorrect
                        ? { scale: [1, 1.1, 1] }
                        : {}
                  }
                  transition={{ duration: 0.4 }}
                  onClick={() => onAnswer(ans)}
                  disabled={!!selected}
                  className={`relative rounded-3xl border-3 py-6 px-3 cursor-pointer transition-colors flex flex-col items-center gap-2 ${
                    isSelectedCorrect
                      ? "bg-leaf/20 border-leaf"
                      : isSelectedWrong
                        ? "bg-destructive/15 border-destructive"
                        : dimmed
                          ? "bg-muted/50 border-muted opacity-50"
                          : isYes
                            ? "bg-leaf text-white border-leaf hover:brightness-105"
                            : "bg-coral text-white border-coral hover:brightness-105"
                  } font-display font-bold text-2xl shadow-md`}
                  style={{ borderWidth: 3 }}
                >
                  {isYes ? (
                    <ThumbsUp size={36} strokeWidth={2.5} className="text-current" />
                  ) : (
                    <ThumbsDown size={36} strokeWidth={2.5} className="text-current" />
                  )}
                  <span>{isYes ? "Yes" : "No"}</span>
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
