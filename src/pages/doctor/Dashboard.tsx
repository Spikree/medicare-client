import PatientAccordion from "@/components/renderPatientAccordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorStore } from "@/store/DoctorStore";
import { Search } from "lucide-react";
import { useEffect } from "react";

const Dashboard = () => {
  const { getPatientList, patientList } = DoctorStore();

  useEffect(() => {
    getPatientList();
  }, [getPatientList]);

  const currentPatients = patientList.filter(
    (patient) => patient.patientStatus === "current"
  );
  const oldPatients = patientList.filter(
    (patient) => patient.patientStatus === "old"
  );

  return (
    <>
      <Card className=" max-w-auto max-h-full p-10 m-4 flex justify-between">
        <div className="flex gap-2 max-w-96">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search Patients" className="pl-10" />
          </div>
          <Button>Search</Button>
        </div>

        <div>
          <Button>Add Patient</Button>
        </div>
      </Card>

      <Card className="max-w-auto max-h-full p-10 m-4">
        <Tabs defaultValue="current">
          <TabsList>
            <TabsTrigger value="current">
              Current Patients ({currentPatients.length})
            </TabsTrigger>
            <TabsTrigger value="old">
              Old Patients ({oldPatients.length})
            </TabsTrigger>
          </TabsList>

          <Card className="py-2 mt-4">
            <TabsContent value="current">
              {/* add accordian from shadcn */}
              <PatientAccordion patients={currentPatients} />
            </TabsContent>

            <TabsContent value="old">
              {/* add accordian from shadcn */}
              <PatientAccordion patients={oldPatients} />
            </TabsContent>
          </Card>
        </Tabs>
      </Card>
    </>
  );
};

export default Dashboard;
