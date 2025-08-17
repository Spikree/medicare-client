import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Calendar, Loader, Mail, User } from "lucide-react";
import { Card } from "./ui/card";
import { Link } from "react-router-dom";

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

const PatientAccordion = ({
  patients,
  patientStatus,
  fetchingPatientList,
}: props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (fetchingPatientList) {
    return (
      <div className="p-4 m-4 flex justify-center">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <>
      {patients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No patients found</p>
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          className="w-full flex flex-col gap-4 p-2 sm:p-4"
        >
          {patients.map((patient) => (
            <Card key={patient._id}>
              <AccordionItem value={patient._id} className="px-4 sm:px-10 border-b-0">
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full mr-2 sm:mr-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium truncate text-sm sm:text-base">{patient.name}</span>
                    </div>
                    <Badge
                      variant={
                        patient.patientStatus === "current"
                          ? "default"
                          : "secondary"
                      }
                      className="ml-2 text-xs"
                    >
                      {patient.patientStatus}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 space-y-4 px-4 sm:px-10">
                    <div className="space-y-3">
                      <div className="flex items-start sm:items-center gap-2 flex-col sm:flex-row">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">Email:</span>
                        </div>
                        <span className="text-sm break-all sm:break-normal">{patient.email}</span>
                      </div>
                      <div className="flex items-start sm:items-center gap-2 flex-col sm:flex-row">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            Created On:
                          </span>
                        </div>
                        <span className="text-sm">
                          {formatDate(patient.createdOn)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t flex flex-col sm:flex-row gap-2">
                      <Link
                        to={`/patientAiSummary/${patient?.patient}/${patient.name}`}
                      >
                        {patientStatus === "current" && (
                          <Button size="sm" variant="outline" className="w-full sm:w-auto">
                            AI Summary
                          </Button>
                        )}
                      </Link>

                      <Link
                        to={`/patientDetails/${patient?.patient}/${patient?.name}`}
                      >
                        <Button size="sm" variant="outline" className="w-full sm:w-auto">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>
      )}
    </>
  );
};

export default PatientAccordion;