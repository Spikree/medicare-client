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
import { Label } from "./ui/label";
import { PatientStore } from "@/store/PatientStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Pencil } from "lucide-react";

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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEditingHealthInfo ? "Edit health info" : "Health info"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Allergies and background conditions help your clinicians make
            informed decisions about your care.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-2">
            <Label htmlFor="allergies">Known allergies</Label>
            <Input
              id="allergies"
              readOnly={!isEditingHealthInfo}
              value={
                isEditingHealthInfo
                  ? allergies
                  : allergiesAndHealthInfo?.allergies ?? ""
              }
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, peanuts"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="general-health-info">General health info</Label>
            <Textarea
              id="general-health-info"
              readOnly={!isEditingHealthInfo}
              value={
                isEditingHealthInfo
                  ? healthInfo
                  : allergiesAndHealthInfo?.generalHealthInfo ?? ""
              }
              onChange={(e) => setHealthInfo(e.target.value)}
              placeholder="Ongoing conditions, medication you take regularly, anything a clinician should know"
            />
          </div>
        </div>

        <AlertDialogFooter>
          {isEditingHealthInfo ? (
            <>
              <AlertDialogCancel onClick={() => setIsEditingHealthInfo(false)}>
                Cancel
              </AlertDialogCancel>
              <Button
                onClick={() => {
                  addAllergiesAndHealthinfo(allergies, healthInfo);
                  setIsEditingHealthInfo(false);
                }}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <Button onClick={() => setIsEditingHealthInfo(true)}>
                <Pencil />
                Edit information
              </Button>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddPatientHealthInfo;
