import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Plus, Upload, FileText, Calendar, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DoctorStore, type PatientLabResults } from "@/store/DoctorStore";
import type React from "react";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Lab Results</h2>
          <p className="text-muted-foreground">
            {patientLabResults?.length || 0} lab results available
          </p>
        </div>

        <Button
          onClick={() => {
            setIsUploadLabResultsDialogOpen(!isUploadLabResultsDialogOpen);
          }}
          className="flex items-center gap-2 w-full sm:w-auto justify-center"
          variant="green"
        >
          <Plus className="h-4 w-4" />
          Upload Lab Results
        </Button>
      </div>

      <Dialog
        open={isUploadLabResultsDialogOpen}
        onOpenChange={() => {
          setIsUploadLabResultsDialogOpen(!isUploadLabResultsDialogOpen);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Lab Results
            </DialogTitle>
            <DialogDescription>
              Select a file to upload patient lab results or medical documents
            </DialogDescription>
            <span className="text-sm font-medium text-gray-700">Title</span>
            <Input
              value={labResultTitle}
              onChange={(e) => {
                setLabResultTitle(e.target.value);
              }}
              placeholder="Lab result title"
            />
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />

              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {selectedFile ? selectedFile.name : "Choose a file to upload"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, JPG, PNG, DOC, DOCX
                </p>

                <Button
                  onClick={handleClick}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  {selectedFile ? "Change File" : "Select File"}
                </Button>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleFileUpload}
            variant="green"
            disabled={isUploadingLabResults}
          >
            {isUploadingLabResults ? (
              <Loader2 className="animate-spin" />
            ) : (
              // 3. Show only text when not uploading
              "Submit"
            )}
          </Button>
        </DialogContent>
      </Dialog>

      {patientLabResults && patientLabResults.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patientLabResults.map((labResult) => (
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
                    onClick={() => window.open(labResult.labResult, "_blank")}
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
  );
};

export default PatientLabResultsComponent;
