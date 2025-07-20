import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { DoctorStore } from "@/store/DoctorStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // 1. Import Tabs components

interface Props {
  setOpen: (value: boolean) => void;
  open: boolean;
}

const AddNewPatientDialog = ({ setOpen, open }: Props) => {
  const [searchPatient, setSearchPatient] = useState("");
  const {
    searchPatients,
    searchPatientList,
    addPatient,
    getPatientList,
    getAllAddRequests,
    incomingAddRequests,
    acceptAddRequest,
  } = DoctorStore();

  const searchPatientFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchPatients(e.target.value);
  };

  const addPatients = (patientId: string) => {
    addPatient(patientId).then((response) => {
      if (response?.status === 200) {
        setOpen(false);
        setSearchPatient("");
        getPatientList();
      }
    });
  };

  const acceptIncomingRequest = (requestId: string) => {
    acceptAddRequest(requestId).then(() => {
      setOpen(false);
      setSearchPatient("");
      getPatientList();
    });
  };

  useEffect(() => {
    getAllAddRequests();
  }, [getAllAddRequests]);

  useEffect(() => {
    if (open === false) {
      setSearchPatient("");
      // When the dialog closes, clear the search results in the store
      searchPatients("");
    }
  }, [open, searchPatients]);

  return (
    <DialogContent className="w-full max-w-2xl mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
      <DialogHeader className="mb-4">
        <DialogTitle className="text-xl sm:text-2xl">
          Manage Patients
        </DialogTitle>
      </DialogHeader>

      {/* 2. Implement Tabs component */}
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search & Add</TabsTrigger>
          <TabsTrigger value="requests">
            Incoming Requests
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
              {incomingAddRequests.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* 3. Move existing search functionality into the first tab */}
        <TabsContent value="search" className="mt-4">
          <Card className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={searchPatient}
                onChange={(e) => {
                  setSearchPatient(e.target.value);
                  searchPatientFunction(e);
                }}
                placeholder="Search Patients with name or email"
                className="pl-10"
              />
            </div>
            {/* The search button can be removed if search happens on type, or kept for manual search */}
            <Button variant="green" className="w-full sm:w-auto">
              Search
            </Button>
          </Card>

          <div className="space-y-3 mt-4">
            {searchPatient ? (
              searchPatientList.length > 0 ? (
                searchPatientList.map((patient, index) => (
                  <Card
                    key={index}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 gap-3 sm:gap-0"
                  >
                    <div className="flex flex-col">
                      <span className="text-base sm:text-lg font-medium">
                        {patient.name}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {patient.email}
                      </p>
                    </div>
                    <Button
                      onClick={() => addPatients(patient?._id)}
                      variant="green"
                      className="w-full sm:w-auto"
                    >
                      Add
                    </Button>
                  </Card>
                ))
              ) : (
                <Card className="flex justify-center p-10">
                  <span className="text-gray-600">No patients found</span>
                </Card>
              )
            ) : (
              <Card className="flex justify-center p-6">
                <span className="text-gray-600">
                  Search results will appear here
                </span>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* 4. Create the "Requests" tab content */}
        <TabsContent value="requests" className="mt-4">
          <div className="space-y-3">
            {incomingAddRequests.length > 0 ? (
              incomingAddRequests.map((request) => (
                <Card
                  key={request._id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 gap-3"
                >
                  <div>
                    <span className="text-base font-medium">
                      {request.sender.name}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {request.sender.email}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => acceptIncomingRequest(request?._id)}
                      variant="green"
                      className="flex-1"
                    >
                      Accept
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      Decline
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="flex justify-center p-10">
                <span className="text-gray-600">No incoming requests</span>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default AddNewPatientDialog;
