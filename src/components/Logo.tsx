import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Inverted mark for use on dark bands (footer, CTA). */
  tone?: "default" | "inverted";
  showWordmark?: boolean;
};

/**
 * Brand mark: a clinical cross whose horizontal bar doubles as a pulse line.
 * Drawn inline so it inherits colour and stays crisp at every size.
 */
export function Logo({
  className,
  tone = "default",
  showWordmark = true,
}: LogoProps) {
  const inverted = tone === "inverted";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md",
          inverted ? "bg-white/10 ring-1 ring-white/20" : "bg-primary"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={cn("h-5 w-5", inverted ? "text-white" : "text-primary-foreground")}
        >
          <path
            d="M12 4v5m0 6v5"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
          <path
            d="M4 12h3.4l1.6-3 2.4 6 1.9-4 1.3 2.5h5.4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {showWordmark && (
        <span
          className={cn(
            "text-[0.9375rem] font-semibold tracking-tight",
            inverted ? "text-white" : "text-foreground"
          )}
        >
          MedCare&nbsp;Pro
        </span>
      )}
    </span>
  );
}

export default Logo;
