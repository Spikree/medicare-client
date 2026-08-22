import { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useAuthStore } from "@/store/useAuthStore";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PROMISE_KEY, {
  developerTools: {
    assistant: {
      enabled: import.meta.env.VITE_BACKEND_DEVTOOLS === true,
    },
  },
});

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [hasHadTrial, setHasHadTrial] = useState(false);
  const [error, setError] = useState("");

  const { authUser } = useAuthStore();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!authUser?.email || hasFetched.current) return;

    const createSubscription = async () => {
      hasFetched.current = true;

      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: authUser.email,
            name: authUser.name || "Unknown User",
            // Put your actual Price ID here
            priceId: import.meta.env.VITE_PRICE_ID,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error?.message || "Failed to create subscription"
          );
        }

        setClientSecret(data.clientSecret);
        setHasHadTrial(data.hasHadTrial);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create subscription"
        );
        // If it failed, reset the ref so the user can try again
        hasFetched.current = false;
      }
    };

    createSubscription();
  }, [authUser]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface p-4">
      {!clientSecret && !error && (
        <div className="animate-fade-in flex flex-col items-center gap-4">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <div className="text-center">
            <h1 className="text-base font-semibold">Securing your checkout</h1>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              Payments handled by Stripe
            </p>
          </div>
        </div>
      )}

      {error && (
        <Card className="w-full max-w-md p-6 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </span>
          <h1 className="mt-4 text-base font-semibold">Checkout error</h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {error}
          </p>
        </Card>
      )}

      {clientSecret && (
        <Card className="animate-fade-in-up w-full max-w-lg p-6 shadow-lg sm:p-8">
          <div className="flex flex-col items-center text-center">
            <Logo showWordmark={false} />
            <h1 className="mt-4 text-xl font-semibold tracking-tight">
              Complete setup
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your details to start your subscription.
            </p>
          </div>

          <div className="mt-7">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                clientSecret={clientSecret}
                hasHadTrial={hasHadTrial}
              />
            </Elements>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Payments processed securely by Stripe
          </p>
        </Card>
      )}
    </div>
  );
}
