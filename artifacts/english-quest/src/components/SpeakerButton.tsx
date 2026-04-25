import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpeakerButtonProps {
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "accent" | "ghost";
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: "size-10",
  md: "size-14",
  lg: "size-20",
};

const iconSizeMap = {
  sm: 18,
  md: 26,
  lg: 36,
};

export function SpeakerButton({
  onClick,
  size = "md",
  variant = "primary",
  label = "Tap to hear",
  className,
}: SpeakerButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-sky text-white shadow-md hover:brightness-110"
      : variant === "accent"
        ? "bg-sun text-foreground shadow-md hover:brightness-105"
        : "bg-white/80 text-sky border-2 border-sky/30 shadow-sm hover:bg-white";

  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.06 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={cn(
        "rounded-full flex items-center justify-center cursor-pointer",
        sizeMap[size],
        variantClass,
        className,
      )}
    >
      <Volume2 size={iconSizeMap[size]} strokeWidth={2.5} />
    </motion.button>
  );
}
