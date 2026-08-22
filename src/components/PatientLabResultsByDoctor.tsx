import { useEffect } from "react";
import type { PatientLabResults } from "@/store/DoctorStore";
import { FileText, Loader2 } from "lucide-react";
import LabResultGrid from "@/components/LabResultGrid";
import EmptyState from "@/components/EmptyState";

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

  const count = LabResultsByDoctorList?.length ?? 0;

  return (
    <div>
      <div className="mb-5 border-b border-border pb-5">
        <h2 className="text-base font-semibold">
          Lab results
          <span className="ml-2 tabular text-sm font-normal text-muted-foreground">
            {count} uploaded by this doctor
          </span>
        </h2>
      </div>

      {isFetchingLabResultsByDoctor ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading lab results…
        </div>
      ) : count > 0 ? (
        <LabResultGrid results={LabResultsByDoctorList} />
      ) : (
        <EmptyState
          icon={FileText}
          title="No lab results yet"
          description="Lab reports this clinician uploads will appear here."
        />
      )}
    </div>
  );
};

export default PatientLabResultsByDoctor;
