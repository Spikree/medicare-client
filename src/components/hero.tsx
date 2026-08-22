import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HomePageImage } from "@/assets/assets";

const trustMarkers = ["HIPAA compliant", "SOC 2 aligned", "99.9% uptime"];

export default function Hero() {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      {/* Faint grid, faded out toward the edges so it never competes with copy. */}
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 opacity-[0.6] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />

      <div className="container relative py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Built for regulated clinical practice
            </span>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              Clinical care,
              <br className="hidden sm:block" /> without the paperwork.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              MedCare Pro brings patient records, lab results, and secure
              messaging into one system — so your team spends less time on
              admin and more time on care.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => navigate("/auth")}>
                Get started
                <ArrowRight />
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToFeatures}>
                See how it works
              </Button>
            </div>

            <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
              {trustMarkers.map((marker) => (
                <li key={marker} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                  />
                  {marker}
                </li>
              ))}
            </ul>
          </div>

          {/* Product shot framed as an application window rather than a
              free-floating image — it reads as software, not marketing art. */}
          <div className="animate-fade-in-up [animation-delay:120ms]">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
              <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="ml-2 truncate text-xs text-muted-foreground">
                  medcarepro.app / patients
                </span>
              </div>
              <img
                src={HomePageImage}
                alt="MedCare Pro patient dashboard"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
