import {
  PatientStore,
  type DoctorDetailsInterface,
} from "@/store/PatientStore";
import { Dialog } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Calendar, Eye, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  doctorDetailsList: DoctorDetailsInterface[];
  handleViewMore: (record: DoctorDetailsInterface) => void;
  doctorStatus: string
}

const DoctorDetailsComponent = ({
  doctorDetailsList,
  handleViewMore,
  doctorStatus,
}: Props) => {
  const { removeDoctor, reassignDoctor } = PatientStore();
  const { doctorName } = useParams();
  const navigate = useNavigate();

  const { doctorId } = useParams();

  const handleRemoveDoctor = () => {
    if (doctorId) {
      removeDoctor(doctorId).then(() => {
        navigate("/home")
      })
    }
  };

  const handleReassignDoctor = () => {
    if(doctorId) {
      reassignDoctor(doctorId).then(() => {
        navigate("/home")
      })
    }
  }

  return (
    <Dialog>
      <div className="flex justify-between items-start mb-6">
        <div className="sm:flex w-full   justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{doctorName}</h1>
            <p className="text-muted-foreground">
              Medical Records ({doctorDetailsList.length} entries)
            </p>
            <hr className="mt-2" />
            <div className="flex items-center text-muted-foreground mt-2"></div>
          </div>

          {doctorStatus === "current" ? (
            <Button onClick={handleRemoveDoctor} variant={"green"}>
              Remove Doctor
            </Button>
          ) : (
            <Button onClick={handleReassignDoctor} variant={"green"}>Reassign Doctor</Button>
          )}
        </div>
      </div>

      {doctorDetailsList?.length > 0 ? (
        <div className="space-y-4">
          {doctorDetailsList.map((record: DoctorDetailsInterface) => (
            <Card
              key={record._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Disease
                      </label>
                      <p className="text-sm text-foreground">
                        {record.Disease}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Symptoms
                      </label>
                      <p className="text-sm text-foreground">
                        {record.symptom}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Date
                      </label>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(record.createdOn).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewMore(record)}
                    className="flex items-center gap-2 ml-4"
                  >
                    <Eye className="h-4 w-4" />
                    View More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[347px]">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Medical Records Yet
            </h3>
            <p className="text-muted-foreground">
              No medical records have been uploaded for this patient.
            </p>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default DoctorDetailsComponent;
