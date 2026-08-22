import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Stethoscope, FileText } from "lucide-react";
import { Logo } from "@/components/Logo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const highlights = [
  {
    icon: Stethoscope,
    title: "Your whole caseload, at a glance",
    body: "Current and past patients, searchable, with full history one click away.",
  },
  {
    icon: FileText,
    title: "Records that travel with the patient",
    body: "Diagnoses, prescriptions, and lab results captured against every visit.",
  },
  {
    icon: ShieldCheck,
    title: "Access the patient controls",
    body: "Clinicians see a history only once the patient has approved the connection.",
  },
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel — desktop only; on mobile the form gets the full screen. */}
      <aside className="relative hidden overflow-hidden bg-primary p-12 lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="bg-grid absolute inset-0 opacity-[0.07]"
        />

        <button
          type="button"
          onClick={() => navigate("/")}
          className="relative w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Logo tone="inverted" />
        </button>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-primary-foreground">
            The clinical system your practice actually runs on.
          </h2>

          <ul className="mt-10 space-y-7">
            {highlights.map(({ icon: Icon, title: heading, body }) => (
              <li key={heading} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20">
                  <Icon className="h-4 w-4 text-primary-foreground" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-primary-foreground">
                    {heading}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-primary-foreground/70">
                    {body}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/60">
          &copy; {new Date().getFullYear()} MedCare Pro
        </p>
      </aside>

      <main className="flex flex-col justify-center bg-background px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-10 rounded-md lg:hidden"
          >
            <Logo />
          </button>

          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>

          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
