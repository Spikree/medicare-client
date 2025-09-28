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
import { useEffect, useState } from "react";
// import { CommonStore } from "@/store/CommonStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Label } from "@radix-ui/react-label";

const AddPatientHealthInfo = () => {
  const {
    addAllergiesAndHealthinfo,
    getAllergiesAndHealthinfo,
    allergiesAndHealthInfo,
  } = PatientStore();
  const { isAddHealthInfoModalOpen, toggleAddHealthInfoModal } = useUiStore();
  const { authUser } = useAuthStore();

  const [allergies, setAllergies] = useState<string>("");
  const [healthInfo, setHealthInfo] = useState<string>("");
  const [isEditingHealthInfo, setIsEditingHealthInfo] =
    useState<boolean>(false);

  useEffect(() => {
    if (authUser) {
      getAllergiesAndHealthinfo(authUser?._id);
    }
  }, [getAllergiesAndHealthinfo, authUser]);

  useEffect(() => {
    if (allergiesAndHealthInfo) {
      setAllergies(allergiesAndHealthInfo?.allergies);
      setHealthInfo(allergiesAndHealthInfo?.generalHealthInfo);
    }
  }, [allergiesAndHealthInfo]);

  return (
    <AlertDialog
      open={isAddHealthInfoModalOpen}
      onOpenChange={toggleAddHealthInfoModal}
    >
      {isEditingHealthInfo ? (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add health info</AlertDialogTitle>
            <AlertDialogDescription>
              Add all the allergies and health info which helps doctors make
              informed decisions
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            Known Allergies
          </Label>

          <Input
            value={allergies}
            onChange={(e) => {
              setAllergies(e.target.value);
            }}
            placeholder="Add your allergies"
          />

          <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            General healthInfo
          </Label>
          <Textarea
            value={healthInfo}
            onChange={(e) => {
              setHealthInfo(e.target.value);
            }}
            placeholder="Add your healthinfo"
          />
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsEditingHealthInfo(!isEditingHealthInfo)}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={() => {
                addAllergiesAndHealthinfo(allergies, healthInfo);
              }}
              variant={"green"}
            >
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : (
        <AlertDialogContent>
          <AlertDialogTitle>Health info</AlertDialogTitle>
          <AlertDialogDescription>
            This data will help doctors make an informed decision
          </AlertDialogDescription>

          <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            Known Allergies
          </Label>

          <Input readOnly value={allergiesAndHealthInfo?.allergies} />
          <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            General healthInfo
          </Label>
          <Textarea
            readOnly
            value={allergiesAndHealthInfo?.generalHealthInfo}
          />

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Button
              onClick={() => setIsEditingHealthInfo(!isEditingHealthInfo)}
              variant={"green"}
              className="flex items-center gap-2"
            >
              Edit Information
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default AddPatientHealthInfo;
