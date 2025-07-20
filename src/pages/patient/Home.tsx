import { PatientStore } from "@/store/PatientStore";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TabsList } from "@radix-ui/react-tabs";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import type { DoctorInterface } from "@/store/PatientStore";
import RenderDoctorAccordion from "@/components/RenderDoctorAccordion";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddNewDoctorDialog from "@/components/AddNewDoctorDialog";

const Home = () => {
  const {
    getDoctorList,
    getLabResults,
    // getPatientDetails,
    doctorList,
    getAllAddRequests,
    IncomingAddRequests,
    acceptAddRequest,
  } = PatientStore();
  const [isAddDoctorDialog, setIsAddDoctorDialog] = useState<boolean>(false);

  useEffect(() => {
    getDoctorList();
    getLabResults();
    // getPatientDetails();
    getAllAddRequests();
  }, [getDoctorList, getLabResults, getAllAddRequests]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchDoctorList, setSearchDoctorList] = useState<DoctorInterface[]>(
    []
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    const filteredList = doctorList.filter((doctor) =>
      doctor.doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchDoctorList(filteredList);
  }, [searchQuery, doctorList]);

  const currentDoctorList = doctorList.filter(
    (doctor) => doctor.patientStatus === "current"
  );

  const oldDoctorList = doctorList.filter(
    (doctor) => doctor.patientStatus === "old"
  );

  return (
    <Dialog
      open={isAddDoctorDialog}
      onOpenChange={() => {
        setIsAddDoctorDialog((prev) => !prev);
      }}
    >
      <div>
        <Card className=" max-w-auto max-h-full p-10 m-4 flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2 max-w-96">
            <div className="relative w-full">
              {searchQuery.length !== 0 ? (
                <X
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4"
                  onClick={() => clearSearch()}
                />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              )}
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Doctors by name"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <DialogTrigger asChild>
              <Button variant={"green"}>Add Doctor</Button>
            </DialogTrigger>
          </div>
        </Card>
        <Card className="max-w-auto max-h-full p-10 m-4">
          <Tabs defaultValue="current">
            <TabsList>
              <TabsTrigger value="current">
                Current Doctors ({currentDoctorList.length})
              </TabsTrigger>
              <TabsTrigger value="old">
                Old DOctors ({oldDoctorList.length})
              </TabsTrigger>
            </TabsList>

            <Card className="py-2 mt-4 border-0 shadow-none">
              <TabsContent value="current">
                <RenderDoctorAccordion
                  doctors={
                    searchDoctorList.length === 0
                      ? currentDoctorList
                      : searchDoctorList
                  }
                />
              </TabsContent>

              <TabsContent value="old">
                <RenderDoctorAccordion doctors={oldDoctorList} />
              </TabsContent>
            </Card>
          </Tabs>
        </Card>
        <AddNewDoctorDialog
          acceptAddRequest={acceptAddRequest}
          open={isAddDoctorDialog}
          setOpen={setIsAddDoctorDialog}
          addRequests={IncomingAddRequests}
        />
      </div>
    </Dialog>
  );
};

export default Home;
