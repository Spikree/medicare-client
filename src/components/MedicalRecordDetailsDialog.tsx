import { Activity, Calendar, MessageSquare, Pill, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PatientDetails } from "@/store/DoctorStore";
import AddPatientFeedbackDialog from "./AddPatientFeedbackDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PatientReviewsList from "./PatientReviewsList";
import type { DoctorDetailsInterface } from "@/store/PatientStore";
import type { PatientReview } from "@/store/PatientStore";

interface Props {
  selectedRecord: PatientDetails | DoctorDetailsInterface;
  patientReview: PatientReview[];
  showPatientFeedbackModel: boolean;
  patientStatus: string | undefined;
  isDialogOpen: boolean;
  isFetchingPatientReviews: boolean;
  patientFeedbackModelView: () => void;
  setIsDialogOpen: (value: boolean) => void;
  getPatientReviewsForMedicalRecord: (patientDetailId: string) => void;
  addPatientFeedback: (
    patientDetailId: string,
    patientReview: string,
    sideEffects: string,
    reviewBy: string
  ) => void;
}

function Section({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </h3>
      <div className="mt-2 rounded-md border border-border bg-muted/40 p-3 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

const MedicalRecordDetailsDialog = ({
  patientStatus,
  selectedRecord,
  patientFeedbackModelView,
  getPatientReviewsForMedicalRecord,
  showPatientFeedbackModel,
  addPatientFeedback,
  isDialogOpen,
  setIsDialogOpen,
  patientReview,
  isFetchingPatientReviews,
}: Props) => {
  const [showPatientReviewList, setShowPatientReviewList] =
    useState<boolean>(false);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="w-[95vw] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Medical record</DialogTitle>
          <DialogDescription>
            Full detail for this entry in the patient&rsquo;s chart.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <dl className="grid gap-4 rounded-md border border-border p-4 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Patient
              </dt>
              <dd className="mt-1 truncate text-sm font-medium">
                {selectedRecord.name}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Recorded
              </dt>
              <dd className="tabular mt-1 text-sm">
                {formatDate(selectedRecord.createdOn)}
              </dd>
            </div>
          </dl>

          <Section icon={Activity} label="Diagnosis &amp; symptoms">
            {selectedRecord.symptom}
          </Section>

          <Section icon={Pill} label="Medication prescribed">
            {selectedRecord.medicationPrescribed}
          </Section>

          {selectedRecord.patientExperience && (
            <Section icon={MessageSquare} label="Patient experience">
              {selectedRecord.patientExperience}
            </Section>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              getPatientReviewsForMedicalRecord(selectedRecord?._id || "");
              setShowPatientReviewList(true);
            }}
          >
            View feedback
          </Button>

          {patientStatus === "current" && (
            <Button onClick={patientFeedbackModelView}>Add feedback</Button>
          )}
        </DialogFooter>

        {showPatientFeedbackModel && (
          <AddPatientFeedbackDialog
            isOpen={showPatientFeedbackModel}
            onOpenChange={patientFeedbackModelView}
            onSubmit={addPatientFeedback}
            patientDetailId={selectedRecord?._id || ""}
          />
        )}
      </DialogContent>

      <PatientReviewsList
        isFetchingPatientReviews={isFetchingPatientReviews}
        patientReview={patientReview}
        isOpen={showPatientReviewList}
        setIsOpen={setShowPatientReviewList}
      />
    </Dialog>
  );
};

export default MedicalRecordDetailsDialog;
