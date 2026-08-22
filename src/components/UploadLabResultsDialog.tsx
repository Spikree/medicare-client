import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Loader2, Upload, X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBrowse: () => void;
  onClearFile?: () => void;
  selectedFile: File | null;
  onSubmit: () => void;
  isUploading: boolean;
  description?: string;
};

const ACCEPTED = ".pdf,.jpg,.jpeg,.png,.doc,.docx";

/**
 * Single upload dialog shared by the patient's own upload flow and the
 * clinician-side upload on a patient's chart.
 */
export function UploadLabResultsDialog({
  open,
  onOpenChange,
  title,
  onTitleChange,
  fileInputRef,
  onFileChange,
  onBrowse,
  onClearFile,
  selectedFile,
  onSubmit,
  isUploading,
  description = "Attach a lab report or medical document to this record.",
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload lab results</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lab-result-title">Title</Label>
            <Input
              id="lab-result-title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Complete blood count"
            />
          </div>

          <div className="space-y-2">
            <Label>File</Label>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={onFileChange}
              accept={ACCEPTED}
            />

            {selectedFile ? (
              <div className="flex items-center gap-3 rounded-md border border-border bg-muted/50 p-3">
                <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="tabular text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onBrowse}>
                  Change
                </Button>
                {onClearFile && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onClearFile}
                    aria-label="Remove selected file"
                  >
                    <X />
                  </Button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onBrowse}
                className="flex w-full flex-col items-center gap-2 rounded-md border border-dashed border-input bg-muted/30 px-6 py-8 text-center transition-colors hover:border-ring hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Choose a file to upload
                </span>
                <span className="text-xs text-muted-foreground">
                  PDF, JPG, PNG, DOC or DOCX
                </span>
              </button>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isUploading || !selectedFile || !title.trim()}
          >
            {isUploading && <Loader2 className="animate-spin" />}
            {isUploading ? "Uploading…" : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadLabResultsDialog;
