import { useEffect } from "react";
import type { PatientLabResults } from "@/store/DoctorStore";
import { Card, CardContent } from "./ui/card";
import { Calendar, Eye, FileText, Loader } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Props {
  doctorId: string;
  isFetchingLabResultsByDoctor: boolean;
  getLabResultsByDoctor: (doctorId: string) => void;
  LabResultsByDoctorList: PatientLabResults[];
}

const PatientLabResultsByDoctor = ({
  doctorId,
  getLabResultsByDoctor,
  isFetchingLabResultsByDoctor,
  LabResultsByDoctorList,
}: Props) => {
  useEffect(() => {
    getLabResultsByDoctor(doctorId);
  }, [getLabResultsByDoctor, doctorId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Lab Results</h2>
          <p className="text-muted-foreground">
            {LabResultsByDoctorList?.length || 0}{" "}
            {LabResultsByDoctorList?.length <= 1
              ? "lab result by doctor available"
              : "lab results by doctor available"}
          </p>
        </div>
      </div>

      {!isFetchingLabResultsByDoctor ? (
        <div>
          {LabResultsByDoctorList && LabResultsByDoctorList.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {LabResultsByDoctorList.map((labResult) => (
                <Card
                  key={labResult._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={labResult.labResult}
                          alt={labResult.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-foreground capitalize">
                            {labResult.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            Lab Result
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(labResult.createdOn).toLocaleDateString()}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          window.open(labResult.labResult, "_blank")
                        }
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Size
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Lab Results Yet
                </h3>
                <p className="text-muted-foreground">
                  No lab results have been uploaded for this patient.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full justify-center">
          <Loader className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default PatientLabResultsByDoctor;
