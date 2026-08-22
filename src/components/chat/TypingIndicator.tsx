import { motion } from "framer-motion";

/** Three-dot "typing…" affordance shown above the composer. */
export function TypingIndicator() {
  return (
    <div className="px-5 pb-2">
      <div className="flex w-fit items-center gap-1 rounded-full border border-border bg-card px-3 py-2">
        {[0, 0.15, 0.3].map((delay) => (
          <motion.span
            key={delay}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 0.7,
              ease: "easeInOut",
              delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default TypingIndicator;
