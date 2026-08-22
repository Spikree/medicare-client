import { Card } from "@/components/ui/card";
import { Eye, KeyRound, Lock, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Control {
  title: string;
  body: string;
  icon: LucideIcon;
}

const controls: Control[] = [
  {
    title: "Patient-granted access",
    body: "A clinician sees a patient's history only after that patient approves the connection. Access can be revoked at any time.",
    icon: UserCheck,
  },
  {
    title: "Role-scoped permissions",
    body: "Doctor and patient views are separated at the route level, so each account reaches only the records it is entitled to.",
    icon: KeyRound,
  },
  {
    title: "Encrypted in transit",
    body: "All traffic between the client, the API, and the record store is served over TLS, including real-time messaging.",
    icon: Lock,
  },
  {
    title: "Traceable record history",
    body: "Every record carries the clinician who authored it and when, so a chart can always be accounted for.",
    icon: Eye,
  },
];

export default function Security() {
  return (
    <section
      id="security"
      className="border-b border-border bg-muted/40 py-20 lg:py-28"
    >
      <div className="container">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Trust &amp; security
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Patient data, handled the way it should be
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Medical records carry a duty of care. These controls are part of the
            product, not an add-on tier.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {controls.map((control) => {
            const Icon = control.icon;
            return (
              <Card key={control.title} className="p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-4 text-base font-semibold">
                  {control.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {control.body}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
