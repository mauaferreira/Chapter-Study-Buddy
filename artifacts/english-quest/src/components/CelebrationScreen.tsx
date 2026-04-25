import { motion } from "framer-motion";
import { Star, Repeat, Home as HomeIcon } from "lucide-react";
import { Link } from "wouter";
import { Confetti } from "./Confetti";

interface CelebrationScreenProps {
  stars: number; // 1-3
  total: number;
  correct: number;
  onPlayAgain: () => void;
  message?: string;
}

export function CelebrationScreen({
  stars,
  total,
  correct,
  onPlayAgain,
  message,
}: CelebrationScreenProps) {
  const messages = ["Great job!", "Awesome!", "Well done!", "You did it!", "Amazing!"];
  const finalMessage = message ?? messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4">
      <Confetti show count={50} />
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border-4 border-sun text-center max-w-md w-full"
      >
        <h2 className="text-4xl sm:text-5xl font-display font-bold text-sky mb-2">
          {finalMessage}
        </h2>
        <p className="text-lg text-foreground/70 mb-6">
          {correct} of {total} correct
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 250 }}
            >
              <Star
                size={56}
                strokeWidth={2}
                className={i <= stars ? "fill-sun text-sun" : "fill-muted text-muted-foreground/40"}
              />
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={onPlayAgain}
            className="flex-1 bg-coral text-white rounded-2xl py-3 px-5 font-display font-semibold text-lg flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Repeat size={20} strokeWidth={2.5} />
            Play again
          </motion.button>
          <Link href="/" className="flex-1">
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              className="bg-sky text-white rounded-2xl py-3 px-5 font-display font-semibold text-lg flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <HomeIcon size={20} strokeWidth={2.5} />
              Home
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
