import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2 } from "lucide-react";

export default function CheckoutForm({
  clientSecret,
  hasHadTrial,
}: {
  clientSecret: string;
  hasHadTrial: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage(null);

    const isSetupIntent = clientSecret.startsWith("seti_");
    let error;

    if (isSetupIntent) {
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      });
      error = result.error;
    } else {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      });
      error = result.error;
    }

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(
          error.message ?? "An unexpected error occurred with your card."
        );
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      <div className="rounded-lg border border-border bg-muted/40 p-5">
        <h2 className="text-sm font-semibold">Subscription summary</h2>

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">AI Summary Pro</dt>
            <dd className="tabular font-medium">£3.00 / month</dd>
          </div>

          {/* Only show the free trial line if they are getting one */}
          {!hasHadTrial && (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Free trial</dt>
              <dd>
                <Badge variant="success">7 days</Badge>
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-semibold">Due today</span>
          {/* Change the amount due based on their history */}
          <span className="tabular text-lg font-semibold">
            {hasHadTrial ? "£3.00" : "£0.00"}
          </span>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {hasHadTrial
            ? "Your subscription begins immediately."
            : "You won't be charged until your trial ends. Cancel anytime."}
        </p>
      </div>

      <PaymentElement />

      <Button
        type="submit"
        size="lg"
        disabled={isLoading || !stripe || !elements}
        className="w-full"
      >
        {isLoading && <Loader2 className="animate-spin" />}
        {isLoading
          ? "Processing…"
          : hasHadTrial
            ? "Subscribe now"
            : "Start 7-day free trial"}
      </Button>

      {message && (
        <div
          role="alert"
          className="flex gap-2.5 rounded-md border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-relaxed">{message}</span>
        </div>
      )}
    </form>
  );
}
