import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, HeartPulse, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialog,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PatientDetails } from "@/store/DoctorStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { CommonStore } from "@/store/CommonStore";
import { useEffect, useState } from "react";
import MedicalRecordCard from "@/components/MedicalRecordCard";
import EmptyState from "@/components/EmptyState";

interface Props {
  patientDetailsList: PatientDetails[];
  disease: string;
  symptom: string;
  patientExperience: string;
  medicationPrescribed: string;
  showPatientDetailsByCurrentDoctor: boolean;
  setShowPatientDetailsByCurrentDoctor: (value: boolean) => void;
  setSymptom: (symptom: string) => void;
  setPatientExperience: (patientExperience: string) => void;
  setMedicationPrescribed: (medicationPrescribed: string) => void;
  setDisease: (disease: string) => void;
  handleViewMore: (record: PatientDetails) => void;
  addPatientRecords: () => void;
  isUploadPatientsDialogOpen: boolean;
  setIsUploadPatientsDialogOpen: (value: boolean) => void;
  getAllPatientData: () => void;
  fetchingPatientDetails: boolean;
  patientStatus: string | undefined;
}

const MedicalRecords = ({
  addPatientRecords,
  setMedicationPrescribed,
  setPatientExperience,
  medicationPrescribed,
  patientExperience,
  patientDetailsList,
  handleViewMore,
  disease,
  setDisease,
  symptom,
  setSymptom,
  showPatientDetailsByCurrentDoctor,
  setShowPatientDetailsByCurrentDoctor,
  isUploadPatientsDialogOpen,
  setIsUploadPatientsDialogOpen,
  getAllPatientData,
  fetchingPatientDetails,
  patientStatus,
}: Props) => {
  const { patientId, patientName } = useParams();
  const { authUser } = useAuthStore();
  const { allergiesAndHealthInfo, getAllergiesAndHealthinfo } = CommonStore();

  const [isAllergiesAndHealthInfoOpen, setIsAllergiesAndHealthInfoOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (patientId) {
      getAllergiesAndHealthinfo(patientId);
    }
  }, [getAllergiesAndHealthinfo, patientId]);

  const patientDetailsByCurrentDoctor = patientDetailsList?.filter(
    (medicalRecord) =>
      medicalRecord.doctor?.toString() === authUser?._id.toString()
  );

  const visibleRecords = showPatientDetailsByCurrentDoctor
    ? patientDetailsByCurrentDoctor
    : patientDetailsList;

  const canSubmitRecord =
    disease.trim() && symptom.trim() && medicationPrescribed.trim();

  return (
    <Dialog
      open={isUploadPatientsDialogOpen}
      onOpenChange={setIsUploadPatientsDialogOpen}
    >
      <div className="mb-5 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">
            Medical records
            <span className="ml-2 tabular text-sm font-normal text-muted-foreground">
              {patientDetailsList.length}{" "}
              {patientDetailsList.length === 1 ? "entry" : "entries"}
            </span>
          </h2>

          <div className="flex items-center gap-2">
            <Checkbox
              id="authored-by-me"
              checked={showPatientDetailsByCurrentDoctor}
              onCheckedChange={(checked) =>
                setShowPatientDetailsByCurrentDoctor(!!checked)
              }
            />
            <Label
              htmlFor="authored-by-me"
              className="text-sm font-normal text-muted-foreground"
            >
              Only records I authored
            </Label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {patientStatus === "current" && (
            <>
              <DialogTrigger asChild>
                <Button>
                  <Plus />
                  Add record
                </Button>
              </DialogTrigger>

              <Button onClick={getAllPatientData} variant="outline">
                <Download />
                Export data
              </Button>
            </>
          )}

          <Button
            onClick={() => setIsAllergiesAndHealthInfoOpen(true)}
            variant="outline"
          >
            <HeartPulse />
            Health info
          </Button>
        </div>
      </div>

      {fetchingPatientDetails ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading records…
        </div>
      ) : visibleRecords?.length > 0 ? (
        <div className="space-y-3">
          {visibleRecords.map((record: PatientDetails) => (
            <MedicalRecordCard
              key={record._id}
              record={record}
              onViewMore={() => handleViewMore(record)}
            />
          ))}
        </div>
      ) : patientStatus === "old" ? (
        <EmptyState
          icon={FileText}
          title="Access to this patient's data has been removed"
          description="The patient revoked your access, so their records are no longer visible."
        />
      ) : (
        <EmptyState
          icon={FileText}
          title="No medical records yet"
          description="Records you add for this patient will appear here."
        />
      )}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add medical record</DialogTitle>
          <DialogDescription>
            Capture the visit against {patientName ?? "this patient"}&rsquo;s
            chart.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="record-disease">Diagnosis</Label>
            <Input
              id="record-disease"
              required
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              placeholder="e.g. Community-acquired pneumonia"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="record-symptoms">Symptoms</Label>
            <Textarea
              id="record-symptoms"
              required
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              placeholder="Presenting symptoms and observations"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="record-medication">Medication prescribed</Label>
            <Textarea
              id="record-medication"
              required
              value={medicationPrescribed}
              onChange={(e) => setMedicationPrescribed(e.target.value)}
              placeholder="Drug, dose, and duration"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="record-experience">
              Patient experience{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id="record-experience"
              value={patientExperience}
              onChange={(e) => setPatientExperience(e.target.value)}
              placeholder="How the patient described the episode"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsUploadPatientsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={addPatientRecords} disabled={!canSubmitRecord}>
            Save record
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog
        open={isAllergiesAndHealthInfoOpen}
        onOpenChange={setIsAllergiesAndHealthInfoOpen}
      >
        <AlertDialogContent>
          <AlertDialogTitle>
            {patientName ?? "Patient"} — health info
          </AlertDialogTitle>
          <AlertDialogDescription>
            {allergiesAndHealthInfo?.createdOn
              ? `Last updated ${new Date(
                  allergiesAndHealthInfo.createdOn
                ).toLocaleDateString()}`
              : "No health information recorded yet."}
          </AlertDialogDescription>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Known allergies</Label>
              <Input readOnly value={allergiesAndHealthInfo?.allergies ?? ""} />
            </div>

            <div className="space-y-2">
              <Label>General health info</Label>
              <Textarea
                readOnly
                value={allergiesAndHealthInfo?.generalHealthInfo ?? ""}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default MedicalRecords;
