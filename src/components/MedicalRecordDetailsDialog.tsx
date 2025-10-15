import {
  AlertCircle,
  Calendar,
  FileText,
  MessageSquare,
  Pill,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
    reviewBy: string,
  ) => void;
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [showPatientReviewList, setShowPatientReviewList] =
    useState<boolean>(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Complete Medical Record
          </DialogTitle>
          <DialogDescription>
            Detailed information for this medical record
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Patient Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Patient Information</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{selectedRecord.name}</p>
              </div>
            </div>
          </div>

          {/* Medical Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="font-medium">Disease & Symptoms</span>
              </div>
              <div className="border border-red-200 rounded-md p-3 bg-red-50">
                <p className="text-sm text-red-900">{selectedRecord.symptom}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Pill className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Medication Prescribed</span>
              </div>
              <div className="border border-purple-200 rounded-md p-3 bg-purple-50">
                <p className="text-sm text-purple-900">
                  {selectedRecord.medicationPrescribed}
                </p>
              </div>
            </div>

            {selectedRecord.patientExperience && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">Patient Experience</span>
                </div>
                <div className="border border-orange-200 rounded-md p-3 bg-orange-50">
                  <p className="text-sm text-orange-900">
                    {selectedRecord.patientExperience}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Record Metadata */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="font-medium">Record Details</span>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Created: {formatDate(selectedRecord.createdOn)}</p>
            </div>
          </div>
        </div>

        {patientStatus === "current" && <Button onClick={patientFeedbackModelView} variant="green">
          Add patient feedback
        </Button>}
        <Button
          onClick={() => {
            getPatientReviewsForMedicalRecord(selectedRecord?._id || "");
            setShowPatientReviewList(true);
          }}
          variant="green"
        >
          Show patient feedback
        </Button>
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
