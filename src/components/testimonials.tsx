import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Family Medicine",
    rating: 5,
    text: "Having the chart, the labs, and the conversation in one place removed a whole category of chasing. I stopped keeping a parallel list of who I still owed a follow-up.",
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    rating: 5,
    text: "Patient history is one click from the roster, and the record structure actually matches how I think about a visit — diagnosis, symptoms, what I prescribed.",
  },
  {
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    rating: 5,
    text: "Parents ask for records constantly. Exporting a complete, readable summary as a PDF takes seconds now instead of a morning.",
  },
];

function initials(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-b border-border bg-background py-20 lg:py-28"
    >
      <div className="container">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Practitioners
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Trusted by healthcare professionals
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            What clinicians say after moving their practice onto MedCare Pro.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3 lg:mt-16">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="flex flex-col p-6 transition-shadow hover:shadow-md"
            >
              <div
                className="flex gap-0.5"
                aria-label={`${testimonial.rating} out of 5`}
              >
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    className="h-4 w-4 fill-warning text-warning"
                  />
                ))}
              </div>

              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>

              <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initials(testimonial.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {testimonial.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {testimonial.specialty}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
