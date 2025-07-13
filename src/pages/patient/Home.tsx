import { PatientStore } from "@/store/PatientStore";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { TabsList } from "@radix-ui/react-tabs";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import RenderDoctorAccordion from "@/components/renderDoctorAccordion";

const Home = () => {
  const { getDoctorList, getLabResults, getPatientDetails, doctorList } =
    PatientStore();

  useEffect(() => {
    getDoctorList();
    getLabResults();
    getPatientDetails();
  }, [getDoctorList, getLabResults, getPatientDetails]);

  const currentDoctorList = doctorList.filter(
    (doctor) => doctor.patientStatus === "current"
  );

  const oldDoctorList = doctorList.filter(
    (doctor) => doctor.patientStatus === "old"
  );

  return (
    <div>
      <Card className="max-w-auto max-h-full p-10 m-4">
        <Tabs defaultValue="current">
          <TabsList>
            <TabsTrigger value="current">Current Doctors ({currentDoctorList.length})</TabsTrigger>
            <TabsTrigger value="old">Old DOctors ({oldDoctorList.length})</TabsTrigger>
          </TabsList>

          <Card className="py-2 mt-4 border-0 shadow-none">
            <TabsContent value="current">
              <RenderDoctorAccordion doctors={currentDoctorList} />
            </TabsContent>

            <TabsContent value="old">
              <RenderDoctorAccordion doctors={oldDoctorList} />
            </TabsContent>
          </Card>
        </Tabs>
      </Card>
    </div>
  );
};

export default Home;
