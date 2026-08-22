import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Loader2, Mail, MessageSquare, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import EmptyState from "@/components/EmptyState";

interface Patient {
  _id: string;
  name: string;
  email: string;
  doctor: string;
  patient: string;
  patientStatus: string;
  createdOn: string;
}

interface props {
  patients: Patient[];
  patientStatus: "current" | "old";
  fetchingPatientList: boolean;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

const PatientAccordion = ({
  patients,
  patientStatus,
  fetchingPatientList,
}: props) => {
  if (fetchingPatientList) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading patients…
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No patients found"
        description={
          patientStatus === "current"
            ? "Patients you add will appear here once they accept the request."
            : "Discharged patients will be listed here."
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
      {patients.map((patient) => (
        <AccordionItem
          key={patient._id}
          value={patient._id}
          className="border-b-0 px-4 data-[state=open]:bg-muted/30"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials(patient.name)}</AvatarFallback>
              </Avatar>
              <span className="truncate font-medium">{patient.name}</span>
              <Badge
                variant={
                  patient.patientStatus === "current" ? "success" : "muted"
                }
                className="ml-auto mr-3 shrink-0 capitalize"
              >
                {patient.patientStatus === "current" ? "Current" : "Discharged"}
              </Badge>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <dl className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <dt className="sr-only">Email</dt>
                <dd className="truncate">{patient.email}</dd>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                <dt className="text-muted-foreground">Added</dt>
                <dd className="tabular">{formatDate(patient.createdOn)}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" asChild>
                <Link
                  to={`/patientDetails/${patient?.patient}/${patient?.name}/${patientStatus}`}
                >
                  View details
                </Link>
              </Button>

              {patientStatus === "current" && (
                <Button size="sm" variant="outline" asChild>
                  <Link
                    to={`/patientAiSummary/${patient?.patient}/${patient.name}`}
                  >
                    <Sparkles />
                    AI summary
                  </Link>
                </Button>
              )}

              <Button size="sm" variant="outline" asChild>
                <Link to={`/chatPage/${patient.patient}`}>
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

export default PatientAccordion;
