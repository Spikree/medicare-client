import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clientSecret = urlParams.get("payment_intent_client_secret");

    if (clientSecret) {
      setStatus("Payment Successful! 🎉");
    } else {
      setStatus("No payment details found.");
    }
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ color: status.includes("Successful") ? "green" : "black" }}>
        {status}
      </h1>
      {status.includes("Successful") && (
        <p>
          Your test transaction is complete. Check your backend console for the
          webhook!
        </p>
      )}
      <button
        onClick={() => (window.location.href = "/")}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Go Back Home
      </button>
    </div>
  );
}
