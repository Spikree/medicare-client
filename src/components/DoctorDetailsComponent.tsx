import {
  PatientStore,
  type DoctorDetailsInterface,
} from "@/store/PatientStore";
import { FileText, Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import type { doctorDataAccessInfo } from "@/store/PatientStore";
import MedicalRecordCard from "@/components/MedicalRecordCard";
import EmptyState from "@/components/EmptyState";

interface Props {
  doctorDetailsList: DoctorDetailsInterface[];
  handleViewMore: (record: DoctorDetailsInterface) => void;
  doctorStatus: string;
  isFetchingDoctorDetails: boolean;
  doctorDataAccessInfo: doctorDataAccessInfo | null;
  giveDoctorDataAccess: (doctorId: string) => void;
  removeDataAccessFromDoctor: (doctorId: string) => void;
}

const DoctorDetailsComponent = ({
  doctorDetailsList,
  handleViewMore,
  doctorStatus,
  isFetchingDoctorDetails,
  doctorDataAccessInfo,
  giveDoctorDataAccess,
  removeDataAccessFromDoctor,
}: Props) => {
  const { removeDoctor, reassignDoctor, getDoctorDataAccessInfo } =
    PatientStore();
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

  const handleGiveDataAccess = () => {
    if (doctorId) {
      giveDoctorDataAccess(doctorId);
      getDoctorDataAccessInfo(doctorId);
    }
  };

  const handleRemoveDataAccess = () => {
    if (doctorId) {
      removeDataAccessFromDoctor(doctorId);
      getDoctorDataAccessInfo(doctorId);
    }
  };

  const hasAccess = Boolean(doctorDataAccessInfo?.patientDataAccess);

  return (
    <>
      <div className="mb-5 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold">
          Medical records
          <span className="ml-2 tabular text-sm font-normal text-muted-foreground">
            {doctorDetailsList.length}{" "}
            {doctorDetailsList.length === 1 ? "entry" : "entries"}
          </span>
        </h2>

        <div className="flex flex-wrap gap-2">
          {doctorStatus === "current" ? (
            <Button variant="destructive" onClick={handleRemoveDoctor}>
              Remove doctor
            </Button>
          ) : (
            <Button variant="outline" onClick={handleReassignDoctor}>
              Reassign doctor
            </Button>
          )}
        </div>
      </div>

      {/* Data-sharing control for past clinicians — the patient decides whether
          a former doctor keeps visibility of their history. */}
      {doctorStatus !== "current" && (
        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            {hasAccess ? (
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            ) : (
              <ShieldOff className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">
                {hasAccess
                  ? "This doctor can see your records"
                  : "This doctor cannot see your records"}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                You can change this at any time.
              </p>
            </div>
          </div>

          <Button
            variant={hasAccess ? "destructive" : "default"}
            onClick={hasAccess ? handleRemoveDataAccess : handleGiveDataAccess}
            className="shrink-0"
          >
            {hasAccess ? "Revoke access" : "Grant access"}
          </Button>
        </div>
      )}

      {isFetchingDoctorDetails ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading records…
        </div>
      ) : doctorDetailsList?.length > 0 ? (
        <div className="space-y-3">
          {doctorDetailsList.map((record: DoctorDetailsInterface) => (
            <MedicalRecordCard
              key={record._id}
              record={record}
              onViewMore={() => handleViewMore(record)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No medical records yet"
          description="Records this clinician adds will appear here."
        />
      )}
    </>
  );
};

export default DoctorDetailsComponent;
