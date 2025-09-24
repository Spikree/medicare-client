import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar,
  Download,
  Eye,
  FileText,
  Loader,
  Plus,
  Upload,
} from "lucide-react";
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
import { useParams } from "react-router-dom";

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
  getAllPatientData: () => void;
  fetchingPatientDetails: boolean;
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
  setIsUploadPatientsDialogOpen,
  getAllPatientData,
  fetchingPatientDetails,
}: Props) => {
  const { authUser } = useAuthStore();

  const patientDetailsByCurrentDoctor = patientDetailsList?.filter(
    (medicalRecord) =>
      medicalRecord.doctor?.toString() === authUser?._id.toString()
  );

  const { patientName } = useParams();

  return (
    <Dialog
      open={isUploadPatientsDialogOpen}
      onOpenChange={setIsUploadPatientsDialogOpen}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="flex flex-col items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
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

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-wrap">
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 w-full sm:w-auto" variant="green">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Upload patient records</span>
              <span className="sm:hidden">Upload Records</span>
            </Button>
          </DialogTrigger>
          <Button onClick={getAllPatientData} variant={"green"} className="w-full sm:w-auto">
            <Download />
            <span className="hidden sm:inline">Download all patient data</span>
            <span className="sm:hidden">Download Data</span>
          </Button>
        </div>
      </div>

      {fetchingPatientDetails ? (
        <div className="flex justify-center p-8 m-8">
          <Loader className="animate-spin" />
        </div>
      ) : patientDetailsList?.length > 0 ? (
        <div className="space-y-4">
          {(showPatientDetailsByCurrentDoctor
            ? patientDetailsByCurrentDoctor
            : patientDetailsList
          ).map((record: PatientDetails) => (
            <Card
              key={record._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Disease
                      </label>
                      <p className="text-sm text-foreground break-words">
                        {record.Disease}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Symptoms
                      </label>
                      <p className="text-sm text-foreground break-words">
                        {record.symptom}
                      </p>
                    </div>
                    <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Date
                      </label>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        {new Date(record.createdOn).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewMore(record)}
                    className="flex items-center gap-2 w-full sm:w-auto lg:ml-4"
                  >
                    <Eye className="h-4 w-4" />
                    View More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[347px]">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Medical Records Yet
            </h3>
            <p className="text-muted-foreground">
              No medical records have been uploaded for this patient.
            </p>
          </div>
        </div>
      )}

      <DialogContent className="sm:max-w-md flex flex-col gap-4 p-4 sm:p-6 sm:mx-0 max-h-[90vh] overflow-y-auto">
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
          className="mt-4 w-full"
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecords;