import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { DoctorStore } from "@/store/DoctorStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inbox, SearchX, UserRoundSearch } from "lucide-react";
import SearchInput from "@/components/SearchInput";
import PersonRow from "@/components/PersonRow";
import EmptyState from "@/components/EmptyState";

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

  const handleSearchChange = (value: string) => {
    setSearchPatient(value);
    searchPatients(value);
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
    <DialogContent className="w-[95vw] max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add patients</DialogTitle>
        <DialogDescription>
          Search for a patient to invite, or accept a request someone sent you.
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {incomingAddRequests.length > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold tabular text-primary-foreground">
                {incomingAddRequests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <SearchInput
            value={searchPatient}
            onChange={handleSearchChange}
            placeholder="Search patients by name or email"
          />

          {!searchPatient ? (
            <EmptyState
              icon={UserRoundSearch}
              title="Search for a patient"
              description="Results will appear here as you type."
            />
          ) : searchPatientList.length > 0 ? (
            <ul className="space-y-2">
              {searchPatientList.map((patient) => (
                <PersonRow
                  key={patient._id}
                  name={patient.name}
                  email={patient.email}
                  actions={
                    <Button size="sm" onClick={() => addPatients(patient?._id)}>
                      Add
                    </Button>
                  }
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={SearchX}
              title="No patients found"
              description="Check the spelling, or try searching by email instead."
            />
          )}
        </TabsContent>

        <TabsContent value="requests">
          {incomingAddRequests.length > 0 ? (
            <ul className="space-y-2">
              {incomingAddRequests.map((request) => (
                <PersonRow
                  key={request._id}
                  name={request.sender.name}
                  email={request.sender.email}
                  actions={
                    <>
                      <Button
                        size="sm"
                        onClick={() => acceptIncomingRequest(request?._id)}
                      >
                        Accept
                      </Button>
                      <Button size="sm" variant="outline">
                        Decline
                      </Button>
                    </>
                  }
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Inbox}
              title="No incoming requests"
              description="Patients who ask to connect with you will show up here."
            />
          )}
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default AddNewPatientDialog;
