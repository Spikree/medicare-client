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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      searchPatients("");
    }
  }, [open, searchPatients]);

  return (
    <DialogContent className="w-full max-w-2xl sm:mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
      <DialogHeader className="mb-4">
        <DialogTitle className="text-xl sm:text-2xl">
          Manage Patients
        </DialogTitle>
      </DialogHeader>

      {/* 2. Implement Tabs component */}
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search" className="text-sm">
            <span className="hidden sm:inline">Search & Add</span>
            <span className="sm:hidden">Search</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="text-sm">
            <span className="hidden sm:inline">Incoming Requests</span>
            <span className="sm:hidden">Requests</span>
            <span className="ml-1 sm:ml-2 inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
              {incomingAddRequests.length}
            </span>
          </TabsTrigger>
        </TabsList>

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
            {/* <Button variant="green" className="w-full sm:w-auto">
              Search
            </Button> */}
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
                      <p className="text-sm text-muted-foreground break-all sm:break-normal">
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
                <Card className="flex justify-center p-6 sm:p-10">
                  <span className="text-gray-600 text-center">
                    No patients found
                  </span>
                </Card>
              )
            ) : (
              <Card className="flex justify-center p-6">
                <span className="text-gray-600 text-center">
                  Search results will appear here
                </span>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <div className="space-y-3">
            {incomingAddRequests.length > 0 ? (
              incomingAddRequests.map((request) => (
                <Card
                  key={request._id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-base font-medium block truncate">
                      {request.sender.name}
                    </span>
                    <p className="text-sm text-muted-foreground break-all sm:break-normal">
                      {request.sender.email}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => acceptIncomingRequest(request?._id)}
                      variant="green"
                      className="flex-1 sm:flex-none"
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 sm:flex-none"
                    >
                      Decline
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="flex justify-center p-6 sm:p-10">
                <span className="text-gray-600 text-center">
                  No incoming requests
                </span>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default AddNewPatientDialog;
