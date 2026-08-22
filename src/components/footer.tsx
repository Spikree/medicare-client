import { Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Logo } from "@/components/Logo";

const columns = [
  {
    heading: "Product",
    links: ["Features", "Security", "Pricing", "Integrations"],
  },
  {
    heading: "Support",
    links: ["Help center", "Documentation", "Training", "Contact us"],
  },
];

const contact = [
  { icon: Phone, value: "1-800-MEDCARE" },
  { icon: Mail, value: "support@medcarepro.com" },
  { icon: MapPin, value: "San Francisco, CA" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-white/70">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:pr-8">
            <Logo tone="inverted" />
            <p className="mt-4 text-sm leading-relaxed">
              Practice management for clinicians — records, labs, and secure
              messaging in one system.
            </p>
            <div className="mt-6 flex gap-2">
              {[Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-white/15 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">Social link</span>
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h4 className="text-sm font-semibold text-white">
                {column.heading}
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold text-white">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {contact.map(({ icon: Icon, value }) => (
                <li key={value} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-white/45" />
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} MedCare Pro. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">
              Privacy policy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms of service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
