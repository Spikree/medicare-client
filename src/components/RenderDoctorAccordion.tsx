import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Mail, User, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { DoctorInterface as Doctor } from "@/store/PatientStore";

interface Props {
  doctors: Doctor[];
  doctorStatus: "current" | "old";
}

const RenderDoctorAccordion = ({ doctors, doctorStatus }: Props) => {
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
      className="w-full flex flex-col gap-4 p-4"
    >
      {doctors.map((doctor) => (
        <Card key={doctor._id}>
          <AccordionItem value={doctor._id} className="px-10 border-b-0">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Dr. {doctor.doctor.name}</span>
                </div>
                <Badge
                  variant={
                    doctor.patientStatus === "current" ? "default" : "secondary"
                  }
                  className="ml-auto"
                >
                  {doctor.patientStatus}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 space-y-4 px-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm">{doctor.doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Doctor:</span>
                    <span className="text-sm">{doctor.doctor.name}</span>
                  </div>
                </div>

                <div className="pt-3 border-t flex gap-2">
                  <Button size="sm" variant="outline">
                    Edit Doctor
                  </Button>
                  <Link
                    to={`/doctorDetails/${doctor.doctor._id}/${doctor?.doctor?.name}/${doctorStatus}`}
                  >
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </Link>

                  <Button size="sm" variant="outline">
                    Chat
                  </Button>
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
