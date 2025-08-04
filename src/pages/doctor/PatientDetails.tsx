import { DoctorStore } from "@/store/DoctorStore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";

import { Dialog } from "@/components/ui/dialog";
import { Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreadcrumbElement from "@/components/BreadcrumbElement";
import MedicalRecords from "@/components/MedicalRecords";
import { toast } from "sonner";
import MedicalRecordDetailsDialog from "@/components/MedicalRecordDetailsDialog";
import type { PatientDetails } from "@/store/DoctorStore";
import PatientLabResultsComponent from "@/components/PatientLabResultsComponent";
import { downloadPatientDataPdf } from "@/utils/downloadPatientData";
import { type PatientAllData } from "@/store/PatientStore";

const PatientDetailsPage = () => {
  const { patientId } = useParams();
  const {
    getPatientDetails,
    patientDetailsList,
    uploadLabResults,
    getPatientLabResults,
    patientLabResults,
    addPatientDetails,
    addPatientReview,
    getPatientReviews,
    patientReview,
    getAllPatientInfo,
  } = DoctorStore();
  const [selectedRecord, setSelectedRecord] = useState<PatientDetails | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isUploadLabResultsDialogOpen, setIsUploadLabResultsDialogOpen] =
    useState<boolean>(false);
  const [isUploadPatientsDialogOpen, setIsUploadPatientsDialogOpen] =
    useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [labResultTitle, setLabResultTitle] = useState("");
  const [disease, setDisease] = useState("");
  const [symptom, setSymptom] = useState("");
  const [showPatientFeedbackModel, setShowPatientFeedbackModel] =
    useState(false);
  const [patientExperience, setPatientExperience] = useState("");
  const [medicationPrescribed, setMedicationPrescribed] = useState("");
  const [
    showPatientDetailsByCurrentDoctor,
    setShowPatientDetailsByCurrentDoctor,
  ] = useState<boolean>(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getAllPatientData = () => {
    if (patientId) {
      getAllPatientInfo(patientId)
        .then((patientData) => {
          if (patientData) {
            downloadPatientDataPdf(patientData as unknown as PatientAllData);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch patient data:", error);
        });
    }
  };

  const getPatientReviewsForMedicalRecord = (patientDetailId: string) => {
    getPatientReviews(patientDetailId);
  };

  const patientFeedbackModelView = () => {
    setShowPatientFeedbackModel((prev) => !prev);
  };

  const addPatientFeedback = (
    patientDetailId: string,
    patientReview: string,
    sideEffects: string,
    reviewBy: string
  ) => {
    addPatientReview(patientDetailId, patientReview, sideEffects, reviewBy);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file.name);
    }
  };

  const addPatientRecords = async () => {
    if (patientId && disease && symptom && medicationPrescribed) {
      await addPatientDetails(
        patientId,
        disease,
        symptom,
        patientExperience,
        medicationPrescribed
      );
      setDisease("");
      setSymptom("");
      setPatientExperience("");
      setMedicationPrescribed("");
      await getPatientDetails(patientId);
      setIsUploadPatientsDialogOpen(false);
    }
  };

  const handleFileUpload = () => {
    if (patientId && selectedFile && labResultTitle) {
      uploadLabResults(patientId, selectedFile, labResultTitle)
        .then(() => {
          setSelectedFile(null);
          setLabResultTitle("");
          setIsUploadLabResultsDialogOpen(false);
          getPatientLabResults(patientId || "");
        })
        .catch(() => {});
    } else {
      toast.error("All the fields are required");
    }
  };

  useEffect(() => {
    getPatientDetails(patientId || "");
    getPatientLabResults(patientId || "");
  }, [getPatientDetails, patientId, getPatientLabResults]);

  if (!patientDetailsList) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading patient details...</p>
        </div>
      </div>
    );
  }

  const handleViewMore = (record: PatientDetails) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const breadcrumbItems: { name: string; link: string }[] = [];

  return (
    <Dialog>
      <BreadcrumbElement
        items={breadcrumbItems}
        currentPage="Patient Details"
      />
      <div className="w-full p-6">
        <Tabs defaultValue="current">
          <TabsList>
            <TabsTrigger value="current">Patient Record</TabsTrigger>
            <TabsTrigger value="old">Lab Results</TabsTrigger>
          </TabsList>

          <Card className="py-2 mt-4 border-0 shadow-none">
            <TabsContent className="p-6" value="current">
              <MedicalRecords
                handleViewMore={handleViewMore}
                disease={disease}
                symptom={symptom}
                patientExperience={patientExperience}
                medicationPrescribed={medicationPrescribed}
                setSymptom={setSymptom}
                setPatientExperience={setPatientExperience}
                setMedicationPrescribed={setMedicationPrescribed}
                setDisease={setDisease}
                addPatientRecords={addPatientRecords}
                patientDetailsList={patientDetailsList}
                setShowPatientDetailsByCurrentDoctor={
                  setShowPatientDetailsByCurrentDoctor
                }
                showPatientDetailsByCurrentDoctor={
                  showPatientDetailsByCurrentDoctor
                }
                isUploadPatientsDialogOpen={isUploadPatientsDialogOpen}
                setIsUploadPatientsDialogOpen={setIsUploadPatientsDialogOpen}
                getAllPatientData={getAllPatientData}
              />

              {/* Details Dialog */}
              {selectedRecord && (
                <MedicalRecordDetailsDialog
                  patientReview={patientReview}
                  setIsDialogOpen={setIsDialogOpen}
                  isDialogOpen={isDialogOpen}
                  selectedRecord={selectedRecord}
                  showPatientFeedbackModel={showPatientFeedbackModel}
                  patientFeedbackModelView={patientFeedbackModelView}
                  getPatientReviewsForMedicalRecord={
                    getPatientReviewsForMedicalRecord
                  }
                  addPatientFeedback={addPatientFeedback}
                />
              )}
            </TabsContent>

            <TabsContent className="p-6" value="old">
              <PatientLabResultsComponent
                patientLabResults={patientLabResults}
                setIsUploadLabResultsDialogOpen={
                  setIsUploadLabResultsDialogOpen
                }
                isUploadLabResultsDialogOpen={isUploadLabResultsDialogOpen}
                labResultTitle={labResultTitle}
                setLabResultTitle={setLabResultTitle}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
                selectedFile={selectedFile}
                handleClick={handleClick}
                handleFileUpload={handleFileUpload}
              />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </Dialog>
  );
};

export default PatientDetailsPage;
