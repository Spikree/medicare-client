import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Eye, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PatientDetails } from "@/store/DoctorStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Props {
  patientDetailsList: PatientDetails[];
  disease: string;
  symptom: string;
  patientExperience: string;
  medicationPrescribed: string;
  showPatientDetailsByCurrentDoctor: boolean;
  setShowPatientDetailsByCurrentDoctor: (value: boolean) => void;
  setSymptom: (symptom: string) => void;
  setPatientExperience: (patientExperience: string) => void;
  setMedicationPrescribed: (medicationPrescribed: string) => void;
  setDisease: (disease: string) => void;
  handleViewMore: (record: PatientDetails) => void;
  addPatientRecords: () => void;
  isUploadPatientsDialogOpen: boolean;
  setIsUploadPatientsDialogOpen: (value: boolean) => void;
}

const MedicalRecords = ({
  addPatientRecords,
  setMedicationPrescribed,
  setPatientExperience,
  medicationPrescribed,
  patientExperience,
  patientDetailsList,
  handleViewMore,
  disease,
  setDisease,
  symptom,
  setSymptom,
  showPatientDetailsByCurrentDoctor,
  setShowPatientDetailsByCurrentDoctor,
  isUploadPatientsDialogOpen,
  setIsUploadPatientsDialogOpen
}: Props) => {
  const { authUser } = useAuthStore();
  

  const patientDetailsByCurrentDoctor = patientDetailsList.filter(
    (medicalRecord) =>
      medicalRecord.doctor?.toString() === authUser?._id.toString()
  );

  const patientName = patientDetailsList[0]?.name || "Unknown Patient";

  return (
    <Dialog
      open={isUploadPatientsDialogOpen}
      onOpenChange={setIsUploadPatientsDialogOpen}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {patientName}
            </h1>
            <p className="text-muted-foreground">
              Medical Records ({patientDetailsList.length} entries)
            </p>
            <hr className="mt-2" />
            <div className="flex items-center text-muted-foreground mt-2">
              <span className="mr-2">By you</span>
              <Checkbox
                checked={showPatientDetailsByCurrentDoctor}
                onCheckedChange={(checked) =>
                  setShowPatientDetailsByCurrentDoctor(!!checked)
                }
              />
            </div>
          </div>
        </div>

        <DialogTrigger asChild>
          <Button className="flex items-center gap-2" variant="green">
            <Plus className="h-4 w-4" />
            Upload patient records
          </Button>
        </DialogTrigger>
      </div>

      <div className="space-y-4">
        {(showPatientDetailsByCurrentDoctor
          ? patientDetailsByCurrentDoctor
          : patientDetailsList
        ).map((record: PatientDetails) => (
          <Card key={record._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Disease
                    </label>
                    <p className="text-sm text-foreground">{record.Disease}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Symptoms
                    </label>
                    <p className="text-sm text-foreground">{record.symptom}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Date
                    </label>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(record.createdOn).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewMore(record)}
                  className="flex items-center gap-2 ml-4"
                >
                  <Eye className="h-4 w-4" />
                  View More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DialogContent className="sm:max-w-md flex flex-col gap-4 p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Upload className="h-5 w-5" />
            Upload patient records
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Disease</label>
          <Input
            required
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            placeholder="Enter disease"
            className="focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Symptoms</label>
          <Input
            required
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="Enter symptoms"
            className="focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Patient Experience
          </label>
          <Input
            value={patientExperience}
            onChange={(e) => setPatientExperience(e.target.value)}
            placeholder="Enter patient experience"
            className="focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Medication Prescribed
          </label>
          <Input
            required
            value={medicationPrescribed}
            onChange={(e) => setMedicationPrescribed(e.target.value)}
            placeholder="Enter medication prescribed"
            className="focus:ring-2 focus:ring-green-500"
          />
        </div>
        <Button
          onClick={() => {
            addPatientRecords();
          }}
          variant="green"
          className="mt-4"
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecords;
