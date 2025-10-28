import BreadcrumbElement from "@/components/BreadcrumbElement";
import DoctorDetailsComponent from "@/components/DoctorDetailsComponent";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { PatientStore } from "@/store/PatientStore";
import type { DoctorDetailsInterface } from "@/store/PatientStore";
import { TabsList } from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MedicalRecordDetailsDialog from "@/components/MedicalRecordDetailsDialog";
import PatientLabResultsByDoctor from "@/components/PatientLabResultsByDoctor";

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const { doctorStatus } = useParams();
  const {
    getDoctorDetails,
    doctorDetailsList,
    getPatientReviews,
    addPatientReview,
    patientReview,
    getLabResultsByDoctor,
    isFetchingLabResultsByDoctor,
    LabResultsByDoctorList,
    isFetchingPatientReviews,
    isFetchingDoctorDetails,
    getDoctorDataAccessInfo,
    doctorDataAccessInfo
  } = PatientStore();

  const [selectedRecord, setSelectedRecord] =
    useState<DoctorDetailsInterface | null>(null);
  const [isViewMoreDialogOpen, setIsViewMoreDialogOpen] =
    useState<boolean>(false);
  const [showPatientFeedbackModel, setShowPatientFeedbackModel] =
    useState<boolean>(false);

  useEffect(() => {
    if (doctorId) {
      getDoctorDetails(doctorId);
      getDoctorDataAccessInfo(doctorId);
    }
  }, [doctorId, getDoctorDetails, getDoctorDataAccessInfo]);

  const handleViewMore = (record: DoctorDetailsInterface) => {
    setSelectedRecord(record);
    setIsViewMoreDialogOpen(true);
  };

  const patientFeedbackModelView = () => {
    setShowPatientFeedbackModel((prev) => !prev);
  };

  const getPatientReviewsForMedicalRecord = (patientDetailId: string) => {
    getPatientReviews(patientDetailId);
  };

  const addPatientFeedback = (
    patientDetailId: string,
    patientReview: string,
    sideEffects: string,
    reviewBy: string
  ) => {
    addPatientReview(patientDetailId, patientReview, sideEffects, reviewBy);
  };

  const breadcrumbItems: { name: string; link: string }[] = [];

  return (
    <Dialog>
      <BreadcrumbElement items={breadcrumbItems} currentPage="Doctor Details" />
      <div className="w-full p-6">
        <Tabs defaultValue="current">
          <TabsList>
            <TabsTrigger value="current">Patient Record</TabsTrigger>
            <TabsTrigger value="old">Lab Results</TabsTrigger>
          </TabsList>

          <Card className="py-2 mt-4 border-0 shadow-none">
            <TabsContent className="p-6" value="current">
              {doctorStatus && (
                <DoctorDetailsComponent
                doctorDataAccessInfo={doctorDataAccessInfo}
                  doctorDetailsList={doctorDetailsList}
                  handleViewMore={handleViewMore}
                  doctorStatus={doctorStatus}
                  isFetchingDoctorDetails={isFetchingDoctorDetails}
                />
              )}

              {selectedRecord && (
                <MedicalRecordDetailsDialog
                  patientStatus={doctorStatus}
                  setIsDialogOpen={setIsViewMoreDialogOpen}
                  isDialogOpen={isViewMoreDialogOpen}
                  selectedRecord={selectedRecord}
                  showPatientFeedbackModel={showPatientFeedbackModel}
                  patientFeedbackModelView={patientFeedbackModelView}
                  getPatientReviewsForMedicalRecord={
                    getPatientReviewsForMedicalRecord
                  }
                  addPatientFeedback={addPatientFeedback}
                  patientReview={patientReview}
                  isFetchingPatientReviews={isFetchingPatientReviews}
                />
              )}
            </TabsContent>

            <TabsContent className="p-6" value="old">
              {/* add patient lab results by current doctor component */}
              {doctorId && (
                <PatientLabResultsByDoctor
                  doctorId={doctorId}
                  getLabResultsByDoctor={getLabResultsByDoctor}
                  LabResultsByDoctorList={LabResultsByDoctorList}
                  isFetchingLabResultsByDoctor={isFetchingLabResultsByDoctor}
                />
              )}
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </Dialog>
  );
};

export default DoctorDetails;
