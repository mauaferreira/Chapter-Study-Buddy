import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Volume1 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SpeakerButton } from "@/components/SpeakerButton";
import { CelebrationScreen } from "@/components/CelebrationScreen";
import { Confetti } from "@/components/Confetti";
import { UNSCRAMBLE_WORDS } from "@/lib/curriculum";
import { useSpeak } from "@/hooks/useSpeak";
import { setStars } from "@/lib/progress";

interface Tile {
  id: number;
  letter: string;
  used: boolean;
}

function scramble(word: string): Tile[] {
  const letters = word.split("");
  let attempts = 0;
  let order = letters.map((_, i) => i);
  while (attempts < 6) {
    order = order.sort(() => Math.random() - 0.5);
    const reordered = order.map((idx) => letters[idx]).join("");
    if (reordered !== word || word.length <= 2) break;
    attempts += 1;
  }
  return order.map((idx, i) => ({ id: i, letter: letters[idx], used: false }));
}

type Phase = "playing" | "celebrating";

export function Unscramble() {
  const [index, setIndex] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>(() => scramble(UNSCRAMBLE_WORDS[0].word));
  const [slots, setSlots] = useState<(Tile | null)[]>(() =>
    new Array(UNSCRAMBLE_WORDS[0].word.length).fill(null),
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [hintActive, setHintActive] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const { speak, speakSlow } = useSpeak();

  const word = UNSCRAMBLE_WORDS[index];

  useEffect(() => {
    if (phase !== "playing") return;
    const t = window.setTimeout(() => speak(word.word), 240);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase]);

  const placedString = slots.map((s) => s?.letter ?? "").join("");
  const isComplete = placedString.length === word.word.length && placedString === word.word;
  const isFilled = slots.every((s) => s !== null);

  useEffect(() => {
    if (isComplete) {
      setShowConfetti(true);
      setCompleted((c) => c + 1);
      window.setTimeout(() => speak(word.word), 200);
      const t = window.setTimeout(() => {
        setShowConfetti(false);
        advance();
      }, 1700);
      return () => window.clearTimeout(t);
    } else if (isFilled && !isComplete) {
      // wrong guess — gently send all back after brief shake
      const t = window.setTimeout(() => {
        const next = scramble(word.word);
        setTiles(next);
        setSlots(new Array(word.word.length).fill(null));
      }, 800);
      return () => window.clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placedString]);

  const stars = useMemo(() => {
    if (completed >= UNSCRAMBLE_WORDS.length) return 3;
    if (completed >= Math.ceil(UNSCRAMBLE_WORDS.length * 0.7)) return 2;
    if (completed >= 3) return 1;
    return 1;
  }, [completed]);

  const advance = () => {
    setHintActive(false);
    if (index + 1 >= UNSCRAMBLE_WORDS.length) {
      setStars("/unscramble", stars);
      setPhase("celebrating");
    } else {
      const nextIdx = index + 1;
      setIndex(nextIdx);
      setTiles(scramble(UNSCRAMBLE_WORDS[nextIdx].word));
      setSlots(new Array(UNSCRAMBLE_WORDS[nextIdx].word.length).fill(null));
    }
  };

  const restart = () => {
    setIndex(0);
    setTiles(scramble(UNSCRAMBLE_WORDS[0].word));
    setSlots(new Array(UNSCRAMBLE_WORDS[0].word.length).fill(null));
    setCompleted(0);
    setPhase("playing");
  };

  const placeTile = (tile: Tile) => {
    if (tile.used || isComplete) return;
    const firstEmpty = slots.findIndex((s) => s === null);
    if (firstEmpty === -1) return;
    const newSlots = [...slots];
    newSlots[firstEmpty] = tile;
    setSlots(newSlots);
    setTiles((t) => t.map((x) => (x.id === tile.id ? { ...x, used: true } : x)));
  };

  const removeTile = (slotIdx: number) => {
    if (isComplete) return;
    const tile = slots[slotIdx];
    if (!tile) return;
    const newSlots = [...slots];
    newSlots[slotIdx] = null;
    setSlots(newSlots);
    setTiles((t) => t.map((x) => (x.id === tile.id ? { ...x, used: false } : x)));
  };

  const handleHint = () => {
    if (isComplete) return;
    setHintActive(true);
    window.setTimeout(() => setHintActive(false), 1500);
  };

  if (phase === "celebrating") {
    return (
      <AppShell title="Unscramble" accentColor="bg-leaf">
        <CelebrationScreen
          stars={stars}
          total={UNSCRAMBLE_WORDS.length}
          correct={completed}
          onPlayAgain={restart}
        />
      </AppShell>
    );
  }

  const firstLetter = word.word[0];

  return (
    <AppShell
      title="Unscramble"
      hint="Ouça e clique nas letras para formar a palavra"
      accentColor="bg-leaf"
    >
      <Confetti show={showConfetti} />

      {/* Progress */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-sm font-display font-semibold text-muted-foreground whitespace-nowrap">
          {index + 1} / {UNSCRAMBLE_WORDS.length}
        </span>
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-leaf via-sky to-grape rounded-full"
            animate={{ width: `${((index + 1) / UNSCRAMBLE_WORDS.length) * 100}%` }}
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
          className="bg-white rounded-3xl shadow-md border-2 border-leaf/20 p-5 sm:p-7"
        >
          {/* Image hint */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-b from-leaf/10 to-sky/10 rounded-2xl p-3 max-w-[180px]">
              <img src={word.image} alt="" className="h-32 sm:h-36 mx-auto object-contain" />
            </div>
          </div>

          {/* Audio buttons */}
          <div className="flex justify-center gap-3 mb-6">
            <SpeakerButton onClick={() => speak(word.word)} size="lg" variant="primary" />
            <motion.button
              type="button"
              onClick={() => speakSlow(word.word)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="rounded-full bg-sun text-foreground border-2 border-sun/60 size-20 flex flex-col items-center justify-center cursor-pointer shadow-md"
              aria-label="Slow"
            >
              <Volume1 size={28} strokeWidth={2.5} />
              <span className="text-[10px] font-display font-bold mt-0.5">SLOW</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={handleHint}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="rounded-full bg-coral text-white size-20 flex flex-col items-center justify-center cursor-pointer shadow-md"
              aria-label="Hint"
            >
              <Lightbulb size={28} strokeWidth={2.5} />
              <span className="text-[10px] font-display font-bold mt-0.5">HINT</span>
            </motion.button>
          </div>

          {/* Slots */}
          <motion.div
            animate={isFilled && !isComplete ? { x: [0, -8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex justify-center gap-2 sm:gap-3 mb-6 flex-wrap"
          >
            {slots.map((slot, i) => {
              const showHintGlow = hintActive && i === 0;
              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => removeTile(i)}
                  whileTap={slot ? { scale: 0.9 } : undefined}
                  className={`size-12 sm:size-14 rounded-2xl border-3 flex items-center justify-center text-2xl sm:text-3xl font-display font-bold transition-colors ${
                    slot
                      ? isComplete
                        ? "bg-leaf text-white border-leaf"
                        : "bg-sky text-white border-sky cursor-pointer"
                      : showHintGlow
                        ? "bg-sun/30 border-sun border-dashed animate-pulse"
                        : "bg-muted border-muted-foreground/30 border-dashed"
                  }`}
                  style={{ borderWidth: 3 }}
                >
                  <AnimatePresence mode="popLayout">
                    {slot ? (
                      <motion.span
                        key={slot.id}
                        initial={{ scale: 0, y: -10 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      >
                        {slot.letter}
                      </motion.span>
                    ) : showHintGlow ? (
                      <motion.span
                        key="hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sun"
                      >
                        {firstLetter}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Letter tiles */}
          <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
            {tiles.map((tile) => (
              <motion.button
                key={tile.id}
                type="button"
                onClick={() => placeTile(tile)}
                disabled={tile.used}
                whileTap={!tile.used ? { scale: 0.85, y: 4 } : undefined}
                whileHover={!tile.used ? { scale: 1.08, y: -2 } : undefined}
                animate={{ opacity: tile.used ? 0.25 : 1, scale: tile.used ? 0.85 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`size-12 sm:size-14 rounded-2xl border-3 flex items-center justify-center text-2xl sm:text-3xl font-display font-bold cursor-pointer ${
                  tile.used
                    ? "bg-muted text-muted-foreground/40 border-muted"
                    : "bg-gradient-to-b from-leaf to-leaf/80 text-white border-leaf shadow-md"
                }`}
                style={{ borderWidth: 3 }}
              >
                {tile.letter}
              </motion.button>
            ))}
          </div>

          {isComplete && (
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center text-2xl font-display font-bold text-leaf mt-5"
            >
              {word.word}!
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
