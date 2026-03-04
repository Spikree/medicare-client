import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
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
          "Your 7-day free trial has officially started. Your card has been saved securely, and you won't be charged until the trial ends.",
        );
      } else if (paymentIntent) {
        setMessage(
          "Your payment was successful and your subscription is now active!",
        );
      }
    } else if (redirectStatus === "failed") {
      setStatus("error");
      setMessage(
        "Something went wrong with your payment method. Please try again.",
      );
    } else {
      setStatus("error");
      setMessage("No valid payment details found.");
    }
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8 text-center shadow-lg border-0">
        {status === "success" ? (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="w-20 h-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              You're All Set!
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
            <Link to="/dashboard">
              {" "}
              {/* Change this to wherever your app lives */}
              <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg rounded-xl">
                Go to Dashboard
              </Button>
            </Link>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Oops!</h1>
            <p className="text-gray-600 mb-8">{message}</p>
            <Link to="/checkout">
              <Button className="w-full bg-gray-900 hover:bg-gray-800 h-12 text-lg rounded-xl text-white">
                Back to Checkout
              </Button>
            </Link>
          </>
        )}
      </Card>
    </div>
  );
}
