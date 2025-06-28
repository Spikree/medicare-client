import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, User } from "lucide-react";
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
}

const PatientAccordion = ({ patients }: props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (patients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No patients found</p>
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full flex flex-col gap-4 p-4"
    >
      {patients.map((patient) => (
        <Card>
          <AccordionItem
            key={patient._id}
            value={patient._id}
            className="px-10 border-b-0"
          >
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{patient.name}</span>
                </div>
                <Badge
                  variant={
                    patient.patientStatus === "current"
                      ? "default"
                      : "secondary"
                  }
                  className="ml-auto"
                >
                  {patient.patientStatus}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 space-y-4 px-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Created On:</span>
                    <span className="text-sm">
                      {formatDate(patient.createdOn)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t flex gap-2">
                  <Button size="sm" variant="outline">
                    Edit Patient
                  </Button>
                  <Link to={`/patientDetails/${patient?.patient}`}>
                    <Button size="sm" variant="outline">
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
  );
};

export default PatientAccordion;
