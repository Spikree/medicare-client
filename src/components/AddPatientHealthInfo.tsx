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

const AddPatientHealthInfo = () => {
  const { isAddHealthInfoModalOpen, toggleAddHealthInfoModal } = useUiStore();

  return (
    <AlertDialog
      open={isAddHealthInfoModalOpen}
      onOpenChange={toggleAddHealthInfoModal}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add health info</AlertDialogTitle>
          <AlertDialogDescription>
            Add all the allergies and health info which helps doctors make informed decisions
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input placeholder="Add your allergies"/>
        <Textarea placeholder="Add your healthinfo"/>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={"green"}>Submit</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddPatientHealthInfo;
