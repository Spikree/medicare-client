import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
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
    reviewBy: string,
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
  const reviewBy = localStorage.getItem("user_role") || ""

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Promise.resolve(onSubmit(patientDetailId, patientReview, sideEffects, reviewBy)).then(
      () => {
        setPatientReview("");
        setSideEffects("");
        onOpenChange(false);
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Patient Feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="patientReview">Patient Review</Label>
            <Textarea
              id="patientReview"
              value={patientReview}
              onChange={(e) => setPatientReview(e.target.value)}
              placeholder="Enter patient review..."
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sideEffects">Side Effects</Label>
            <Textarea
              id="sideEffects"
              value={sideEffects}
              onChange={(e) => setSideEffects(e.target.value)}
              placeholder="Enter any side effects..."
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button variant={"green"} type="submit">
              Submit Feedback
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientFeedbackDialog;
