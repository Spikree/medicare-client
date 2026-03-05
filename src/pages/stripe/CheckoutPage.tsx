import { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, ShieldCheck } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PROMISE_KEY, {
  developerTools: {
    assistant: {
      enabled: import.meta.env.VITE_BACKEND_DEVTOOLS,
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
            data.error?.message || "Failed to create subscription",
          );
        }

        setClientSecret(data.clientSecret);
        setHasHadTrial(data.hasHadTrial);
      } catch (err: any) {
        setError(err.message);
        // If it failed, reset the ref so the user can try again
        hasFetched.current = false;
      }
    };

    createSubscription();
  }, [authUser]);

  return (
    <div className="min-h-screen flex justify-center items-center w-full bg-slate-50 p-4 font-sans">
      {!clientSecret && !error && (
        <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-500">
          <div className="bg-white p-5 rounded-full shadow-sm border border-slate-200 relative">
            <div className="absolute inset-0 border-4 border-green-100 rounded-full animate-pulse"></div>
            <Loader2 className="w-8 h-8 text-green-600 animate-spin relative z-10" />
          </div>
          <div className="text-center space-y-1.5">
            <h3 className="text-xl font-semibold text-slate-900">
              Securing your checkout
            </h3>
            <p className="text-sm text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Payment by Stripe
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 max-w-md w-full text-center shadow-sm">
          <h3 className="font-semibold text-lg mb-1">Checkout Error</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {clientSecret && (
        <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Complete Setup
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Enter your details to start your subscription.
            </p>
          </div>

          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              clientSecret={clientSecret}
              hasHadTrial={hasHadTrial}
            />
          </Elements>

          <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Payments processed securely by Stripe</span>
          </div>
        </div>
      )}
    </div>
  );
}
