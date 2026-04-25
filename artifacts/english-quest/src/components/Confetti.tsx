import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = [
  "hsl(var(--sun))",
  "hsl(var(--sky))",
  "hsl(var(--leaf))",
  "hsl(var(--coral))",
  "hsl(var(--grape))",
];

interface ConfettiProps {
  show: boolean;
  count?: number;
}

export function Confetti({ show, count = 30 }: ConfettiProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        rotate: Math.random() * 360,
        delay: Math.random() * 0.3,
        color: COLORS[i % COLORS.length],
        size: 8 + Math.random() * 10,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      })),
    [count],
  );

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -50, x: `${p.x}vw`, opacity: 1, rotate: p.rotate }}
          animate={{ y: "110vh", rotate: p.rotate + 540, opacity: 0 }}
          transition={{ duration: 2 + Math.random() * 1, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "3px",
          }}
        />
      ))}
    </div>
  );
}
