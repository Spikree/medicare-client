import AddNewPatientDialog from "@/components/AddNewPatientDialog";
import PatientAccordion from "@/components/PatientAccordian";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorStore } from "@/store/DoctorStore";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { getPatientList, patientList, fetchingPatientList } = DoctorStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getPatientList();
  }, [getPatientList]);

  const currentPatients = patientList.filter(
    (patient) => patient.patientStatus === "current"
  );
  const oldPatients = patientList.filter(
    (patient) => patient.patientStatus === "old"
  );

  const filteredCurrentPatientList = currentPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOldPatientList = oldPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <Dialog  open={open} onOpenChange={setOpen} >
        <Card className="max-w-auto max-h-full p-4 sm:p-10 m-2  sm:m-4 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-2 justify-between">
          <div className="flex gap-2 w-full sm:max-w-96">
            <div className="relative w-full">
              {searchQuery.length !== 0 ? (
                <X
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer"
                  onClick={() => clearSearch()}
                />
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

          <div className="w-full sm:w-auto">
            <DialogTrigger asChild>
              <Button variant={"green"} className="w-full sm:w-auto">Add Patient</Button>
            </DialogTrigger>
          </div>
        </Card>

        <Card className="max-w-auto max-h-full p-4 sm:p-10 m-2 sm:m-4 mt-4">
          <Tabs defaultValue="current">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Current Patients ({currentPatients.length})</span>
                <span className="sm:hidden">Current ({currentPatients.length})</span>
              </TabsTrigger>
              <TabsTrigger value="old" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Old Patients ({oldPatients.length})</span>
                <span className="sm:hidden">Old ({oldPatients.length})</span>
              </TabsTrigger>
            </TabsList>

            <Card className="py-2 mt-4 border-0 shadow-none">
              <TabsContent value="current">
                <PatientAccordion
                  fetchingPatientList={fetchingPatientList}
                  patientStatus="current"
                  patients={filteredCurrentPatientList}
                />
              </TabsContent>

              <TabsContent value="old">
                <PatientAccordion
                  fetchingPatientList={fetchingPatientList}
                  patientStatus="old"
                  patients={filteredOldPatientList}
                />
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