import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, Stethoscope, User } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface props {
  setShowLogin: (value: boolean) => void;
}

const roles = [
  {
    value: "doctor",
    label: "Doctor",
    hint: "Manage patients and records",
    icon: Stethoscope,
  },
  {
    value: "patient",
    label: "Patient",
    hint: "Track your own care",
    icon: User,
  },
] as const;

export function SignupForm({ setShowLogin }: props) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const { signup } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (/<[^>]*>/g.test(formData.name)) {
      toast.error("Invalid name");
      return;
    }

    if (!formData.role) {
      toast.error("Select whether you're a doctor or a patient");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Please accept the Terms of Service to continue");
      return;
    }

    setIsLoading(true);
    try {
      await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.role as "doctor" | "patient"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up your practice in a couple of minutes."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Role is the decision that shapes the whole account, so it leads and
            is shown as an explicit choice rather than hidden in a dropdown. */}
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-medium">I'm signing up as</legend>
          <div className="grid grid-cols-2 gap-3">
            {roles.map(({ value, label, hint, icon: Icon }) => {
              const selected = formData.role === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: value }))
                  }
                  className={cn(
                    "rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    selected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-input hover:border-border hover:bg-accent/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      selected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className="mt-2 block text-sm font-medium">{label}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                    {hint}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Dr. Sarah Johnson"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            placeholder="you@practice.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleInputChange}
              className="pr-10"
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
            className="mt-0.5"
          />
          <Label
            htmlFor="terms"
            className="text-sm font-normal leading-relaxed text-muted-foreground"
          >
            I agree to the{" "}
            <a href="#" className="text-primary underline-offset-4 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary underline-offset-4 hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading && <Loader2 className="animate-spin" />}
          {isLoading ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
