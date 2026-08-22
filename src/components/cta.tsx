import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="border-b border-border bg-primary">
      <div className="container py-16 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to move your practice over?
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
              Create an account and bring your first patients across today.
              Nothing to install, and no card required to start.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/auth")}
            >
              Create an account
              <ArrowRight />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => navigate("/auth")}
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
