import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoctorStore, type PatientLabResults } from "@/store/DoctorStore";
import type React from "react";
import UploadLabResultsDialog from "@/components/UploadLabResultsDialog";
import LabResultGrid from "@/components/LabResultGrid";
import EmptyState from "@/components/EmptyState";

interface Props {
  patientLabResults: PatientLabResults[];
  setIsUploadLabResultsDialogOpen: (value: boolean) => void;
  isUploadLabResultsDialogOpen: boolean;
  labResultTitle: string;
  setLabResultTitle: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
  handleClick: () => void;
  handleFileUpload: () => void;
}

const PatientLabResultsComponent = ({
  patientLabResults,
  setIsUploadLabResultsDialogOpen,
  isUploadLabResultsDialogOpen,
  labResultTitle,
  setLabResultTitle,
  fileInputRef,
  handleFileChange,
  selectedFile,
  handleClick,
  handleFileUpload,
}: Props) => {
  const { isUploadingLabResults } = DoctorStore();
  const count = patientLabResults?.length ?? 0;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold">
          Lab results
          <span className="ml-2 tabular text-sm font-normal text-muted-foreground">
            {count} {count === 1 ? "result" : "results"}
          </span>
        </h2>

        <Button onClick={() => setIsUploadLabResultsDialogOpen(true)}>
          <Plus />
          Upload lab results
        </Button>
      </div>

      <UploadLabResultsDialog
        open={isUploadLabResultsDialogOpen}
        onOpenChange={setIsUploadLabResultsDialogOpen}
        title={labResultTitle}
        onTitleChange={setLabResultTitle}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onBrowse={handleClick}
        selectedFile={selectedFile}
        onSubmit={handleFileUpload}
        isUploading={isUploadingLabResults}
        description="Attach a lab report to this patient's chart."
      />

      {count > 0 ? (
        <LabResultGrid results={patientLabResults} />
      ) : (
        <EmptyState
          icon={FileText}
          title="No lab results yet"
          description="Lab reports uploaded for this patient will appear here."
        />
      )}
    </div>
  );
};

export default PatientLabResultsComponent;
