import {
  PatientStore,
  type DoctorDetailsInterface,
} from "@/store/PatientStore";
import { Dialog } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Calendar, Eye, FileText, Loader } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, useParams } from "react-router-dom";
import type { doctorDataAccessInfo } from "@/store/PatientStore";

interface Props {
  doctorDetailsList: DoctorDetailsInterface[];
  handleViewMore: (record: DoctorDetailsInterface) => void;
  doctorStatus: string;
  isFetchingDoctorDetails: boolean;
  doctorDataAccessInfo: doctorDataAccessInfo | null;
}

const DoctorDetailsComponent = ({
  doctorDetailsList,
  handleViewMore,
  doctorStatus,
  isFetchingDoctorDetails,
  doctorDataAccessInfo,
}: Props) => {
  const { removeDoctor, reassignDoctor } = PatientStore();
  const { doctorName } = useParams();
  const navigate = useNavigate();

  const { doctorId } = useParams();

  const handleRemoveDoctor = () => {
    if (doctorId) {
      removeDoctor(doctorId).then(() => {
        navigate("/home");
      });
    }
  };

  const handleReassignDoctor = () => {
    if (doctorId) {
      reassignDoctor(doctorId).then(() => {
        navigate("/home");
      });
    }
  };

  return (
    <Dialog>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="flex flex-col items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {doctorName}
            </h1>
            <p className="text-muted-foreground">
              Medical Records ({doctorDetailsList.length} entries)
            </p>
            <hr className="mt-2" />
            <div className="flex items-center text-muted-foreground mt-2"></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-wrap">
          {doctorStatus === "current" ? (
            <Button
              onClick={handleRemoveDoctor}
              variant={"green"}
              className="w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Remove Doctor</span>
              <span className="sm:hidden">Remove</span>
            </Button>
          ) : (
            <Button
              onClick={handleReassignDoctor}
              variant={"green"}
              className="w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Reassign Doctor</span>
              <span className="sm:hidden">Reassign</span>
            </Button>
          )}

          {doctorDataAccessInfo?.patientDataAccess ? (
            <Button
              // onClick={handleRemoveDoctor}
              variant={"green"}
              className="w-full sm:w-auto"
            >
              <span className="">Remove data access</span>
              {/* <span className="sm:hidden">Remove</span> */}
            </Button>
          ) : (
            <Button
              // onClick={handleRemoveDoctor}
              variant={"green"}
              className="w-full sm:w-auto"
            >
              <span className="">Give data access</span>
              {/* <span className="sm:hidden">Remove</span> */}
            </Button>
          )}
        </div>
      </div>

      {isFetchingDoctorDetails ? (
        <div className="flex justify-center p-8 m-8">
          <Loader className="animate-spin" />
        </div>
      ) : doctorDetailsList?.length > 0 ? (
        <div className="space-y-4">
          {doctorDetailsList.map((record: DoctorDetailsInterface) => (
            <Card
              key={record._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Disease
                      </label>
                      <p className="text-sm text-foreground break-words">
                        {record.Disease}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Symptoms
                      </label>
                      <p className="text-sm text-foreground break-words">
                        {record.symptom}
                      </p>
                    </div>
                    <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Date
                      </label>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        {new Date(record.createdOn).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewMore(record)}
                    className="flex items-center gap-2 w-full sm:w-auto lg:ml-4"
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
