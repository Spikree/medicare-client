import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void | Promise<void>;
  onSubmit: (
    patientDetailId: string,
    patientReview: string,
    sideEffects: string,
    reviewBy: string
  ) => void | Promise<void>;
  patientDetailId: string;
}

const AddPatientFeedbackDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  patientDetailId,
}: props) => {
  const [patientReview, setPatientReview] = useState("");
  const [sideEffects, setSideEffects] = useState("");
  const reviewBy = localStorage.getItem("user_role") || "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Promise.resolve(
      onSubmit(patientDetailId, patientReview, sideEffects, reviewBy)
    ).then(() => {
      setPatientReview("");
      setSideEffects("");
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add feedback</DialogTitle>
          <DialogDescription>
            Record how the patient responded to this course of treatment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientReview">Review</Label>
            <Textarea
              id="patientReview"
              value={patientReview}
              onChange={(e) => setPatientReview(e.target.value)}
              placeholder="How the treatment went"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sideEffects">
              Side effects{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id="sideEffects"
              value={sideEffects}
              onChange={(e) => setSideEffects(e.target.value)}
              placeholder="Any adverse reactions observed"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!patientReview.trim()}>
              Submit feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientFeedbackDialog;
