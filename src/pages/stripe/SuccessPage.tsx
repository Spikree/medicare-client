import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const setupIntent = searchParams.get("setup_intent");
    const paymentIntent = searchParams.get("payment_intent");
    const redirectStatus = searchParams.get("redirect_status");

    if (redirectStatus === "succeeded") {
      setStatus("success");
      if (setupIntent) {
        setMessage(
          "Your 7-day free trial has started. Your card is saved securely, and you won't be charged until the trial ends."
        );
      } else if (paymentIntent) {
        setMessage(
          "Your payment went through and your subscription is now active."
        );
      }
    } else if (redirectStatus === "failed") {
      setStatus("error");
      setMessage(
        "Something went wrong with your payment method. Please try again."
      );
    } else {
      setStatus("error");
      setMessage("No valid payment details found.");
    }
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  const isSuccess = status === "success";

  return (
    <div className="flex h-screen w-full items-center justify-center bg-surface p-4">
      <Card className="animate-fade-in-up w-full max-w-md p-8 text-center shadow-lg">
        <span
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            isSuccess ? "bg-success/10" : "bg-destructive/10"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-7 w-7 text-success" />
          ) : (
            <XCircle className="h-7 w-7 text-destructive" />
          )}
        </span>

        <h1 className="mt-5 text-xl font-semibold tracking-tight">
          {isSuccess ? "You're all set" : "Something went wrong"}
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {message}
        </p>

        <Button asChild size="lg" className="mt-7 w-full">
          <Link to={isSuccess ? "/dashboard" : "/checkOut"}>
            {isSuccess ? "Go to dashboard" : "Back to checkout"}
          </Link>
        </Button>
      </Card>
    </div>
  );
}
