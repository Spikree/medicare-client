import AddNewPatientDialog from "@/components/addNewPatientDialog";
import PatientAccordion from "@/components/renderPatientAccordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorStore } from "@/store/DoctorStore";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { getPatientList, patientList } = DoctorStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getPatientList();
  }, [getPatientList]);

  const currentPatients = patientList.filter(
    (patient) => patient.patientStatus === "current"
  );
  const oldPatients = patientList.filter(
    (patient) => patient.patientStatus === "old"
  );

  const SearchPatients = () => {
    console.log("Search " + searchQuery);
  };

  return (
    <>
      <Dialog>
        <Card className=" max-w-auto max-h-full p-10 m-4 flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2 max-w-96">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Patients"
                className="pl-10"
              />
            </div>

            <Button variant={"green"} onClick={() => SearchPatients()}>
              Open
            </Button>

            
          </div>

          <div>
            <DialogTrigger asChild>
              <Button variant={"green"}>Add Patient</Button>
            </DialogTrigger>
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
                <PatientAccordion patients={currentPatients} />
              </TabsContent>

              <TabsContent value="old">
                <PatientAccordion patients={oldPatients} />
              </TabsContent>
            </Card>
          </Tabs>
        </Card>
        <AddNewPatientDialog/>
      </Dialog>
    </>
  );
};

export default Dashboard;
