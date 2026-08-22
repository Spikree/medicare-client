import { Check, FileText, MessageSquareLock, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  patientManagementImage,
  digitalRecordsImage,
  patientCommunicationImage,
} from "@/assets/assets";

interface Feature {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  image: string;
  benefits: string[];
}

const features: Feature[] = [
  {
    id: "patient-management",
    eyebrow: "Patient management",
    title: "One roster, always current",
    summary:
      "Keep every active and discharged patient in a single, searchable list your whole practice can trust.",
    icon: Users,
    image: patientManagementImage,
    benefits: [
      "Separate current and past patients so the day's caseload is never buried.",
      "Search by name and open a full history in a single click.",
      "Invite patients directly, and let them approve the connection before any data is shared.",
    ],
  },
  {
    id: "digital-records",
    eyebrow: "Digital records",
    title: "History that reads like a chart",
    summary:
      "Diagnoses, symptoms, prescriptions, and lab results captured in a consistent structure — not scattered across notes.",
    icon: FileText,
    image: digitalRecordsImage,
    benefits: [
      "Record diagnosis, symptoms, and prescribed medication against every visit.",
      "Attach lab results and imaging to the record they belong to.",
      "Export a complete patient summary as a PDF whenever it's requested.",
    ],
  },
  {
    id: "patient-communication",
    eyebrow: "Secure messaging",
    title: "A private line to every patient",
    summary:
      "Real-time messaging built into the record, so follow-ups don't leave the system.",
    icon: MessageSquareLock,
    image: patientCommunicationImage,
    benefits: [
      "Message patients directly from their chart — no separate inbox to check.",
      "Patients control which clinicians can access their history, and can revoke it.",
      "Every conversation stays attached to the care relationship it belongs to.",
    ],
  },
];

function FeatureRow({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  const imageFirst = index % 2 === 1;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={imageFirst ? "lg:order-2" : undefined}>
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Icon className="h-4 w-4" />
          {feature.eyebrow}
        </span>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {feature.title}
        </h3>

        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {feature.summary}
        </p>

        <ul className="mt-6 space-y-3">
          {feature.benefits.map((benefit) => (
            <li key={benefit} className="flex gap-3 text-sm leading-relaxed">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-3 w-3 text-primary" strokeWidth={3} />
              </span>
              <span className="text-muted-foreground">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={imageFirst ? "lg:order-1" : undefined}>
        <div className="overflow-hidden rounded-xl border border-border bg-muted/40 p-6 shadow-sm">
          <img
            className="mx-auto h-56 w-auto object-contain sm:h-64 lg:h-72"
            src={feature.image}
            alt={`${feature.title} illustration`}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="border-b border-border bg-background py-20 lg:py-28">
      <div className="container">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Platform
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything a practice runs on, in one place
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Purpose-built for clinical workflows — not a generic CRM with
            medical labels applied on top.
          </p>
        </div>

        <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-28">
          {features.map((feature, index) => (
            <FeatureRow key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
