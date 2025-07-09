import AddNewPatientDialog from "@/components/AddNewPatientDialog";
import PatientAccordion from "@/components/renderPatientAccordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorStore } from "@/store/DoctorStore";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Patient as PatientInterface } from "@/store/DoctorStore";

const Dashboard = () => {
  const { getPatientList, patientList } = DoctorStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [searchPatientList, setSearchPatientList] = useState<
    PatientInterface[]
  >([]);

  useEffect(() => {
    getPatientList();
  }, [getPatientList]);

  useEffect(() => {
    const filteredList = patientList.filter((patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchPatientList(filteredList);
  }, [searchQuery, patientList]);

  const currentPatients = patientList.filter(
    (patient) => patient.patientStatus === "current"
  );
  const oldPatients = patientList.filter(
    (patient) => patient.patientStatus === "old"
  );

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Card className=" max-w-auto max-h-full p-10 m-4 flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2 max-w-96">
            <div className="relative w-full">
              {searchQuery.length !== 0 ? (
                <X className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" onClick={() => clearSearch()} />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              )}
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Patients by name"
                className="pl-10"
              />
            </div>
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

            <Card className="py-2 mt-4 border-0 shadow-none">
              <TabsContent value="current">
                <PatientAccordion
                  patients={
                    searchPatientList.length !== 0
                      ? searchPatientList
                      : currentPatients
                  }
                />
              </TabsContent>

              <TabsContent value="old">
                <PatientAccordion patients={oldPatients} />
              </TabsContent>
            </Card>
          </Tabs>
        </Card>
        <AddNewPatientDialog setOpen={setOpen} open={open} />
      </Dialog>
    </>
  );
};

export default Dashboard;
