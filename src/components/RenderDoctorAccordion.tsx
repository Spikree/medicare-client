import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Mail, MessageSquare, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import EmptyState from "@/components/EmptyState";
import type { DoctorInterface as Doctor } from "@/store/PatientStore";

interface Props {
  doctors: Doctor[];
  doctorStatus: "current" | "old";
  isFetchingDoctorList: boolean;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

const RenderDoctorAccordion = ({
  doctors,
  doctorStatus,
  isFetchingDoctorList,
}: Props) => {
  if (isFetchingDoctorList) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading doctors…
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <EmptyState
        icon={Stethoscope}
        title="No doctors found"
        description={
          doctorStatus === "current"
            ? "Add a doctor to start sharing your records with them."
            : "Clinicians you no longer see will be listed here."
        }
      />
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="divide-y divide-border overflow-hidden rounded-lg border border-border"
    >
      {doctors.map((doctor) => (
        <AccordionItem
          key={doctor._id}
          value={doctor._id}
          className="border-b-0 px-4 data-[state=open]:bg-muted/30"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials(doctor.doctor.name)}</AvatarFallback>
              </Avatar>
              <span className="truncate font-medium">
                Dr. {doctor.doctor.name}
              </span>
              <Badge
                variant={
                  doctor.patientStatus === "current" ? "success" : "muted"
                }
                className="ml-auto mr-3 shrink-0"
              >
                {doctor.patientStatus === "current" ? "Current" : "Past"}
              </Badge>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <dl className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <dt className="sr-only">Email</dt>
                <dd className="truncate">{doctor.doctor.email}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" asChild>
                <Link
                  to={`/doctorDetails/${doctor.doctor._id}/${doctor?.doctor?.name}/${doctorStatus}`}
                >
                  View details
                </Link>
              </Button>

              <Button size="sm" variant="outline" asChild>
                <Link to={`/chatPagePatient/${doctor.doctor._id}`}>
                  <MessageSquare />
                  Message
                </Link>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default RenderDoctorAccordion;
