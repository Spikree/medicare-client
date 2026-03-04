import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

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
          error.message ?? "An unexpected error occurred with your card.",
        );
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full max-w-md mx-auto"
    >
      {/* 👇 DYNAMIC ORDER SUMMARY */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Subscription Summary
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>AI Summary Pro Plan</span>
            <span className="font-medium text-gray-900">£3.00 / month</span>
          </div>
          {/* Only show the free trial line if they are getting one! */}
          {!hasHadTrial && (
            <div className="flex justify-between text-gray-600">
              <span>Free Trial</span>
              <span className="font-medium text-green-600">7 Days</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
          <span className="font-semibold text-gray-900">Due Today</span>
          {/* Change the amount due based on their history */}
          <span className="text-xl font-bold text-gray-900">
            {hasHadTrial ? "£3.00" : "£0.00"}
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          {hasHadTrial
            ? "Your subscription will begin immediately."
            : "You won't be charged until your trial ends. Cancel anytime."}
        </p>
      </div>
      {/* 👆 END ORDER SUMMARY */}

      <PaymentElement />

      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white h-12 text-lg rounded-xl transition-transform active:scale-95"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            {/* Change button text dynamically */}
            <span>
              {hasHadTrial ? "Subscribe Now" : "Start 7-Day Free Trial"}
            </span>
          </div>
        )}
      </Button>

      {message && (
        <div className="text-sm text-red-500 text-center mt-2 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
          {message}
        </div>
      )}
    </form>
  );
}
