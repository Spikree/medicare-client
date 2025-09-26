import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Loader, Mail, User, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { DoctorInterface as Doctor } from "@/store/PatientStore";

interface Props {
  doctors: Doctor[];
  doctorStatus: "current" | "old";
  isFetchingDoctorList: boolean;
}

const RenderDoctorAccordion = ({
  doctors,
  doctorStatus,
  isFetchingDoctorList,
}: Props) => {
  if (isFetchingDoctorList) {
    return (
      <div className="p-4 m-4 flex justify-center">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No doctors found</p>
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full flex flex-col gap-4 p-2 sm:p-4"
    >
      {doctors.map((doctor) => (
        <Card key={doctor._id}>
          <AccordionItem
            value={doctor._id}
            className="px-4 sm:px-10 border-b-0"
          >
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full mr-2 sm:mr-4">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <UserCheck className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium truncate text-sm sm:text-base">
                    Dr. {doctor.doctor.name}
                  </span>
                </div>
                <Badge
                  variant={
                    doctor.patientStatus === "current" ? "default" : "secondary"
                  }
                  className="ml-2 text-xs"
                >
                  {doctor.patientStatus}
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
                    <span className="text-sm break-all sm:break-normal">
                      {doctor.doctor.email}
                    </span>
                  </div>

                  <div className="flex items-start sm:items-center gap-2 flex-col sm:flex-row">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">Doctor:</span>
                    </div>
                    <span className="text-sm">{doctor.doctor.name}</span>
                  </div>
                </div>

                <div className="pt-3 border-t flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Edit Doctor
                  </Button>

                  <Link
                    to={`/doctorDetails/${doctor.doctor._id}/${doctor?.doctor?.name}/${doctorStatus}`}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      View Details
                    </Button>
                  </Link>

                  <Link to={`/chatPagePatient/${doctor.doctor._id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Chat
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

export default RenderDoctorAccordion;
