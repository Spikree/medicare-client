import AddNewPatientDialog from "@/components/AddNewPatientDialog";
import PatientAccordion from "@/components/PatientAccordian";
import PageHeader from "@/components/PageHeader";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorStore } from "@/store/DoctorStore";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { getPatientList, patientList, fetchingPatientList } = DoctorStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getPatientList();
  }, [getPatientList]);

  const currentPatients = patientList?.filter(
    (patient) => patient.patientStatus === "current"
  );
  const oldPatients = patientList?.filter(
    (patient) => patient.patientStatus === "old"
  );

  const filteredCurrentPatientList = currentPatients?.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOldPatientList = oldPatients?.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-y-6">
        <PageHeader
          title="Patients"
          description="Your active caseload and discharged records."
          actions={
            <DialogTrigger asChild>
              <Button>
                <UserPlus />
                Add patient
              </Button>
            </DialogTrigger>
          }
        />

        <Card>
          <div className="border-b border-border p-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search patients by name"
              className="w-full sm:max-w-sm"
            />
          </div>

          <div className="p-4">
            <Tabs defaultValue="current">
              <TabsList>
                <TabsTrigger value="current">
                  Current
                  <span className="ml-1.5 tabular text-xs text-muted-foreground">
                    {currentPatients.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="old">
                  Discharged
                  <span className="ml-1.5 tabular text-xs text-muted-foreground">
                    {oldPatients.length}
                  </span>
                </TabsTrigger>
              </TabsList>

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
            </Tabs>
          </div>
        </Card>
      </div>

      <AddNewPatientDialog setOpen={setOpen} open={open} />
    </Dialog>
  );
};

export default Dashboard;
