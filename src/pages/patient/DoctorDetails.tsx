import BreadcrumbElement from "@/components/BreadcrumbElement";
import DoctorDetailsComponent from "@/components/DoctorDetailsComponent";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { PatientStore } from "@/store/PatientStore";
import { TabsList } from "@radix-ui/react-tabs";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const DoctorDetails = () => {
  const { doctorId } = useParams();
  const { getDoctorDetails, doctorDetailsList } = PatientStore();

  useEffect(() => {
    if (doctorId) {
      getDoctorDetails(doctorId);
    }
  }, [doctorId, getDoctorDetails]);

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
              <DoctorDetailsComponent doctorDetailsList={doctorDetailsList} />
            </TabsContent>

            <TabsContent className="p-6" value="old"></TabsContent>
          </Card>
        </Tabs>
      </div>
    </Dialog>
  );
};

export default DoctorDetails;
