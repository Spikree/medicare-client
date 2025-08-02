import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const UploadLabResults = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Lab Results</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Label htmlFor="lab-file">Select PDF or Image File</Label>
          <input
            id="lab-file"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="file-input border border-gray-300 rounded px-3 py-2 w-full"
          />
          {fileName && <p className="text-sm text-muted-foreground">Selected: {fileName}</p>}
        </div>

        <DialogFooter>
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadLabResults;
