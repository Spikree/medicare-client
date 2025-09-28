import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useUiStore } from "@/store/UiStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { PatientStore } from "@/store/PatientStore";
import { useState } from "react";

const AddPatientHealthInfo = () => {
  const { addAllergiesAndHealthinfo } = PatientStore();
  const { isAddHealthInfoModalOpen, toggleAddHealthInfoModal } = useUiStore();

  const [allergies, setAllergies] = useState<string>("");
  const [healthInfo, setHealthInfo] = useState<string>("");

  return (
    <AlertDialog
      open={isAddHealthInfoModalOpen}
      onOpenChange={toggleAddHealthInfoModal}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add health info</AlertDialogTitle>
          <AlertDialogDescription>
            Add all the allergies and health info which helps doctors make
            informed decisions
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          onChange={(e) => {
            setAllergies(e.target.value);
          }}
          placeholder="Add your allergies"
        />
        <Textarea
          onChange={(e) => {
            setHealthInfo(e.target.value);
          }}
          placeholder="Add your healthinfo"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={() => {
              addAllergiesAndHealthinfo(allergies, healthInfo);
            }}
            variant={"green"}
          >
            Submit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddPatientHealthInfo;
